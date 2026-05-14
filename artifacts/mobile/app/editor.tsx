import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActivityBar } from "@/components/ActivityBar";
import { CommandPalette } from "@/components/CommandPalette";
import { EditorStatusBar } from "@/components/EditorStatusBar";
import { FileTree } from "@/components/FileTree";
import { GrimReaper } from "@/components/GrimReaper";
import { MonacoEditor } from "@/components/MonacoEditor";
import { SearchPanel } from "@/components/SearchPanel";
import { TabBar } from "@/components/TabBar";
import { TerminalPanel } from "@/components/TerminalPanel";
import { useApp } from "@/context/AppContext";
import { useEditor } from "@/context/EditorContext";
import { useColors } from "@/hooks/useColors";

// ── Git Panel ────────────────────────────────────────────────────────────────

function GitPanel() {
  const colors = useColors();
  const [commitMsg, setCommitMsg] = useState("");

  return (
    <View style={[gitStyles.container, { backgroundColor: colors.sidebar as string }]}>
      <View style={gitStyles.header}>
        <Text style={gitStyles.headerText}>SOURCE CONTROL</Text>
      </View>
      <View style={gitStyles.branchRow}>
        <MaterialCommunityIcons name="source-branch" size={13} color={colors.primary} />
        <Text style={gitStyles.branch}>main</Text>
        <View style={gitStyles.pill}>
          <Text style={gitStyles.pillText}>No changes</Text>
        </View>
      </View>
      <View style={gitStyles.section}>
        <Text style={gitStyles.sectionLabel}>COMMIT</Text>
        <TextInput
          style={[gitStyles.commitInput, { borderColor: colors.border as string, color: colors.foreground }]}
          value={commitMsg}
          onChangeText={setCommitMsg}
          placeholder="Message (Ctrl+Enter to commit)"
          placeholderTextColor="#444"
          multiline
          numberOfLines={3}
        />
        <Pressable
          onPress={() => setCommitMsg("")}
          style={({ pressed }) => [
            gitStyles.commitBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="check" size={13} color="#fff" />
          <Text style={gitStyles.commitBtnText}>Commit</Text>
        </Pressable>
      </View>
      <View style={gitStyles.section}>
        <Text style={gitStyles.sectionLabel}>CHANGES</Text>
        <View style={gitStyles.emptyMsg}>
          <Feather name="check-circle" size={14} color="#555" />
          <Text style={gitStyles.emptyText}>Working tree is clean</Text>
        </View>
      </View>
    </View>
  );
}

const gitStyles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  headerText: { color: "#808080", fontSize: 10, fontWeight: "700", letterSpacing: 1.5 },
  branchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 7,
  },
  branch: { color: "#d4d4d4", fontSize: 12, flex: 1 },
  pill: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  pillText: { color: "#555", fontSize: 10 },
  section: { paddingHorizontal: 12, paddingTop: 8 },
  sectionLabel: { color: "#555", fontSize: 10, fontWeight: "700", letterSpacing: 1.2, marginBottom: 8 },
  commitInput: {
    borderWidth: 1,
    borderRadius: 3,
    padding: 8,
    fontSize: 12,
    fontFamily: "monospace",
    marginBottom: 8,
    minHeight: 64,
    textAlignVertical: "top",
    backgroundColor: "#111",
  },
  commitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 3,
    gap: 6,
  },
  commitBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  emptyMsg: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  emptyText: { color: "#555", fontSize: 12 },
});

// ── Extensions Panel ─────────────────────────────────────────────────────────

const EXTENSIONS = [
  { id: "1", name: "GrimX Dark", publisher: "GrimX", installed: true, icon: "💀", desc: "The official GrimX dark theme" },
  { id: "2", name: "Prettier", publisher: "Prettier", installed: true, icon: "✨", desc: "Code formatter" },
  { id: "3", name: "ESLint", publisher: "Microsoft", installed: true, icon: "🔍", desc: "JavaScript linter" },
  { id: "4", name: "GitLens", publisher: "GitKraken", installed: false, icon: "🔮", desc: "Git supercharged" },
  { id: "5", name: "REST Client", publisher: "Huachao", installed: false, icon: "🌐", desc: "REST API testing" },
  { id: "6", name: "Docker", publisher: "Microsoft", installed: false, icon: "🐳", desc: "Container management" },
];

