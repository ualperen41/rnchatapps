// Must be imported before Firestore is used: it polyfills crypto.getRandomValues,
// which the Firebase JS SDK relies on in React Native.
import "react-native-get-random-values";

import { registerRootComponent } from "expo";

import App from "./App";

registerRootComponent(App);
