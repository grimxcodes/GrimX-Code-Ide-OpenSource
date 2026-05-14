import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useApp } from "@/context/AppContext";

export default function IndexScreen() {
  const { isLoading, isOnboardingDone } = useApp();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0d0d0d", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#CC0000" />
      </View>
    );
  }

  return <Redirect href={isOnboardingDone ? "/editor" : "/intro"} />;
}
