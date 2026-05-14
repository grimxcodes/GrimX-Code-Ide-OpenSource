import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useEditor } from "@/context/EditorContext";
import { useColors } from "@/hooks/useColors";

const LANG_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  rust: "Rust",
  go: "Go",
  java: "Java",
  cpp: "C++",
  c: "C",
  csharp: "C#",
  php: "PHP",
  ruby: "Ruby",
  swift: "Swift",
  kotlin: "Kotlin",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  json: "JSON",
  markdown: "Markdown",
  yaml: "YAML",
  xml: "XML",
  shell: "Shell",
  sql: "SQL",
  plaintext: "Plain Text",
};

export function EditorStatusBar() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { cursor, gitBranch, activeTab, files, setTerminalVisible, terminalVisible } = useEditor();

  const activeFile = activeTab ? files[activeTab] : null;
  const language = activeFile?.language ?? "plaintext";
  const langLabel = LANG_LABELS[language] ?? language;

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.statusBar as string,
          paddingBottom: bottomPad,
        },
      ]}
    >
      <View style={styles.left}>
        <Pressable style={styles.item}>
          <MaterialCommunityIcons name="source-branch" size={12} color="#fff" />
          <Text style={styles.text}>{gitBranch}</Text>
        </Pressable>
        <View style={styles.item}>
          <Feather name="check-circle" size={11} color="#fff" />
          <Text style={styles.text}>0</Text>
          <Feather name="alert-triangle" size={11} color="#fff" style={{ marginLeft: 4 }} />
          <Text style={styles.text}>0</Text>
        </View>
      </View>

      <View style={styles.right}>
        <Pressable
          onPress={() => setTerminalVisible(!terminalVisible)}
          style={({ pressed }) => [styles.item, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Feather name="terminal" size={11} color="#fff" />
          <Text style={styles.text}>Terminal</Text>
        </Pressable>
        <View style={styles.item}>
          <Text style={styles.text}>
            Ln {cursor.line}, Col {cursor.col}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.text}>UTF-8</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.text}>CRLF</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.text}>{langLabel}</Text>
        </View>
        <View style={styles.item}>
          <MaterialCommunityIcons name="bell-outline" size={12} color="#fff" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 3,
    minHeight: 22,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  text: {
    color: "#ffffff",
    fontSize: 11,
    fontFamily: "monospace",
  },
});
