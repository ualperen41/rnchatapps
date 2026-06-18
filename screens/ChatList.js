import { View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  Divider,
  FAB,
  HelperText,
  List,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebaseConfig";

const ChatList = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [chats, setChats] = useState([]);

  const navigation = useNavigation();
  const email = auth.currentUser?.email ?? "";

  // Live list of the chats the current user is part of.
  useEffect(() => {
    if (!email) return;

    const chatsQuery = query(
      collection(db, "chats"),
      where("users", "array-contains", email)
    );

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // array-contains + orderBy bileşik index gerektirdiği için sıralamayı
      // (en yeni sohbet üstte) istemci tarafında yapıyoruz.
      list.sort(
        (a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)
      );
      setChats(list);
    });

    return unsubscribe;
  }, [email]);

  const createChat = async () => {
    const other = userEmail.trim().toLowerCase();
    if (!other) return;
    if (other === email.toLowerCase()) {
      setError("Kendinizle sohbet oluşturamazsınız.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const ref = await addDoc(collection(db, "chats"), {
        users: [email, other],
        createdAt: serverTimestamp(),
      });
      setIsDialogVisible(false);
      setUserEmail("");
      navigation.navigate("Chat", { chatId: ref.id });
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {chats.map((chat) => {
        const otherUser = chat.users.find((x) => x !== email) ?? "Bilinmeyen";
        const initials = otherUser
          .split(/[@\s.]/)
          .filter(Boolean)
          .reduce((prev, cur) => prev + cur[0], "")
          .slice(0, 2)
          .toUpperCase();
        return (
          <React.Fragment key={chat.id}>
            <List.Item
              title={otherUser}
              left={() => <Avatar.Text label={initials || "?"} size={50} />}
              onPress={() => navigation.navigate("Chat", { chatId: chat.id })}
             
            />
            <Divider inset />
          </React.Fragment>
        );
      })}

      {chats.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 32, opacity: 0.6 }}>
          Henüz sohbet yok. Yeni bir sohbet başlatmak için + tuşuna bas.
        </Text>
      )}

      <Portal>
        <Dialog
          visible={isDialogVisible}
          onDismiss={() => {
            setIsDialogVisible(false);
            setError("");
          }}
        >
          <Dialog.Title>Yeni Sohbet</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Kullanıcı E-postası"
              value={userEmail}
              onChangeText={setUserEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {!!error && (
              <HelperText type="error" visible={!!error}>
                {error}
              </HelperText>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>İptal</Button>
            <Button onPress={createChat} loading={isLoading} disabled={isLoading}>
              Kaydet
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={{ position: "absolute", bottom: 16, right: 16 }}
        onPress={() => setIsDialogVisible(true)}
      />
    </View>
  );
};

export default ChatList;
