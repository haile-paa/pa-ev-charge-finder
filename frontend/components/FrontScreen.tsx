import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useEffect } from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
  withSequence,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function FrontScreen() {
  const glowAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);
  const floatAnimation = useSharedValue(0);

  useEffect(() => {
    // Glow animation for the main symbol
    glowAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      false
    );

    // Pulse animation for buttons
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );

    // Float animation for the symbol
    floatAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 }),
        withTiming(-1, { duration: 3000 })
      ),
      -1,
      true
    );
  }, []);

  // Text-specific animation for the symbol (only color animated)
  const glowTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      glowAnimation.value,
      [0, 1],
      ["#00FF7F", "#40E0D0"]
    );
    return {
      color: color,
    };
  });

  // View-specific animation for floating effect
  const floatStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: floatAnimation.value * 8 }],
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Background with gradient overlay */}
      <ImageBackground
        source={require("../assets/images/Pa-Station-front1.png")}
        style={styles.background}
        resizeMode='cover'
      >
        <View style={styles.gradientOverlay} />

        {/* Main Content */}
        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Animated.View style={floatStyle}>
              <AnimatedText style={[styles.mainSymbol, glowTextStyle]}>
                ፖ
              </AnimatedText>
            </Animated.View>

            <View style={styles.brandContainer}>
              <View style={styles.brandRow}>
                <Ionicons name='flash' size={40} color='#00FF7F' />
                <Text style={styles.brandTitle}>EV Charge</Text>
              </View>
            </View>

            <Text style={styles.tagline}>
              Find and charge your electric vehicle at stations near you
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <Link href='/map' asChild>
              <AnimatedTouchableOpacity
                style={[styles.primaryButton, pulseStyle]}
                activeOpacity={0.8}
              >
                <View style={styles.buttonBlur}>
                  <View style={styles.buttonGradient}>
                    <View style={styles.buttonContent}>
                      <Ionicons name='map' size={24} color='#00FF7F' />
                      <Text style={styles.primaryButtonText}>
                        Find Stations
                      </Text>
                      <Ionicons
                        name='chevron-forward'
                        size={20}
                        color='#00FF7F'
                      />
                    </View>
                  </View>
                </View>
              </AnimatedTouchableOpacity>
            </Link>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
    justifyContent: "space-between",
  },
  heroSection: {
    alignItems: "center",
    paddingTop: 40,
  },
  mainSymbol: {
    fontSize: 80,
    marginBottom: 57,
    textShadowColor: "#00FF7F",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actionSection: {
    gap: 16,
    marginTop: 40, // space between tagline and button
  },
  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,255,127,0.3)",
  },
  buttonBlur: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  buttonGradient: {
    borderRadius: 16,
    backgroundColor: "rgba(0,255,127,0.1)",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    color: "#00FF7F",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginLeft: -24,
  },
});
