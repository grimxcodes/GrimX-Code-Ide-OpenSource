import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useEditor } from "@/context/EditorContext";
import { useColors } from "@/hooks/useColors";

interface Command {
  id: string;
  label: string;
  desc?: string;
  shortcut?: string;
  action: () => void;
}

export function CommandPalette() {
  const colors = useColors();
  const {
    commandPaletteVisible,
    setCommandPaletteVisible,
    setTerminalVisible,
    terminalVisible,
    setSidebarOpen,
    setActivePanel,
    activeTab,
    files,
    saveFile,
  } = useEditor();
  const [query, setQuery] = useState("");

  const allCommands: Command[] = [
    { id: "file.new", label: "New File", desc: "Create a new file", shortcut: "⌘N", action: () => {} },
    { id: "file.save", label: "Save File", desc: "Save current file", shortcut: "⌘S", action: () => {
      if (activeTab && files[activeTab]) saveFile(activeTab, files[activeTab].content);
    }},
    { id: "view.explorer", label: "Open Explorer", desc: "Show file explorer", action: () => { setActivePanel("explorer"); setSidebarOpen(true); }},
    { id: "view.search", label: "Open Search", desc: "Search in files", shortcut: "⌘⇧F", action: () => { setActivePanel("search"); setSidebarOpen(true); }},
    { id: "view.git", label: "Open Source Control", desc: "Show git panel", action: () => { setActivePanel("git"); setSidebarOpen(true); }},
    { id: "view.extensions", label: "Open Extensions", desc: "Show extensions", shortcut: "⌘⇧X", action: () => { setActivePanel("extensions"); setSidebarOpen(true); }},
    { id: "view.terminal", label: terminalVisible ? "Hide Terminal" : "Show Terminal", desc: "Toggle integrated terminal", shortcut: "⌘`", action: () => setTerminalVisible(!terminalVisible) },
    { id: "view.sidebar", label: "Toggle Sidebar", desc: "Show/hide sidebar", shortcut: "⌘B", action: () => setSidebarOpen(false) },
    { id: "editor.format", label: "Format Document", desc: "Auto-format current file", shortcut: "⇧⌥F", action: () => {} },
    { id: "editor.find", label: "Find", desc: "Find in current file", shortcut: "⌘F", action: () => {} },
    { id: "editor.undo", label: "Undo", desc: "Undo last action", shortcut: "⌘Z", action: () => {} },
    { id: "editor.redo", label: "Redo", desc: "Redo last action", shortcut: "⌘⇧Z", action: () => {} },
    { id: "editor.comment", label: "Toggle Line Comment", desc: "Comment/uncomment line", shortcut: "⌘/", action: () => {} },
    { id: "editor.fold", label: "Fold Region", desc: "Collapse code block", action: () => {} },
    { id: "editor.unfold", label: "Unfold Region", desc: "Expand code block", action: () => {} },
    { id: "editor.selectAll", label: "Select All", desc: "Select all text", shortcut: "⌘A", action: () => {} },
    { id: "theme.grimx", label: "Apply GrimX Dark Theme", desc: "Dark red theme", action: () => {} },
    { id: "grimx.about", label: "About GrimX", desc: "Version 1.0.0 — Code Beyond Death", action: () => {} },
  ];

  const filtered = allCommands.filter(
    (c) =>
      !query ||
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      (c.desc ?? "").toLowerCase().includes(query.toLowerCase())
  );

  const runCommand = (cmd: Command) => {
    cmd.action();
    setCommandPaletteVisible(false);
    setQuery("");
  };

  const renderItem = ({ item }: { item: Command }) => (
    <Pressable
      onPress={() => runCommand(item)}
      style={({ pressed }) => [styles.item, pressed && { backgroundColor: colors.primarySubtle as string }]}
    >
      <View style={styles.itemLeft}>
        <Text style={styles.itemLabel}>{item.label}</Text>
        {item.desc && <Text style={styles.itemDesc}>{item.desc}</Text>}
      </View>
      {item.shortcut && <Text style={styles.shortcut}>{item.shortcut}</Text>}
    </Pressable>
  );

  return (
    <Modal
      visible={commandPaletteVisible}
      transparent
      animationType="fade"
      onRequestClose={() => { setCommandPaletteVisible(false); setQuery(""); }}
    >
      <Pressable style={styles.overlay} onPress={() => { setCommandPaletteVisible(false); setQuery(""); }}>
        <View
          style={[styles.palette, { backgroundColor: colors.card, borderColor: colors.primary }]}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <View style={styles.searchRow}>
            <Feather name="chevron-right" size={14} color={colors.primary} />
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Type a command..."
              placeholderTextColor="#555"
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.count}>{filtered.length}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={styles.list}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    paddingTop: 80,
  },
  palette: {
    width: "90%",
    maxHeight: 400,
    borderRadius: 6,
    borderWidth: 1,
    overflow: "hidden",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#d4d4d4",
    fontSize: 14,
    fontFamily: "monospace",
  },
  count: { color: "#555", fontSize: 11 },
  divider: { height: 1 },
  list: { maxHeight: 350 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },
  itemLeft: { flex: 1, gap: 2 },
  itemLabel: { color: "#d4d4d4", fontSize: 13 },
  itemDesc: { color: "#555", fontSize: 11 },
  shortcut: { color: "#808080", fontSize: 11, fontFamily: "monospace" },
});
