import React from "react";
import { View, StatusBar, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from 'react-native-paper';
import Navigation from "./src/navigation/Navigation";
import ConvexClientProvider from "./ConvexClientProvider";

const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight || 0;

export default function App() {
  return (
    <PaperProvider>
      <ConvexClientProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={{ height: STATUS_BAR_HEIGHT, backgroundColor: "#0D87E1" }}>
                <StatusBar
                  translucent
                  backgroundColor={"#0D87E1"}
                  barStyle="light-content"
                />
              </View>
              <Navigation />
            </View>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ConvexClientProvider>
    </PaperProvider>
  );
}