import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type PanelType = "explorer" | "search" | "git" | "extensions" | null;

export interface FileItem {
  content: string;
  language: string;
  modified: boolean;
}

interface EditorContextType {
  files: Record<string, FileItem>;
  openTabs: string[];
  activeTab: string | null;
  activePanel: PanelType;
  sidebarOpen: boolean;
  terminalVisible: boolean;
  cursor: { line: number; col: number };
  gitBranch: string;
  commandPaletteVisible: boolean;
  searchQuery: string;
  replaceQuery: string;
  openTab: (path: string) => void;
  closeTab: (path: string) => void;
  setActivePanel: (panel: PanelType) => void;
  setSidebarOpen: (open: boolean) => void;
  setTerminalVisible: (visible: boolean) => void;
  setCursor: (line: number, col: number) => void;
  setCommandPaletteVisible: (visible: boolean) => void;
  setSearchQuery: (q: string) => void;
  setReplaceQuery: (q: string) => void;
  createFile: (path: string, content?: string) => void;
  deleteFile: (path: string) => void;
  saveFile: (path: string, content: string) => void;
  renameFile: (oldPath: string, newPath: string) => void;
  markModified: (path: string, modified: boolean) => void;
}

const LANGUAGE_MAP: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  rs: "rust",
  go: "go",
  java: "java",
  cpp: "cpp",
  c: "c",
  cs: "csharp",
  php: "php",
  rb: "ruby",
  swift: "swift",
  kt: "kotlin",
  html: "html",
  css: "css",
  scss: "scss",
  json: "json",
  md: "markdown",
  yaml: "yaml",
  yml: "yaml",
  xml: "xml",
  sh: "shell",
  sql: "sql",
};

function getLanguage(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return LANGUAGE_MAP[ext] ?? "plaintext";
}

const DEFAULT_FILES: Record<string, FileItem> = {
  "welcome.js": {
    content: `// Welcome to GrimX - Coding IDE
// Code Like the Grim Reaper Himself

const grimx = {
  name: "GrimX",
  version: "1.0.0",
  description: "The Ultimate Dark Coding IDE",
  features: [
    "Monaco Editor",
    "Syntax Highlighting",
    "File Explorer",
    "Integrated Terminal",
    "Git Integration",
    "Extensions",
    "Command Palette",
  ],
};

function greet() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  console.log(\`\${greeting}, developer. Welcome to the dark side of coding.\`);
  return grimx;
}

greet();
`,
    language: "javascript",
    modified: false,
  },
  "src/index.ts": {
    content: `import { GrimXConfig } from "./types";

const config: GrimXConfig = {
  theme: "grimx-dark",
  editor: {
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
  },
};

export function initialize(cfg: GrimXConfig = config): void {
  console.log("GrimX initialized", cfg);
}

initialize();
`,
    language: "typescript",
    modified: false,
  },
  "src/types.ts": {
    content: `export interface GrimXConfig {
  theme: "grimx-dark" | "grimx-light";
  editor: {
    fontSize: number;
    tabSize: number;
    wordWrap: boolean;
  };
}

export interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
}
`,
    language: "typescript",
    modified: false,
  },
  "README.md": {
    content: `# GrimX - Coding IDE

> Code Beyond Death

## Features

- **Monaco Editor** - Same engine as VS Code
- **Dark Theme** - Black, grey, and shining red
- **File Explorer** - Browse and manage your files
- **Terminal** - Integrated command line
- **Extensions** - Enhance your workflow
- **Git Integration** - Version control built-in

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Command Palette | Cmd+Shift+P |
| Save | Cmd+S |
| Find | Cmd+F |
| Format | Shift+Alt+F |
| Comment | Cmd+/ |

## Getting Started

Open a file from the Explorer panel on the left.
Start coding and embrace the darkness.

---

*GrimX - Where Code Meets Darkness*
`,
    language: "markdown",
    modified: false,
  },
  "styles.css": {
    content: `/* GrimX Dark Theme Styles */
:root {
  --color-bg: #0d0d0d;
  --color-surface: #1a1a1a;
  --color-primary: #CC0000;
  --color-primary-bright: #FF2222;
  --color-text: #d4d4d4;
  --color-muted: #808080;
  --color-border: #2a2a2a;
  --radius: 4px;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: 'JetBrains Mono', Consolas, monospace;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius);
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--color-primary-bright);
}
`,
    language: "css",
    modified: false,
  },
};

