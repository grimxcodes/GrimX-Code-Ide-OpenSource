import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface AppSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  autoSave: boolean;
  primaryLanguage: string;
  experience: string;
  projectTypes: string[];
}

interface AppContextType {
  isOnboardingDone: boolean;
  settings: AppSettings;
  isLoading: boolean;
  setOnboardingDone: () => Promise<void>;
  updateSettings: (partial: Partial<AppSettings>) => Promise<void>;
}

const defaultSettings: AppSettings = {
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  minimap: true,
  autoSave: true,
  primaryLanguage: "javascript",
  experience: "intermediate",
  projectTypes: ["web"],
};

const AppContext = createContext<AppContextType>({
  isOnboardingDone: false,
  settings: defaultSettings,
  isLoading: true,
  setOnboardingDone: async () => {},
  updateSettings: async () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isOnboardingDone, setIsOnboardingDone] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [onboarding, savedSettings] = await Promise.all([
          AsyncStorage.getItem("@grimx_onboarding_done"),
          AsyncStorage.getItem("@grimx_settings"),
        ]);
        if (onboarding === "true") setIsOnboardingDone(true);
        if (savedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        }
      } catch {}
      setIsLoading(false);
    }
    load();
  }, []);

  const setOnboardingDone = async () => {
    await AsyncStorage.setItem("@grimx_onboarding_done", "true");
    setIsOnboardingDone(true);
  };

  const updateSettings = async (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    await AsyncStorage.setItem("@grimx_settings", JSON.stringify(updated));
  };

  return (
    <AppContext.Provider
      value={{ isOnboardingDone, settings, isLoading, setOnboardingDone, updateSettings }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
