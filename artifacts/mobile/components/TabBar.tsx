import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useEditor } from "@/context/EditorContext";
import { useColors } from "@/hooks/useColors";

function getFileIcon(path: string) {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  const icons: Record<string, { icon: string; color: string }> = {
    js: { icon: "language-javascript", color: "#FFCC00" },
    jsx: { icon: "language-javascript", color: "#FFCC00" },
    ts: { icon: "language-typescript", color: "#4488FF" },
    tsx: { icon: "language-typescript", color: "#4488FF" },
    py: { icon: "language-python", color: "#4488CC" },
    html: { icon: "language-html5", color: "#FF4422" },
    css: { icon: "language-css3", color: "#4488FF" },
    json: { icon: "code-json", color: "#FFCC44" },
    md: { icon: "language-markdown", color: "#d4d4d4" },
  };
  return icons[ext] ?? { icon: "file-outline", color: "#808080" };
}

interface TabItemProps {
  path: string;
}

function TabItem({ path }: TabItemProps) {
  const colors = useColors();
  const { activeTab, openTab, closeTab, files } = useEditor();
  const isActive = activeTab === path;
  const file = files[path];
  const isModified = file?.modified ?? false;
  const fileName = path.split("/").pop() ?? path;
  const { icon, color } = getFileIcon(path);

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== "web") Haptics.selectionAsync();
        openTab(path);
      }}
      style={[
        styles.tab,
        {
          backgroundColor: isActive
            ? (colors.tabActive as string)
            : (colors.tabInactive as string),
          borderBottomColor: isActive ? colors.primary : "transparent",
          borderBottomWidth: 1,
          borderRightColor: colors.tabBorder as string,
        },
      ]}
    >
      <MaterialCommunityIcons name={icon as any} size={13} color={color} style={{ marginRight: 5 }} />
      <Text
        style={[
          styles.tabText,
          { color: isActive ? colors.foreground : (colors.mutedForeground as string) },
        ]}
        numberOfLines={1}
      >
        {fileName}
      </Text>
      {isModified && (
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
      )}
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          closeTab(path);
        }}
        style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.5 : 1 }]}
      >
        <Feather name="x" size={12} color={isActive ? "#808080" : "#555555"} />
      </Pressable>
    </Pressable>
  );
}

export function TabBar() {
  const colors = useColors();
  const { openTabs, activeTab } = useEditor();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        {openTabs.map((path) => (
          <TabItem key={path} path={path} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 35,
    borderBottomWidth: 1,
  },
  scroll: {
    flex: 1,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 34,
    minWidth: 80,
    maxWidth: 160,
    borderRightWidth: 1,
  },
  tabText: {
    fontSize: 12,
    flex: 1,
    fontFamily: "monospace",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 3,
    marginLeft: 4,
  },
  closeBtn: {
    padding: 2,
    marginLeft: 3,
  },
});