const EditorContext = createContext<EditorContextType>({
  files: DEFAULT_FILES,
  openTabs: ["welcome.js"],
  activeTab: "welcome.js",
  activePanel: "explorer",
  sidebarOpen: true,
  terminalVisible: false,
  cursor: { line: 1, col: 1 },
  gitBranch: "main",
  commandPaletteVisible: false,
  searchQuery: "",
  replaceQuery: "",
  openTab: () => {},
  closeTab: () => {},
  setActivePanel: () => {},
  setSidebarOpen: () => {},
  setTerminalVisible: () => {},
  setCursor: () => {},
  setCommandPaletteVisible: () => {},
  setSearchQuery: () => {},
  setReplaceQuery: () => {},
  createFile: () => {},
  deleteFile: () => {},
  saveFile: () => {},
  renameFile: () => {},
  markModified: () => {},
});

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<Record<string, FileItem>>(DEFAULT_FILES);
  const [openTabs, setOpenTabs] = useState<string[]>(["welcome.js"]);
  const [activeTab, setActiveTab] = useState<string | null>("welcome.js");
  const [activePanel, setActivePanelState] = useState<PanelType>("explorer");
  const [sidebarOpen, setSidebarOpenState] = useState(true);
  const [terminalVisible, setTerminalVisibleState] = useState(false);
  const [cursor, setCursorState] = useState({ line: 1, col: 1 });
  const [commandPaletteVisible, setCommandPaletteVisibleState] = useState(false);
  const [searchQuery, setSearchQueryState] = useState("");
  const [replaceQuery, setReplaceQueryState] = useState("");

  useEffect(() => {
    async function loadFiles() {
      try {
        const stored = await AsyncStorage.getItem("@grimx_files");
        if (stored) {
          const parsed = JSON.parse(stored);
          setFiles({ ...DEFAULT_FILES, ...parsed });
        }
      } catch {}
    }
    loadFiles();
  }, []);

  const persistFiles = useCallback(async (newFiles: Record<string, FileItem>) => {
    try {
      const custom: Record<string, FileItem> = {};
      for (const [k, v] of Object.entries(newFiles)) {
        if (!DEFAULT_FILES[k] || v.content !== DEFAULT_FILES[k].content) {
          custom[k] = v;
        }
      }
      await AsyncStorage.setItem("@grimx_files", JSON.stringify(custom));
    } catch {}
  }, []);

  const openTab = useCallback((path: string) => {
    setOpenTabs((prev) => (prev.includes(path) ? prev : [...prev, path]));
    setActiveTab(path);
  }, []);

  const closeTab = useCallback(
    (path: string) => {
      setOpenTabs((prev) => {
        const next = prev.filter((t) => t !== path);
        if (activeTab === path) {
          setActiveTab(next[next.length - 1] ?? null);
        }
        return next;
      });
    },
    [activeTab]
  );

  const setActivePanel = useCallback((panel: PanelType) => {
    setActivePanelState((prev) => {
      if (prev === panel) {
        setSidebarOpenState((o) => !o);
        return prev;
      }
      setSidebarOpenState(true);
      return panel;
    });
  }, []);

  const setSidebarOpen = useCallback((open: boolean) => setSidebarOpenState(open), []);
  const setTerminalVisible = useCallback((v: boolean) => setTerminalVisibleState(v), []);
  const setCursor = useCallback((line: number, col: number) => setCursorState({ line, col }), []);
  const setCommandPaletteVisible = useCallback((v: boolean) => setCommandPaletteVisibleState(v), []);
  const setSearchQuery = useCallback((q: string) => setSearchQueryState(q), []);
  const setReplaceQuery = useCallback((q: string) => setReplaceQueryState(q), []);

  const createFile = useCallback(
    (path: string, content = "") => {
      const newFiles = {
        ...files,
        [path]: { content, language: getLanguage(path), modified: false },
      };
      setFiles(newFiles);
      persistFiles(newFiles);
      openTab(path);
    },
    [files, openTab, persistFiles]
  );

  const deleteFile = useCallback(
    (path: string) => {
      const newFiles = { ...files };
      delete newFiles[path];
      setFiles(newFiles);
      persistFiles(newFiles);
      closeTab(path);
    },
    [files, closeTab, persistFiles]
  );

  const saveFile = useCallback(
    (path: string, content: string) => {
      const newFiles = {
        ...files,
        [path]: { ...files[path], content, modified: false, language: getLanguage(path) },
      };
      setFiles(newFiles);
      persistFiles(newFiles);
    },
    [files, persistFiles]
  );

  const renameFile = useCallback(
    (oldPath: string, newPath: string) => {
      const file = files[oldPath];
      if (!file) return;
      const newFiles = { ...files };
      delete newFiles[oldPath];
      newFiles[newPath] = { ...file, language: getLanguage(newPath) };
      setFiles(newFiles);
      persistFiles(newFiles);
      setOpenTabs((prev) => prev.map((t) => (t === oldPath ? newPath : t)));
      setActiveTab((prev) => (prev === oldPath ? newPath : prev));
    },
    [files, persistFiles]
  );

  const markModified = useCallback(
    (path: string, modified: boolean) => {
      setFiles((prev) => ({
        ...prev,
        [path]: { ...prev[path], modified },
      }));
    },
    []
  );

  return (
    <EditorContext.Provider
      value={{
        files,
        openTabs,
        activeTab,
        activePanel,
        sidebarOpen,
        terminalVisible,
        cursor,
        gitBranch: "main",
        commandPaletteVisible,
        searchQuery,
        replaceQuery,
        openTab,
        closeTab,
        setActivePanel,
        setSidebarOpen,
        setTerminalVisible,
        setCursor,
        setCommandPaletteVisible,
        setSearchQuery,
        setReplaceQuery,
        createFile,
        deleteFile,
        saveFile,
        renameFile,
        markModified,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => useContext(EditorContext);
