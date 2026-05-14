import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

interface GrimReaperProps {
  width?: number;
  height?: number;
  animated?: boolean;
}

export function GrimReaper({ width = 200, height = 350, animated = true }: GrimReaperProps) {
  const floatY = useSharedValue(0);
  const [eyeAlpha, setEyeAlpha] = useState(1);

  useEffect(() => {
    if (!animated) return;
    floatY.value = withRepeat(
      withSequence(
        withTiming(-14, { duration: 2400 }),
        withTiming(0, { duration: 2400 })
      ),
      -1,
      false
    );
    let v = 1;
    let inc = false;
    const timer = setInterval(() => {
      if (v >= 1) inc = false;
      if (v <= 0.25) inc = true;
      v += inc ? 0.035 : -0.035;
      setEyeAlpha(Number(v.toFixed(2)));
    }, 40);
    return () => clearInterval(timer);
  }, [animated]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <Animated.View style={[{ width, height }, animated ? floatStyle : undefined]}>
      <Svg width={width} height={height} viewBox="0 0 200 350">
        <Defs>
          <LinearGradient id="robe" x1="0.2" y1="0" x2="0.8" y2="1">
            <Stop offset="0" stopColor="#1e1e1e" />
            <Stop offset="0.5" stopColor="#111111" />
            <Stop offset="1" stopColor="#050505" />
          </LinearGradient>
          <LinearGradient id="blade" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#2d2d2d" />
            <Stop offset="1" stopColor="#0e0e0e" />
          </LinearGradient>
          <LinearGradient id="handleGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#222222" />
            <Stop offset="0.5" stopColor="#555555" />
            <Stop offset="1" stopColor="#222222" />
          </LinearGradient>
        </Defs>

        {/* Scythe handle (behind) */}
        <Line x1="72" y1="338" x2="155" y2="10" stroke="#282828" strokeWidth="6" strokeLinecap="round" />
        <Line x1="72" y1="338" x2="155" y2="10" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" />

        {/* Scythe blade */}
        <Path d="M 155,10 C 205,-14 240,38 222,84 C 205,65 175,50 155,44 Z" fill="url(#blade)" />
        <Path
          d="M 155,10 C 200,-12 234,40 218,82"
          stroke="#CC0000"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 155,12 C 196,-8 228,42 215,78"
          stroke="#666666"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
        />

        {/* Main robe body */}
        <Path
          d="M 100,48 C 78,50 40,122 16,308 Q 58,345 100,348 Q 142,345 184,308 C 160,122 122,50 100,48 Z"
          fill="url(#robe)"
        />

        {/* Hood dark area */}
        <Path
          d="M 100,10 L 55,84 Q 76,70 100,66 Q 124,70 145,84 L 100,10 Z"
          fill="#050505"
        />

        {/* Hood highlight edge */}
        <Path
          d="M 100,14 L 60,82 Q 80,72 100,68 Q 120,72 140,82 L 100,14"
          stroke="#202020"
          strokeWidth="1.2"
          fill="none"
        />

        {/* Face shadow */}
        <Ellipse cx="100" cy="76" rx="32" ry="23" fill="#0a0a0a" />

        {/* Skull features */}
        <Path d="M 97,84 L 100,90 L 103,84" stroke="#1f1f1f" strokeWidth="1.5" fill="none" />
        <Path d="M 88,94 Q 100,98 112,94" stroke="#1a1a1a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <Line x1="94" y1="92" x2="94" y2="97" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        <Line x1="100" y1="92" x2="100" y2="97" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        <Line x1="106" y1="92" x2="106" y2="97" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />

        {/* Left eye glow */}
        <Ellipse cx="87" cy="72" rx="11" ry="8" fill="#550000" opacity={eyeAlpha * 0.5} />
        <Ellipse cx="87" cy="72" rx="8" ry="5.5" fill="#CC0000" opacity={eyeAlpha} />
        <Ellipse cx="87" cy="72" rx="5" ry="3" fill="#FF2222" opacity={eyeAlpha} />
        <Ellipse cx="86" cy="71" rx="2" ry="1.2" fill="#FF9999" opacity={eyeAlpha} />

        {/* Right eye glow */}
        <Ellipse cx="113" cy="72" rx="11" ry="8" fill="#550000" opacity={eyeAlpha * 0.5} />
        <Ellipse cx="113" cy="72" rx="8" ry="5.5" fill="#CC0000" opacity={eyeAlpha} />
        <Ellipse cx="113" cy="72" rx="5" ry="3" fill="#FF2222" opacity={eyeAlpha} />
        <Ellipse cx="112" cy="71" rx="2" ry="1.2" fill="#FF9999" opacity={eyeAlpha} />

        {/* Robe fold lines */}
        <Path d="M 96,100 Q 86,172 78,305" stroke="#1a1a1a" strokeWidth="1" fill="none" opacity={0.7} />
        <Path d="M 104,100 Q 114,172 122,305" stroke="#1a1a1a" strokeWidth="1" fill="none" opacity={0.7} />

        {/* Left skeletal hand */}
        <G>
          <Line x1="44" y1="252" x2="30" y2="266" stroke="#2a2a2a" strokeWidth="3" strokeLinecap="round" />
          <Line x1="44" y1="252" x2="26" y2="258" stroke="#2a2a2a" strokeWidth="3" strokeLinecap="round" />
          <Line x1="44" y1="252" x2="29" y2="250" stroke="#2a2a2a" strokeWidth="3" strokeLinecap="round" />
          <Line x1="44" y1="252" x2="38" y2="270" stroke="#2a2a2a" strokeWidth="3" strokeLinecap="round" />
        </G>

        {/* Right skeletal hand */}
        <G>
          <Line x1="156" y1="252" x2="170" y2="266" stroke="#2a2a2a" strokeWidth="3" strokeLinecap="round" />
          <Line x1="156" y1="252" x2="174" y2="258" stroke="#2a2a2a" strokeWidth="3" strokeLinecap="round" />
          <Line x1="156" y1="252" x2="171" y2="250" stroke="#2a2a2a" strokeWidth="3" strokeLinecap="round" />
          <Line x1="156" y1="252" x2="162" y2="270" stroke="#2a2a2a" strokeWidth="3" strokeLinecap="round" />
        </G>
      </Svg>
    </Animated.View>
  );
}
