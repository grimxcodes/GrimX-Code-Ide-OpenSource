import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useApp } from "@/context/AppContext";

const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Rust",
  "Go", "Java", "C++", "Swift",
  "Kotlin", "PHP", "Ruby", "C#",
];

const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Beginner", desc: "Just starting out", icon: "☠" },
  { id: "intermediate", label: "Intermediate", desc: "1–3 years experience", icon: "💀" },
  { id: "advanced", label: "Advanced", desc: "3–7 years experience", icon: "🩸" },
  { id: "expert", label: "Expert", desc: "7+ years experience", icon: "⚔" },
];

const PROJECT_TYPES = [
  "Web Apps", "Mobile Apps", "APIs", "CLI Tools",
  "Game Dev", "Data Science", "DevOps", "Open Source",
];

export default function QuestionsScreen() {
  const router = useRouter();
  const { updateSettings } = useApp();

  const [step, setStep] = useState(0);
  const [primaryLang, setPrimaryLang] = useState("");
  const [experience, setExperience] = useState("");
  const [projectTypes, setProjectTypes] = useState<string[]>([]);

  const totalSteps = 3;
  const progress = ((step + 1) / totalSteps) * 100;

  const toggleProjectType = (type: string) => {
    setProjectTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const canProceed = () => {
    if (step === 0) return !!primaryLang;
    if (step === 1) return !!experience;
    if (step === 2) return projectTypes.length > 0;
    return false;
  };

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      await updateSettings({ primaryLanguage: primaryLang, experience, projectTypes });
      router.push("/permissions");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <LinearGradient
        colors={["#0d0d0d", "#110000", "#0d0d0d"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step header */}
        <View style={styles.stepHeader}>
          <Text style={styles.stepCount}>
            {step + 1} / {totalSteps}
          </Text>
        </View>

        {step === 0 && (
          <View>
            <Text style={styles.questionTitle}>Primary Language</Text>
            <Text style={styles.questionSub}>What language do you code in most?</Text>
            <View style={styles.langGrid}>
              {LANGUAGES.map((lang) => (
                <Pressable
                  key={lang}
                  onPress={() => setPrimaryLang(lang)}
                  style={({ pressed }) => [
                    styles.langBtn,
                    primaryLang === lang && styles.langBtnActive,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text
                    style={[
                      styles.langText,
                      primaryLang === lang && styles.langTextActive,
                    ]}
                  >
                    {lang}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.questionTitle}>Experience Level</Text>
            <Text style={styles.questionSub}>Where are you on the path?</Text>
            <View style={styles.expGrid}>
              {EXPERIENCE_LEVELS.map((lvl) => (
                <Pressable
                  key={lvl.id}
                  onPress={() => setExperience(lvl.id)}
                  style={({ pressed }) => [
                    styles.expCard,
                    experience === lvl.id && styles.expCardActive,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text style={styles.expIcon}>{lvl.icon}</Text>
                  <Text
                    style={[
                      styles.expLabel,
                      experience === lvl.id && styles.expLabelActive,
                    ]}
                  >
                    {lvl.label}
                  </Text>
                  <Text style={styles.expDesc}>{lvl.desc}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.questionTitle}>Project Types</Text>
            <Text style={styles.questionSub}>What do you build? (select all that apply)</Text>
            <View style={styles.projectGrid}>
              {PROJECT_TYPES.map((type) => (
                <Pressable
                  key={type}
                  onPress={() => toggleProjectType(type)}
                  style={({ pressed }) => [
                    styles.projectBtn,
                    projectTypes.includes(type) && styles.projectBtnActive,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text
                    style={[
                      styles.projectText,
                      projectTypes.includes(type) && styles.projectTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Next Button */}
      <View style={styles.bottomArea}>
        <Pressable
          onPress={handleNext}
          disabled={!canProceed()}
          style={({ pressed }) => [styles.nextBtn, { opacity: !canProceed() ? 0.35 : pressed ? 0.8 : 1 }]}
        >
          <LinearGradient
            colors={["#880000", "#CC0000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextBtnInner}
          >
            <Text style={styles.nextBtnText}>
              {step === totalSteps - 1 ? "NEXT →" : "NEXT →"}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  progressBar: {
    height: 2,
    backgroundColor: "#1a1a1a",
    marginTop: Platform.OS === "web" ? 48 : 54,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#CC0000",
    shadowColor: "#CC0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  content: { padding: 28, paddingBottom: 120 },
  stepHeader: { marginBottom: 20 },
  stepCount: { color: "#CC0000", fontSize: 11, fontWeight: "700", letterSpacing: 3 },
  questionTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  questionSub: { color: "#808080", fontSize: 13, marginBottom: 24 },
  langGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    backgroundColor: "#111",
  },
  langBtnActive: { borderColor: "#CC0000", backgroundColor: "rgba(204,0,0,0.12)" },
  langText: { color: "#808080", fontSize: 13 },
  langTextActive: { color: "#CC0000", fontWeight: "700" },
  expGrid: { gap: 12 },
  expCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    backgroundColor: "#111",
    gap: 12,
  },
  expCardActive: { borderColor: "#CC0000", backgroundColor: "rgba(204,0,0,0.1)" },
  expIcon: { fontSize: 22 },
  expLabel: { color: "#d4d4d4", fontSize: 15, fontWeight: "700", flex: 1 },
  expLabelActive: { color: "#CC0000" },
  expDesc: { color: "#555", fontSize: 12 },
  projectGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  projectBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    backgroundColor: "#111",
  },
  projectBtnActive: { borderColor: "#CC0000", backgroundColor: "rgba(204,0,0,0.12)" },
  projectText: { color: "#808080", fontSize: 13 },
  projectTextActive: { color: "#CC0000", fontWeight: "700" },
  bottomArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === "web" ? 40 : 32,
    backgroundColor: "#0d0d0d",
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
  },
  nextBtn: {
    borderRadius: 3,
    overflow: "hidden",
    shadowColor: "#CC0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  nextBtnInner: { paddingVertical: 14, alignItems: "center" },
  nextBtnText: { color: "#fff", fontSize: 13, fontWeight: "800", letterSpacing: 4 },
});
