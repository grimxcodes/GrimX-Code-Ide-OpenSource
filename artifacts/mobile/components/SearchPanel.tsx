import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useEditor } from "@/context/EditorContext";
import { useColors } from "@/hooks/useColors";

interface SearchResult {
  file: string;
  line: number;
  text: string;
  matchStart: number;
  matchEnd: number;
}

export function SearchPanel() {
  const colors = useColors();
  const { searchQuery, replaceQuery, setSearchQuery, setReplaceQuery, files, openTab, saveFile } =
    useEditor();

  const results: SearchResult[] = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const out: SearchResult[] = [];
    const q = searchQuery.toLowerCase();
    for (const [path, file] of Object.entries(files)) {
      const lines = file.content.split("\n");
      lines.forEach((lineText, i) => {
        const idx = lineText.toLowerCase().indexOf(q);
        if (idx >= 0) {
          out.push({
            file: path,
            line: i + 1,
            text: lineText.trim(),
            matchStart: idx,
            matchEnd: idx + q.length,
          });
        }
      });
    }
    return out.slice(0, 100);
  }, [searchQuery, files]);

  const handleReplace = () => {
    if (!searchQuery.trim()) return;
    for (const [path, file] of Object.entries(files)) {
      if (file.content.includes(searchQuery)) {
        const newContent = file.content.split(searchQuery).join(replaceQuery);
        saveFile(path, newContent);
      }
    }
  };

  const renderItem = ({ item }: { item: SearchResult }) => (
    <Pressable
      onPress={() => openTab(item.file)}
      style={({ pressed }) => [styles.resultItem, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Text style={styles.resultFile} numberOfLines={1}>
        {item.file.split("/").pop()} : {item.line}
      </Text>
      <Text style={styles.resultText} numberOfLines={2}>
        {item.text}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.sidebar as string }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SEARCH</Text>
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Feather name="search" size={14} color="#808080" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search"
            placeholderTextColor="#444"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Feather name="x" size={14} color="#808080" />
            </Pressable>
          )}
        </View>

        <View style={styles.inputRow}>
          <Feather name="repeat" size={14} color="#808080" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={replaceQuery}
            onChangeText={setReplaceQuery}
            placeholder="Replace"
            placeholderTextColor="#444"
          />
          {replaceQuery.length > 0 && searchQuery.length > 0 && (
            <Pressable onPress={handleReplace}>
              <Feather name="check" size={14} color={colors.primary} />
            </Pressable>
          )}
        </View>
      </View>

      {results.length > 0 && (
        <Text style={styles.resultCount}>
          {results.length} result{results.length !== 1 ? "s" : ""}
        </Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => `${item.file}:${item.line}`}
        renderItem={renderItem}
        style={styles.list}
        ListEmptyComponent={
          searchQuery.trim() ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No results found</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  headerText: { color: "#808080", fontSize: 10, fontWeight: "700", letterSpacing: 1.5 },
  inputSection: { padding: 8, gap: 6 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  inputIcon: { marginRight: 6 },
  input: { flex: 1, color: "#d4d4d4", fontSize: 13 },
  resultCount: { color: "#808080", fontSize: 11, paddingHorizontal: 12, paddingBottom: 4 },
  list: { flex: 1 },
  resultItem: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  resultFile: { color: "#CC0000", fontSize: 11, fontFamily: "monospace", marginBottom: 2 },
  resultText: { color: "#d4d4d4", fontSize: 12, fontFamily: "monospace" },
  empty: { padding: 20, alignItems: "center" },
  emptyText: { color: "#555555", fontSize: 13 },
});
