import { View } from "react-native";
import React, { useState } from "react";
import { Button, TextInput, HelperText } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { auth } from "../firebaseConfig";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const createAccount = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (name.trim()) {
        await updateProfile(user, { displayName: name.trim() });
      }
      // Kayıt sonrası onAuthStateChanged otomatik olarak ana ekrana geçirir.
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ margin: 16 }}>
      <TextInput
        label="Ad Soyad"
        value={name}
        mode="outlined"
        onChangeText={setName}
      />
      <TextInput
        label="E-posta"
        value={email}
        mode="outlined"
        style={{ marginTop: 12 }}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        label="Şifre"
        value={password}
        mode="outlined"
        style={{ marginTop: 12 }}
        onChangeText={setPassword}
        secureTextEntry
      />

      {!!error && (
        <HelperText type="error" visible={!!error} style={{ marginBottom: 10 }}>
          {error}
        </HelperText>
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
        <Button compact onPress={() => navigation.navigate("SignIn")}>
          Giriş Yap
        </Button>
        <Button mode="contained" onPress={createAccount} loading={isLoading} disabled={isLoading}>
          Kayıt Ol
        </Button>
      </View>
    </View>
  );
};

export default SignUp;
