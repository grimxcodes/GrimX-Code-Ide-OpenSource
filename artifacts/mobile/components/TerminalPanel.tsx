import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useEditor } from "@/context/EditorContext";
import { useColors } from "@/hooks/useColors";

interface TermLine {
  id: string;
  type: "input" | "output" | "error" | "success";
  text: string;
}

const COMMANDS: Record<string, (args: string[], files: string[]) => string[]> = {
  help: () => [
    "Available commands:",
    "  ls          - list files",
    "  clear       - clear terminal",
    "  echo <txt>  - print text",
    "  node -v     - node version",
    "  npm -v      - npm version",
    "  git status  - git status",
    "  git log     - commit history",
    "  grimx       - about GrimX",
  ],
  ls: (_, files) => files.length > 0 ? files : ["(empty)"],
  "node": (args) => {
    if (args[0] === "-v" || args[0] === "--version") return ["v20.12.0"];
    return ["undefined"];
  },
  "npm": (args) => {
    if (args[0] === "-v" || args[0] === "--version") return ["10.5.0"];
    if (args[0] === "install") return ["up to date, audited 0 packages in 0s"];
    return ["npm <command>"];
  },
  echo: (args) => [args.join(" ")],
  "git": (args) => {
    if (args[0] === "status") return [
      "On branch main",
      "nothing to commit, working tree clean",
    ];
    if (args[0] === "log") return [
      "commit a1b2c3d (HEAD -> main)",
      "Author: Developer <dev@grimx.io>",
      "Date: " + new Date().toDateString(),
      "",
      "    Initial commit — Enter the darkness",
    ];
    if (args[0] === "add") return ["Changes staged for commit"];
    if (args[0] === "commit") return [`[main a1b2c3d] ${args.slice(2).join(" ")}`];
    return ["git: " + args[0] + ": command not found"];
  },
  grimx: () => [
    "  ██████╗ ██████╗ ██╗███╗   ███╗██╗  ██╗",
    "  ██╔════╝ ██╔══██╗██║████╗ ████║╚██╗██╔╝",
    "  ██║  ███╗██████╔╝██║██╔████╔██║ ╚███╔╝ ",
    "  ██║   ██║██╔══██╗██║██║╚██╔╝██║ ██╔██╗ ",
    "  ╚██████╔╝██║  ██║██║██║ ╚═╝ ██║██╔╝ ██╗",
    "   ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝",
    "  Coding IDE v1.0.0 — Code Beyond Death",
  ],
};

export function TerminalPanel() {
  const colors = useColors();
  const { setTerminalVisible, files } = useEditor();
  const [lines, setLines] = useState<TermLine[]>([
    {
      id: "0",
      type: "success",
      text: "GrimX Terminal — Type 'help' for available commands",
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const flatRef = useRef<FlatList>(null);

  const uid = () => Date.now().toString() + Math.random().toString(36).slice(2, 7);

  const run = (cmd: string) => {
    const trimmed = cmd.trim();
    const newLines: TermLine[] = [
      { id: uid(), type: "input", text: `grimx@reaper:~$ ${trimmed}` },
    ];

    if (!trimmed) {
      setLines((prev) => [...prev, ...newLines]);
      return;
    }

    if (trimmed === "clear") {
      setLines([{ id: uid(), type: "success", text: "GrimX Terminal — cleared" }]);
      setHistory((h) => [trimmed, ...h]);
      setHistIdx(-1);
      return;
    }

    const [command, ...args] = trimmed.split(" ");
    const handler = COMMANDS[command];
    if (handler) {
      const filePaths = Object.keys(files);
      const outputs = handler(args, filePaths);
      outputs.forEach((o) => newLines.push({ id: uid(), type: "output", text: o }));
    } else {
      newLines.push({ id: uid(), type: "error", text: `bash: ${command}: command not found` });
    }

    setLines((prev) => [...prev, ...newLines]);
    setHistory((h) => [trimmed, ...h]);
    setHistIdx(-1);
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderLine = ({ item }: { item: TermLine }) => {
    const color =
      item.type === "input"
        ? "#00CC44"
        : item.type === "error"
        ? "#FF4444"
        : item.type === "success"
        ? "#CC0000"
        : "#d4d4d4";
    return (
      <Text style={[styles.line, { color }]}>{item.text}</Text>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.terminal as string, borderTopColor: colors.border }]}>
      <View style={styles.titleBar}>
        <View style={styles.titleLeft}>
          <Feather name="terminal" size={12} color="#808080" />
          <Text style={styles.title}>TERMINAL</Text>
        </View>
        <Pressable onPress={() => setTerminalVisible(false)} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <Feather name="x" size={14} color="#808080" />
        </Pressable>
      </View>

      <FlatList
        ref={flatRef}
        data={lines}
        keyExtractor={(item) => item.id}
        renderItem={renderLine}
        style={styles.output}
        contentContainerStyle={styles.outputContent}
      />

      <View style={styles.inputRow}>
        <Text style={styles.prompt}>grimx@reaper:~$ </Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => {
            run(input);
            setInput("");
          }}
          returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
          blurOnSubmit={false}
          placeholderTextColor="#444"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderTopWidth: 1,
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  titleLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  title: { color: "#808080", fontSize: 11, fontWeight: "600", letterSpacing: 1 },
  output: { flex: 1 },
  outputContent: { paddingHorizontal: 10, paddingVertical: 4 },
  line: { fontSize: 12, fontFamily: "monospace", lineHeight: 18 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
  },
  prompt: { color: "#00CC44", fontSize: 12, fontFamily: "monospace" },
  input: { flex: 1, color: "#d4d4d4", fontSize: 12, fontFamily: "monospace" },
});
