import { View } from "react-native";
import React, { useState } from "react";
import { Button, TextInput, HelperText } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebaseConfig";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const signIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Başarılı girişte App.js'teki onAuthStateChanged ekranı otomatik değiştirir.
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ margin: 16 }}>
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
        <Button compact onPress={() => navigation.navigate("SignUp")}>
          Kayıt Ol
        </Button>
        <Button mode="contained" onPress={signIn} loading={isLoading} disabled={isLoading}>
          Giriş Yap
        </Button>
      </View>
    </View>
  );
};

export default SignIn;
