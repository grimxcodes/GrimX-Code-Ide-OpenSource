import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { GrimReaper } from "@/components/GrimReaper";

const { width, height } = Dimensions.get("window");

const SYMBOLS = [
  "</>",
  "{ }",
  "&&",
  "=>",
  ";;",
  "()",
  "[]",
  "!=",
  "++",
  "--",
  "//",
  "<<",
  ">>",
  "===",
  "null",
];

interface ParticleProps {
  x: number;
  delay: number;
  duration: number;
  symbol: string;
  size: number;
}

function Particle({ x, delay, duration, symbol, size }: ParticleProps) {
  const ty = useSharedValue(-30);
  const op = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => {
      ty.value = withRepeat(withTiming(height + 40, { duration }), -1, false);
      op.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 400 }),
          withTiming(0.15, { duration: duration - 800 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        false
      );
    }, delay);
    return () => clearTimeout(t);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
    opacity: op.value,
  }));

  return (
    <Animated.Text style={[styles.particle, { left: x, fontSize: size }, style]}>
      {symbol}
    </Animated.Text>
  );
}

function RisingReaper() {
  const ty = useSharedValue(180);
  const op = useSharedValue(0);

  useEffect(() => {
    ty.value = withTiming(0, { duration: 1400, easing: Easing.out(Easing.cubic) });
    op.value = withTiming(1, { duration: 1000 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
    opacity: op.value,
  }));

  return (
    <Animated.View style={style}>
      <GrimReaper width={230} height={390} animated />
    </Animated.View>
  );
}

function FadeInView({
  children,
  delay,
  style: extStyle,
}: {
  children: React.ReactNode;
  delay: number;
  style?: object;
}) {
  const op = useSharedValue(0);
  const ty = useSharedValue(20);

  useEffect(() => {
    const t = setTimeout(() => {
      op.value = withTiming(1, { duration: 700 });
      ty.value = withTiming(0, { duration: 700 });
    }, delay);
    return () => clearTimeout(t);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ translateY: ty.value }],
  }));

  return <Animated.View style={[style, extStyle]}>{children}</Animated.View>;
}

function GlowPulse({ children }: { children: React.ReactNode }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1800 }),
        withTiming(1, { duration: 1800 })
      ),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

export default function IntroScreen() {
  const router = useRouter();
  const [titleText, setTitleText] = useState("");

  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: (i / 14) * width + Math.sin(i * 1.3) * 20,
        delay: i * 280,
        duration: 2600 + ((i * 370) % 1400),
        symbol: SYMBOLS[i % SYMBOLS.length],
        size: 9 + (i % 4),
      })),
    []
  );

  useEffect(() => {
    const chars = "GrimX";
    let i = 0;
    const timer = setInterval(() => {
      if (i >= chars.length) {
        clearInterval(timer);
        return;
      }
      setTitleText((prev) => prev + chars[i]);
      i++;
    }, 180);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />

      <LinearGradient
        colors={["#0d0d0d", "#110000", "#0d0d0d"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Particle rain */}
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}

      {/* Red ambient glow */}
      <View style={styles.glowCircle} />

      {/* GrimReaper */}
      <View style={styles.reaperContainer}>
        <RisingReaper />
      </View>

      {/* GrimX Title */}
      <FadeInView delay={1200} style={styles.titleContainer}>
        <GlowPulse>
          <Text style={styles.title}>
            {titleText}
            <Text style={styles.cursor}>|</Text>
          </Text>
        </GlowPulse>
        <View style={styles.titleUnderline} />
      </FadeInView>

      {/* Subtitle */}
      <FadeInView delay={2000} style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>CODING  IDE</Text>
        <Text style={styles.tagline}>Code Beyond Death</Text>
      </FadeInView>

      {/* CTA Button */}
      <FadeInView delay={2800} style={styles.buttonContainer}>
        <Pressable
          onPress={() => router.push("/onboarding")}
          style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.8 : 1 }]}
        >
          <LinearGradient
            colors={["#880000", "#CC0000", "#880000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>ENTER THE DARKNESS</Text>
          </LinearGradient>
        </Pressable>
        <Text style={styles.skipHint}>Tap to begin your coding journey</Text>
      </FadeInView>

      {/* Version */}
      <FadeInView delay={3200} style={styles.version}>
        <Text style={styles.versionText}>v1.0.0</Text>
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    alignItems: "center",
    justifyContent: "center",
  },
  particle: {
    position: "absolute",
    top: 0,
    color: "#CC0000",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    opacity: 0,
  },
  glowCircle: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(204,0,0,0.06)",
    top: height * 0.2,
  },
  reaperContainer: {
    marginBottom: -20,
    zIndex: 2,
  },
  titleContainer: {
    alignItems: "center",
    zIndex: 3,
    marginTop: 10,
  },
  title: {
    fontSize: 54,
    fontWeight: "900",
    color: "#CC0000",
    letterSpacing: 10,
    textShadowColor: "rgba(204,0,0,0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  cursor: {
    color: "#CC0000",
    fontWeight: "100",
  },
  titleUnderline: {
    width: 120,
    height: 2,
    backgroundColor: "#CC0000",
    marginTop: 6,
    shadowColor: "#CC0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  subtitleContainer: {
    alignItems: "center",
    marginTop: 14,
    zIndex: 3,
  },
  subtitle: {
    color: "#d4d4d4",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 8,
  },
  tagline: {
    color: "#555555",
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 5,
    fontStyle: "italic",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 44,
    zIndex: 3,
  },
  btn: {
    borderRadius: 3,
    overflow: "hidden",
    shadowColor: "#CC0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  btnGradient: {
    paddingHorizontal: 36,
    paddingVertical: 14,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 4,
  },
  skipHint: {
    color: "#333",
    fontSize: 11,
    marginTop: 12,
    letterSpacing: 1,
  },
  version: {
    position: "absolute",
    bottom: Platform.OS === "web" ? 34 : 40,
  },
  versionText: {
    color: "#2a2a2a",
    fontSize: 11,
    fontFamily: "monospace",
  },
});
