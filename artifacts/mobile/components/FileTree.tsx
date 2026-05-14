import { Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useEditor } from "@/context/EditorContext";
import { useColors } from "@/hooks/useColors";

const FILE_ICONS: Record<string, { name: string; color: string }> = {
  js: { name: "language-javascript", color: "#FFCC00" },
  jsx: { name: "language-javascript", color: "#FFCC00" },
  ts: { name: "language-typescript", color: "#4488FF" },
  tsx: { name: "language-typescript", color: "#4488FF" },
  py: { name: "language-python", color: "#4488CC" },
  rs: { name: "language-rust", color: "#FF6644" },
  go: { name: "language-go", color: "#44AACC" },
  java: { name: "language-java", color: "#FF6622" },
  cpp: { name: "language-cpp", color: "#8844CC" },
  html: { name: "language-html5", color: "#FF4422" },
  css: { name: "language-css3", color: "#4488FF" },
  scss: { name: "language-css3", color: "#FF44AA" },
  json: { name: "code-json", color: "#FFCC44" },
  md: { name: "language-markdown", color: "#d4d4d4" },
  yaml: { name: "file-code", color: "#CC88FF" },
  yml: { name: "file-code", color: "#CC88FF" },
  xml: { name: "xml", color: "#FF8844" },
  sh: { name: "bash", color: "#44CC88" },
  sql: { name: "database", color: "#44CCFF" },
};

interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  children: TreeNode[];
  depth: number;
}

function buildTree(filePaths: string[]): TreeNode[] {
  const folderSet = new Set<string>();
  filePaths.forEach((p) => {
    const parts = p.split("/");
    for (let i = 1; i < parts.length; i++) {
      folderSet.add(parts.slice(0, i).join("/"));
    }
  });

  const nodes: TreeNode[] = [];

  const addNode = (
    items: TreeNode[],
    parts: string[],
    fullPath: string,
    isFolder: boolean,
    depth: number
  ) => {
    const name = parts[0];
    if (parts.length === 1) {
      items.push({ name, path: fullPath, isFolder, children: [], depth });
    } else {
      let folder = items.find((n) => n.name === name && n.isFolder);
      if (!folder) {
        folder = {
          name,
          path: parts[0],
          isFolder: true,
          children: [],
          depth,
        };
        items.push(folder);
      }
      addNode(folder.children, parts.slice(1), fullPath, isFolder, depth + 1);
    }
  };

  [...folderSet].sort().forEach((f) => {
    const parts = f.split("/");
    addNode(nodes, parts, f, true, 0);
  });

  filePaths.forEach((p) => {
    const parts = p.split("/");
    addNode(nodes, parts, p, false, 0);
  });

  nodes.sort((a, b) => {
    if (a.isFolder && !b.isFolder) return -1;
    if (!a.isFolder && b.isFolder) return 1;
    return a.name.localeCompare(b.name);
  });

  return nodes;
}

function sortNodes(nodes: TreeNode[]): TreeNode[] {
  return nodes
    .sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name);
    })
    .map((n) => ({ ...n, children: sortNodes(n.children) }));
}

function FileRow({ node, onOpen }: { node: TreeNode; onOpen: (path: string) => void }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(node.depth < 1);
  const { deleteFile, activeTab } = useEditor();

  const ext = node.name.split(".").pop()?.toLowerCase() ?? "";
  const iconInfo = FILE_ICONS[ext];
  const isActive = !node.isFolder && activeTab === node.path;

  if (node.isFolder) {
    return (
      <>
        <Pressable
          onPress={() => setExpanded(!expanded)}
          style={({ pressed }) => [
            styles.row,
            { paddingLeft: 8 + node.depth * 16, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather
            name={expanded ? "chevron-down" : "chevron-right"}
            size={12}
            color="#808080"
            style={{ marginRight: 2 }}
          />
          <Feather
            name={expanded ? "folder" : "folder"}
            size={14}
            color="#FFCC44"
            style={{ marginRight: 5 }}
          />
          <Text style={[styles.fileName, { color: "#d4d4d4" }]} numberOfLines={1}>
            {node.name}
          </Text>
        </Pressable>
        {expanded && node.children.map((child) => (
          <FileRow key={child.path} node={child} onOpen={onOpen} />
        ))}
      </>
    );
  }

  return (
    <Pressable
      onPress={() => onOpen(node.path)}
      onLongPress={() => {
        if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert("File Options", node.name, [
          { text: "Delete", style: "destructive", onPress: () => deleteFile(node.path) },
          { text: "Cancel", style: "cancel" },
        ]);
      }}
      style={({ pressed }) => [
        styles.row,
        { paddingLeft: 16 + node.depth * 16 },
        isActive && { backgroundColor: colors.primarySubtle as string },
        pressed && { opacity: 0.7 },
      ]}
    >
      {iconInfo ? (
        <MaterialCommunityIcons name={iconInfo.name as any} size={14} color={iconInfo.color} style={{ marginRight: 5 }} />
      ) : (
        <Feather name="file" size={13} color="#808080" style={{ marginRight: 5 }} />
      )}
      <Text
        style={[styles.fileName, { color: isActive ? colors.primary : "#d4d4d4" }]}
        numberOfLines={1}
      >
        {node.name}
      </Text>
    </Pressable>
  );
}

export function FileTree() {
  const colors = useColors();
  const { files, openTab, createFile } = useEditor();
  const [newFileName, setNewFileName] = useState("");
  const [showNew, setShowNew] = useState(false);

  const filePaths = Object.keys(files);
  const tree = sortNodes(buildTree(filePaths));

  const handleCreate = () => {
    if (!newFileName.trim()) return;
    createFile(newFileName.trim());
    setNewFileName("");
    setShowNew(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.sidebar as string }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>EXPLORER</Text>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => setShowNew(!showNew)}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Feather name="file-plus" size={16} color="#808080" />
          </Pressable>
          <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
            <MaterialIcons name="create-new-folder" size={16} color="#808080" />
          </Pressable>
          <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
            <Feather name="refresh-cw" size={14} color="#808080" />
          </Pressable>
        </View>
      </View>

      {showNew && (
        <View style={styles.newFileRow}>
          <Feather name="file" size={13} color="#808080" style={{ marginRight: 5 }} />
          <TextInput
            style={styles.newFileInput}
            value={newFileName}
            onChangeText={setNewFileName}
            placeholder="filename.js"
            placeholderTextColor="#444"
            autoFocus
            onSubmitEditing={handleCreate}
            onBlur={() => {
              if (!newFileName.trim()) setShowNew(false);
            }}
          />
        </View>
      )}

      <ScrollView style={styles.tree} showsVerticalScrollIndicator={false}>
        <View style={styles.projectSection}>
          <Pressable style={styles.projectRow}>
            <Feather name="chevron-down" size={12} color="#808080" />
            <Text style={styles.projectName} numberOfLines={1}>
              GRIMX PROJECT
            </Text>
          </Pressable>
          {tree.map((node) => (
            <FileRow key={node.path} node={node} onOpen={openTab} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  headerText: {
    color: "#808080",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  newFileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingVertical: 3,
    backgroundColor: "#1f1f1f",
  },
  newFileInput: {
    flex: 1,
    color: "#d4d4d4",
    fontSize: 13,
    padding: 0,
    backgroundColor: "#252525",
    paddingHorizontal: 4,
  },
  tree: {
    flex: 1,
  },
  projectSection: {
    paddingBottom: 8,
  },
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 4,
  },
  projectName: {
    color: "#d4d4d4",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    paddingRight: 8,
  },
  fileName: {
    fontSize: 13,
    flex: 1,
  },
});
