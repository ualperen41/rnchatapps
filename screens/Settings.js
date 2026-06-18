import { View } from "react-native";
import React from "react";
import { Avatar, Button, Subheading, Title } from "react-native-paper";
import { signOut } from "firebase/auth";

import { auth } from "../firebaseConfig";

const Settings = () => {
  const user = auth.currentUser;
  const name = user?.displayName || "İsimsiz Kullanıcı";
  const email = user?.email || "";

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged (App.js) otomatik olarak giriş ekranına döndürür.
    } catch (e) {
      console.warn("Çıkış yapılamadı:", e.message);
    }
  };

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .reduce((prev, cur) => prev + cur[0], "")
      .toUpperCase() || "?";

  return (
    <View style={{ alignItems: "center", marginTop: 16 }}>
      <Avatar.Text label={initials} />
      <Title>{name}</Title>
      <Subheading>{email}</Subheading>

      <Button mode="contained" onPress={handleSignOut} style={{ marginTop: 16 }}>
        Çıkış Yap
      </Button>
    </View>
  );
};

export default Settings;
