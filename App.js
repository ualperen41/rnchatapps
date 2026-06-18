import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebaseConfig";

import ChatList from "./screens/ChatList";
import Settings from "./screens/Settings";
import Chat from "./screens/Chat";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const TabsNavigator = () => (
  <Tabs.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        const iconName =
          route.name === "ChatList"
            ? focused
              ? "chatbubbles"
              : "chatbubbles-outline"
            : focused
            ? "settings"
            : "settings-outline";
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tabs.Screen name="ChatList" component={ChatList} options={{ title: "Sohbetler" }} />
    <Tabs.Screen name="Settings" component={Settings} options={{ title: "Ayarlar" }} />
  </Tabs.Navigator>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Single source of auth truth. Persisted via AsyncStorage (see firebaseConfig),
    // so a returning user is restored here on launch.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <PaperProvider>
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen name="Main" component={TabsNavigator} options={{ headerShown: false }} />
              <Stack.Screen name="Chat" component={Chat} options={{ title: "Sohbet" }} />
            </>
          ) : (
            <>
              <Stack.Screen name="SignIn" component={SignIn} options={{ title: "Giriş Yap" }} />
              <Stack.Screen name="SignUp" component={SignUp} options={{ title: "Kayıt Ol" }} />
            </>
          )}
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;