function ExtensionsPanel() {
  const colors = useColors();
  const [query, setQuery] = useState("");
  const [installed, setInstalled] = useState<Set<string>>(
    new Set(EXTENSIONS.filter((e) => e.installed).map((e) => e.id))
  );

  const filtered = EXTENSIONS.filter(
    (e) =>
      !query ||
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.publisher.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={[extStyles.container, { backgroundColor: colors.sidebar as string }]}>
      <View style={extStyles.header}>
        <Text style={extStyles.headerText}>EXTENSIONS</Text>
      </View>
      <View style={extStyles.searchRow}>
        <Feather name="search" size={13} color="#808080" />
        <TextInput
          style={extStyles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search extensions..."
          placeholderTextColor="#444"
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={extStyles.sectionLabel}>
          {query ? "SEARCH RESULTS" : "INSTALLED"}
        </Text>
        {filtered.map((ext) => (
          <View key={ext.id} style={extStyles.extRow}>
            <Text style={extStyles.extIcon}>{ext.icon}</Text>
            <View style={extStyles.extInfo}>
              <Text style={extStyles.extName}>{ext.name}</Text>
              <Text style={extStyles.extPublisher}>{ext.publisher}</Text>
              <Text style={extStyles.extDesc} numberOfLines={1}>{ext.desc}</Text>
            </View>
            <Pressable
              onPress={() => {
                if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setInstalled((prev) => {
                  const next = new Set(prev);
                  if (next.has(ext.id)) next.delete(ext.id);
                  else next.add(ext.id);
                  return next;
                });
              }}
              style={({ pressed }) => [
                extStyles.installBtn,
                installed.has(ext.id) && extStyles.installedBtn,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[extStyles.installText, installed.has(ext.id) && extStyles.installedText]}>
                {installed.has(ext.id) ? "Installed" : "Install"}
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const extStyles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  headerText: { color: "#808080", fontSize: 10, fontWeight: "700", letterSpacing: 1.5 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    margin: 8,
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 6,
  },
  searchInput: { flex: 1, color: "#d4d4d4", fontSize: 12 },
  sectionLabel: {
    color: "#555",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  extRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    gap: 10,
  },
  extIcon: { fontSize: 20 },
  extInfo: { flex: 1 },
  extName: { color: "#d4d4d4", fontSize: 12, fontWeight: "700" },
  extPublisher: { color: "#555", fontSize: 10, marginBottom: 1 },
  extDesc: { color: "#808080", fontSize: 11 },
  installBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#CC0000",
  },
  installedBtn: { borderColor: "#333", backgroundColor: "#1a1a1a" },
  installText: { color: "#CC0000", fontSize: 11, fontWeight: "700" },
  installedText: { color: "#555" },
});

// ── Welcome View ─────────────────────────────────────────────────────────────

function WelcomeView() {
  const colors = useColors();
  const { openTab, files } = useEditor();
  const recentFiles = Object.keys(files).slice(0, 5);

  return (
    <View style={welcomeStyles.container}>
      <View style={welcomeStyles.inner}>
        <GrimReaper width={120} height={200} animated />
        <Text style={welcomeStyles.title}>GrimX</Text>
        <Text style={welcomeStyles.subtitle}>Code Beyond Death</Text>

        <View style={welcomeStyles.quickSection}>
          <Text style={welcomeStyles.quickLabel}>QUICK OPEN</Text>
          {recentFiles.map((path) => (
            <Pressable
              key={path}
              onPress={() => openTab(path)}
              style={({ pressed }) => [welcomeStyles.quickFile, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Feather name="file" size={12} color={colors.primary} />
              <Text style={welcomeStyles.quickFileName}>{path}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: { alignItems: "center", paddingHorizontal: 32 },
  title: {
    color: "#CC0000",
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 8,
    marginTop: 8,
    textShadowColor: "rgba(204,0,0,0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: { color: "#333", fontSize: 12, letterSpacing: 3, marginBottom: 28 },
  quickSection: { width: "100%", gap: 8 },
  quickLabel: { color: "#555", fontSize: 10, fontWeight: "700", letterSpacing: 1.5, marginBottom: 4 },
  quickFile: { flexDirection: "row", alignItems: "center", gap: 8 },
  quickFileName: { color: "#808080", fontSize: 13, fontFamily: "monospace" },
});

// ── Breadcrumb ────────────────────────────────────────────────────────────────

function Breadcrumb({ path }: { path: string }) {
  const parts = path.split("/");
  return (
    <View style={breadStyles.container}>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Feather name="chevron-right" size={11} color="#555" />}
          <Text
            style={[breadStyles.part, i === parts.length - 1 && breadStyles.last]}
            numberOfLines={1}
          >
            {part}
          </Text>
        </React.Fragment>
      ))}
    </View>
  );
}

const breadStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    gap: 3,
  },
  part: { color: "#555", fontSize: 11, fontFamily: "monospace" },
  last: { color: "#d4d4d4" },
});

// ── Main Editor Screen ────────────────────────────────────────────────────────

export default function EditorScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { settings } = useApp();
  const {
    activeTab,
    files,
    sidebarOpen,
    activePanel,
    terminalVisible,
    saveFile,
    markModified,
    setCursor,
  } = useEditor();

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeFile = activeTab ? files[activeTab] : null;

  const handleChange = useCallback(
    (content: string) => {
      if (!activeTab) return;
      markModified(activeTab, true);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveFile(activeTab, content);
      }, 1500);
    },
    [activeTab, markModified, saveFile]
  );

  const handleCursorChange = useCallback(
    (line: number, col: number) => {
      setCursor(line, col);
    },
    [setCursor]
  );

  const renderSidePanel = () => {
    switch (activePanel) {
      case "explorer":
        return <FileTree />;
      case "search":
        return <SearchPanel />;
      case "git":
        return <GitPanel />;
      case "extensions":
        return <ExtensionsPanel />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.body}>
        {/* Activity Bar */}
        <ActivityBar />

        {/* Sidebar */}
        {sidebarOpen && activePanel && (
          <View style={[styles.sidebar, { borderRightColor: colors.border }]}>
            {renderSidePanel()}
          </View>
        )}

        {/* Main Editor Area */}
        <View style={styles.mainArea}>
          {/* Tab bar */}
          <TabBar />

          {/* Editor content */}
          {activeTab && activeFile ? (
            <View style={styles.editorArea}>
              <Breadcrumb path={activeTab} />
              <View style={styles.monaco}>
                <MonacoEditor
                  key={activeTab}
                  content={activeFile.content}
                  language={activeFile.language}
                  fontSize={settings.fontSize}
                  wordWrap={settings.wordWrap}
                  minimap={settings.minimap}
                  onChange={handleChange}
                  onCursorChange={handleCursorChange}
                />
              </View>
              {terminalVisible && <TerminalPanel />}
            </View>
          ) : (
            <View style={styles.editorArea}>
              <WelcomeView />
              {terminalVisible && <TerminalPanel />}
            </View>
          )}

          {/* Status Bar */}
          <EditorStatusBar />
        </View>
      </View>

      {/* Command Palette */}
      <CommandPalette />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },
  body: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 250,
    borderRightWidth: 1,
    overflow: "hidden",
  },
  mainArea: {
    flex: 1,
    flexDirection: "column",
  },
  editorArea: {
    flex: 1,
    flexDirection: "column",
  },
  monaco: {
    flex: 1,
  },
});
