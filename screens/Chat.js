import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebaseConfig";

const Chat = () => {
  const route = useRoute();
  const { chatId } = route.params;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const currentUser = auth.currentUser;
  const myId = currentUser?.uid;

  // Live message feed for this chat, newest first (FlatList is inverted).
  useEffect(() => {
    const messagesQuery = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            // serverTimestamp() is null until the write is acknowledged.
            createdAt: data.createdAt?.toDate?.() ?? new Date(),
            user: data.user,
          };
        })
      );
    });

    return unsubscribe;
  }, [chatId]);

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText("");

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text,
        createdAt: serverTimestamp(),
        user: {
          _id: myId,
          name: currentUser?.displayName || currentUser?.email || "Ben",
        },
      });
    } catch (e) {
      // Restore the text so the user can retry.
      setInputText(text);
      console.warn("Mesaj gönderilemedi:", e.message);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.user?._id === myId;
    return (
      <View style={[styles.bubble, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
        {!isMe && <Text style={styles.senderName}>{item.user?.name}</Text>}
        <Text style={isMe ? styles.textRight : styles.textLeft}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={styles.list}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Mesaj yaz..."
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  list: { padding: 12 },
  bubble: {
    maxWidth: "75%",
    borderRadius: 12,
    padding: 10,
    marginVertical: 4,
  },
  bubbleLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
  },
  bubbleRight: {
    alignSelf: "flex-end",
    backgroundColor: "#0084ff",
  },
  senderName: { fontSize: 11, color: "#888", marginBottom: 2 },
  textLeft: { color: "#000" },
  textRight: { color: "#fff" },
  inputRow: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#0084ff",
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  sendText: { color: "#fff", fontWeight: "600" },
});

export default Chat;
