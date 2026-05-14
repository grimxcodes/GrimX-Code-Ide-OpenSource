import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { GrimReaper } from "@/components/GrimReaper";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: 0,
    tag: "01",
    title: "Code Like Death",
    subtitle: "Inevitable. Unstoppable.",
    desc: "A full VS Code–class IDE in your pocket. Monaco editor, syntax highlighting for 30+ languages, and IntelliSense powered by the void.",
    reaperColor: "#CC0000",
    accent: "#CC0000",
  },
  {
    id: 1,
    tag: "02",
    title: "Every Language",
    subtitle: "Known to the Living and Dead",
    desc: "JavaScript, TypeScript, Python, Rust, Go, Java, C++, Swift, Kotlin — every tongue spoken in the mortal realm, and beyond.",
    reaperColor: "#880000",
    accent: "#FF2222",
  },
  {
    id: 2,
    tag: "03",
    title: "Tools of Darkness",
    subtitle: "The Full Arsenal",
    desc: "File explorer, global search, git panel, extensions marketplace, integrated terminal, command palette — all at your fingertips.",
    reaperColor: "#CC0000",
    accent: "#CC4444",
  },
];

function Slide({ slide, index }: { slide: (typeof SLIDES)[0]; index: number }) {
  return (
    <View style={[styles.slide, { width }]}>
      <View style={styles.reaperWrap}>
        <GrimReaper width={200} height={340} animated />
      </View>

      <View style={styles.tagRow}>
        <View style={[styles.tagLine, { backgroundColor: slide.accent }]} />
        <Text style={[styles.tag, { color: slide.accent }]}>{slide.tag}</Text>
      </View>

      <Text style={styles.slideTitle}>{slide.title}</Text>
      <Text style={[styles.slideSubtitle, { color: slide.accent }]}>{slide.subtitle}</Text>
      <Text style={styles.slideDesc}>{slide.desc}</Text>
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleScroll = (e: any) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIdx(page);
  };

  const goNext = () => {
    if (currentIdx < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentIdx + 1) * width, animated: true });
    } else {
      router.push("/questions");
    }
  };

  const skip = () => router.push("/questions");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />

      <LinearGradient
        colors={["#0d0d0d", "#110000", "#0d0d0d"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Skip */}
      <Pressable
        onPress={skip}
        style={({ pressed }) => [styles.skipBtn, { opacity: pressed ? 0.5 : 1 }]}
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide, i) => (
          <Slide key={slide.id} slide={slide} index={i} />
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === currentIdx ? "#CC0000" : "#333",
                width: i === currentIdx ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Next / Get Started */}
      <Pressable
        onPress={goNext}
        style={({ pressed }) => [styles.nextBtn, { opacity: pressed ? 0.8 : 1 }]}
      >
        <LinearGradient
          colors={["#880000", "#CC0000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.nextBtnInner}
        >
          <Text style={styles.nextBtnText}>
            {currentIdx === SLIDES.length - 1 ? "GET STARTED" : "NEXT"}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  skipBtn: {
    position: "absolute",
    top: Platform.OS === "web" ? 48 : 54,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skipText: { color: "#555", fontSize: 13, letterSpacing: 1 },
  slide: {
    paddingHorizontal: 32,
    paddingTop: Platform.OS === "web" ? 80 : 90,
    paddingBottom: 40,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  reaperWrap: {
    alignSelf: "center",
    marginBottom: 24,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  tagLine: { width: 28, height: 2 },
  tag: { fontSize: 11, fontWeight: "700", letterSpacing: 3 },
  slideTitle: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 1,
    lineHeight: 38,
    marginBottom: 6,
  },
  slideSubtitle: {
    fontSize: 14,
    fontStyle: "italic",
    letterSpacing: 1,
    marginBottom: 16,
  },
  slideDesc: {
    color: "#808080",
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 20,
  },
  dot: { height: 4, borderRadius: 2 },
  nextBtn: {
    marginHorizontal: 32,
    marginBottom: Platform.OS === "web" ? 48 : 40,
    borderRadius: 3,
    overflow: "hidden",
    shadowColor: "#CC0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  nextBtnInner: { paddingVertical: 14, alignItems: "center" },
  nextBtnText: { color: "#fff", fontSize: 13, fontWeight: "800", letterSpacing: 4 },
});
