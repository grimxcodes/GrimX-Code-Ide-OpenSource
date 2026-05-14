import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { GrimReaper } from "@/components/GrimReaper";
import { useApp } from "@/context/AppContext";

export default function PermissionsScreen() {
  const router = useRouter();
  const { setOnboardingDone } = useApp();
  const [notifGranted, setNotifGranted] = useState(false);

  const requestNotifications = async () => {
    if (Platform.OS === "web") {
      setNotifGranted(true);
      return;
    }
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotifGranted(status === "granted");
    } catch {
      setNotifGranted(false);
    }
  };

  const handleEnter = async () => {
    await setOnboardingDone();
    router.replace("/editor");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <LinearGradient
        colors={["#0d0d0d", "#110000", "#0d0d0d"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.reaperContainer}>
        <GrimReaper width={160} height={260} animated />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>One Last Step</Text>
        <Text style={styles.subtitle}>
          Grant permissions to unlock the full power of GrimX
        </Text>

        {/* Notifications Card */}
        <View style={styles.permCard}>
          <View style={styles.permIcon}>
            <Feather name="bell" size={22} color={notifGranted ? "#00CC44" : "#CC0000"} />
          </View>
          <View style={styles.permInfo}>
            <Text style={styles.permTitle}>Notifications</Text>
            <Text style={styles.permDesc}>
              Build completion alerts &amp; push reminders
            </Text>
          </View>
          <Pressable
            onPress={requestNotifications}
            style={({ pressed }) => [
              styles.permBtn,
              notifGranted && styles.permBtnGranted,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={[styles.permBtnText, notifGranted && styles.permBtnTextGranted]}>
              {notifGranted ? "Granted" : "Allow"}
            </Text>
          </Pressable>
        </View>

        {/* Storage Card */}
        <View style={styles.permCard}>
          <View style={styles.permIcon}>
            <Feather name="hard-drive" size={22} color="#00CC44" />
          </View>
          <View style={styles.permInfo}>
            <Text style={styles.permTitle}>Storage</Text>
            <Text style={styles.permDesc}>Auto-save your work locally</Text>
          </View>
          <View style={[styles.permBtn, styles.permBtnGranted]}>
            <Text style={[styles.permBtnText, styles.permBtnTextGranted]}>Granted</Text>
          </View>
        </View>

        <Text style={styles.note}>
          You can change these any time in device settings
        </Text>
      </View>

      <View style={styles.bottomArea}>
        <Pressable
          onPress={handleEnter}
          style={({ pressed }) => [styles.enterBtn, { opacity: pressed ? 0.8 : 1 }]}
        >
          <LinearGradient
            colors={["#880000", "#CC0000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.enterBtnInner}
          >
            <Feather name="terminal" size={16} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.enterBtnText}>ENTER GRIMX</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  reaperContainer: {
    alignItems: "center",
    marginTop: Platform.OS === "web" ? 60 : 70,
    marginBottom: 12,
  },
  content: { flex: 1, paddingHorizontal: 28 },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    color: "#808080",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 28,
  },
  permCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 6,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  permIcon: {
    width: 42,
    height: 42,
    backgroundColor: "#1a1a1a",
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  permInfo: { flex: 1 },
  permTitle: { color: "#d4d4d4", fontSize: 14, fontWeight: "700", marginBottom: 3 },
  permDesc: { color: "#555", fontSize: 12, lineHeight: 16 },
  permBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#CC0000",
    backgroundColor: "transparent",
  },
  permBtnGranted: { borderColor: "#00CC44", backgroundColor: "rgba(0,204,68,0.08)" },
  permBtnText: { color: "#CC0000", fontSize: 12, fontWeight: "700" },
  permBtnTextGranted: { color: "#00CC44" },
  note: {
    color: "#333",
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
    letterSpacing: 0.3,
  },
  bottomArea: {
    padding: 24,
    paddingBottom: Platform.OS === "web" ? 40 : 36,
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
  },
  enterBtn: {
    borderRadius: 3,
    overflow: "hidden",
    shadowColor: "#CC0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  enterBtnInner: {
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  enterBtnText: { color: "#fff", fontSize: 13, fontWeight: "800", letterSpacing: 4 },
});
