import { Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PanelType, useEditor } from "@/context/EditorContext";
import { useColors } from "@/hooks/useColors";

interface ActivityIconProps {
  panel: PanelType;
  children: React.ReactNode;
}

function ActivityIcon({ panel, children }: ActivityIconProps) {
  const colors = useColors();
  const { activePanel, setActivePanel, sidebarOpen } = useEditor();
  const isActive = activePanel === panel && sidebarOpen;

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setActivePanel(panel);
      }}
      style={({ pressed }) => [
        styles.iconBtn,
        isActive && { borderLeftColor: colors.primary, borderLeftWidth: 2 },
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={{ opacity: isActive ? 1 : 0.45 }}>{children}</View>
    </Pressable>
  );
}

export function ActivityBar() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setCommandPaletteVisible } = useEditor();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.activityBar as string,
          paddingTop: insets.top,
          borderRightColor: colors.border,
        },
      ]}
    >
      <View style={styles.topIcons}>
        <ActivityIcon panel="explorer">
          <MaterialIcons name="folder-copy" size={22} color="#d4d4d4" />
        </ActivityIcon>
        <ActivityIcon panel="search">
          <Feather name="search" size={21} color="#d4d4d4" />
        </ActivityIcon>
        <ActivityIcon panel="git">
          <MaterialCommunityIcons name="source-branch" size={22} color="#d4d4d4" />
        </ActivityIcon>
        <ActivityIcon panel="extensions">
          <MaterialCommunityIcons name="puzzle-outline" size={22} color="#d4d4d4" />
        </ActivityIcon>
      </View>

      <View style={styles.bottomIcons}>
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setCommandPaletteVisible(true);
          }}
          style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.5 : 0.45 }]}
        >
          <Feather name="terminal" size={20} color="#d4d4d4" />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.5 : 0.45 }]}
        >
          <Feather name="settings" size={20} color="#d4d4d4" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: 48,
    flexDirection: "column",
    alignItems: "center",
    borderRightWidth: 1,
  },
  topIcons: {
    flex: 1,
    alignItems: "center",
    paddingTop: 4,
    gap: 4,
  },
  bottomIcons: {
    alignItems: "center",
    paddingBottom: 12,
    gap: 4,
  },
  iconBtn: {
    width: 48,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 2,
    borderLeftColor: "transparent",
  },
});
