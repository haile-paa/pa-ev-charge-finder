import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  Linking,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function MapScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Rotate animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Progress animation
      Animated.timing(progressAnim, {
        toValue: 0.8,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    } else {
      pulseAnim.stopAnimation();
      rotateAnim.stopAnimation();
      progressAnim.stopAnimation();
    }
  }, [loading]);

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError(
            "Location permission denied. Please enable location access in settings."
          );
          setLoading(false);
          return;
        }

        setLoading(true);
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(currentLocation);

        // Open Google Maps directly with charging station search
        openGoogleMaps(currentLocation.coords);
      } catch (err) {
        console.error("Location error:", err);
        setError("Failed to get your current location");
        setLoading(false);
      }
    })();
  }, []);

  const openGoogleMaps = (coords: Location.LocationObjectCoords) => {
    if (!coords) return;

    const { latitude, longitude } = coords;

    // Create Google Maps URL for searching charging stations
    const url = `https://www.google.com/maps/search/?api=1&query=car+charging+stations+near+me&query_place_id=&ll=${latitude},${longitude}`;

    Linking.openURL(url).catch((err) => {
      console.error("Failed to open Google Maps:", err);
      Alert.alert(
        "Error",
        "Could not open Google Maps. Please make sure it's installed."
      );
      setLoading(false);
    });

    // Navigate back after a short delay
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  const retryLocationAccess = async () => {
    setError(null);
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied.");
        setLoading(false);
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      openGoogleMaps(currentLocation.coords);
    } catch (err) {
      setError("Failed to get location");
      setLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={retryLocationAccess}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.loadingScreen}>
          {/* Animated Ethiopian character */}
          <Animated.View
            style={{
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
            }}
          >
            {/* <Text style={styles.ethiopianText}>ፖ</Text> */}
          </Animated.View>

          {/* Animated rotating icon */}
          <Animated.View
            style={{
              marginVertical: 30,
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <MaterialIcons
              name='location-searching'
              size={60}
              color='#00FF7F'
            />
          </Animated.View>

          {/* Loading text with pulse animation */}
          <Animated.Text
            style={[
              styles.loadingMessage,
              {
                opacity: pulseOpacity,
                transform: [{ scale: pulseScale }],
              },
            ]}
          >
            Finding charging stations near you...
          </Animated.Text>

          {/* Progress bar */}
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[styles.progressBar, { width: progressWidth }]}
            />
          </View>

          {/* Charging animation */}
          <View style={styles.chargingAnimation}>
            <View style={styles.chargingDot} />
            <View style={styles.chargingDot} />
            <View style={styles.chargingDot} />
            <View style={styles.chargingDot} />
            <View style={styles.chargingDot} />
          </View>
        </View>
      ) : (
        <View style={styles.centered}>
          <Text style={styles.successText}>Opening Google Maps...</Text>
          <Text style={styles.instructions}>
            Google Maps is opening with charging stations near your location.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#ef4444",
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 20,
  },
  successText: {
    fontSize: 22,
    color: "#00FF7F",
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: "#00cc66",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00cc66",
  },
  backButtonText: {
    color: "#00FF7F",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  ethiopianText: {
    fontSize: 80,
    color: "#00FF7F",
    marginBottom: 20,
  },
  loadingMessage: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "500",
  },
  progressBarContainer: {
    width: "80%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#00FF7F",
    borderRadius: 4,
  },
  chargingAnimation: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  chargingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00FF7F",
    marginHorizontal: 5,
  },
});
