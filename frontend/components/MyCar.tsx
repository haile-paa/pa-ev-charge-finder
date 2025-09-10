import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Car data type
type CarData = {
  email: string;
  phone: string;
  carType: string;
  carModel: string;
  licensePlate: string;
  color?: string;
  ownerNote?: string;
  insurance?: string;
};

// Weather data type
interface WeatherData {
  temperature: number;
  windSpeed: number;
  condition: string;
  iconUrl: string;
  location: string;
  humidity: number;
}

const weatherIcons: Record<number, { condition: string; icon: string }> = {
  0: {
    condition: "Clear Sky",
    icon: "https://img.icons8.com/ios-filled/50/sun.png",
  },
  1: {
    condition: "Mainly Clear",
    icon: "https://img.icons8.com/ios-filled/50/partly-cloudy-day.png",
  },
  2: {
    condition: "Partly Cloudy",
    icon: "https://img.icons8.com/ios-filled/50/partly-cloudy-day.png",
  },
  3: {
    condition: "Overcast",
    icon: "https://img.icons8.com/ios-filled/50/cloud.png",
  },
  45: {
    condition: "Fog",
    icon: "https://img.icons8.com/ios-filled/50/fog-day.png",
  },
  48: {
    condition: "Rime Fog",
    icon: "https://img.icons8.com/ios-filled/50/fog-day.png",
  },
  51: {
    condition: "Drizzle",
    icon: "https://img.icons8.com/ios-filled/50/rain.png",
  },
  61: {
    condition: "Rain",
    icon: "https://img.icons8.com/ios-filled/50/rain.png",
  },
  71: {
    condition: "Snow",
    icon: "https://img.icons8.com/ios-filled/50/snow.png",
  },
  95: {
    condition: "Thunderstorm",
    icon: "https://img.icons8.com/ios-filled/50/storm.png",
  },
};

const MyCar = () => {
  const router = useRouter();
  const [carData, setCarData] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Car Status" | "Climate">(
    "Car Status"
  );
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    const loadCarData = async () => {
      try {
        const savedCar = await AsyncStorage.getItem("userCar");
        if (savedCar) setCarData(JSON.parse(savedCar));
      } catch (error) {
        console.error("Failed to load car data", error);
      } finally {
        setLoading(false);
      }
    };
    loadCarData();
  }, []);

  // Fetch weather when Climate tab is active
  useEffect(() => {
    if (activeTab === "Climate") getWeatherData();
  }, [activeTab]);

  const getWeatherData = async () => {
    try {
      setWeatherLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission denied");
        setWeatherLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m`
      );
      const data = await response.json();

      const temp = data.current_weather.temperature;
      const windSpeed = data.current_weather.windspeed;
      const weatherCode = data.current_weather.weathercode;
      const humidity = data.hourly.relativehumidity_2m[0] || 0;
      const iconData = weatherIcons[weatherCode] || weatherIcons[0];

      setWeather({
        temperature: temp,
        windSpeed,
        condition: iconData.condition,
        iconUrl: iconData.icon,
        location: `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`,
        humidity,
      });
    } catch (error) {
      console.error("Weather fetch error:", error);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleLogout = async () => {
    // Show confirmation dialog
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes, Logout",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("userCar");
            Alert.alert("Success", "Logged out successfully!");
            router.replace("/"); // Navigate back to home/registration screen
          } catch (error) {
            console.error("Error logging out:", error);
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size='large' color='#00FFB3' />
      </View>
    );
  }

  if (!carData) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.title}>No Car Registered</Text>
        <Text style={styles.noCarText}>
          Please register your car to view its status
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with title and logout button */}
      <View style={styles.header}>
        <Text style={styles.title}>{carData.carType}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name='log-out-outline' size={24} color='#FF3B30' />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require("../assets/images/car.png")}
        style={styles.carImage}
        resizeMode='contain'
      />

      <View style={styles.statusTabs}>
        <TouchableOpacity onPress={() => setActiveTab("Car Status")}>
          <Text
            style={
              activeTab === "Car Status" ? styles.tabActive : styles.tabInactive
            }
          >
            Car Status
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("Climate")}>
          <Text
            style={
              activeTab === "Climate" ? styles.tabActive : styles.tabInactive
            }
          >
            Climate
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "Car Status" ? (
        <View style={styles.infoBox}>
          {/* Plate Number */}
          <View style={styles.infoItem}>
            <Ionicons name='pricetag' size={20} color='#00FFC3' />
            <Text style={styles.label}>Plate Number</Text>
            <Text style={styles.value}>{carData.licensePlate}</Text>
          </View>

          {/* Car Model */}
          <View style={styles.infoItem}>
            <Ionicons name='car-sport' size={20} color='#00FFC3' />
            <Text style={styles.label}>Car Model</Text>
            <Text style={styles.value}>{carData.carModel}</Text>
          </View>

          {/* Color */}
          {carData.color && (
            <View style={styles.infoItem}>
              <MaterialIcons name='color-lens' size={20} color='#00FFC3' />
              <Text style={styles.label}>Color</Text>
              <Text style={styles.value}>{carData.color}</Text>
            </View>
          )}

          {/* Owner Note */}
          {carData.ownerNote && (
            <View style={styles.infoItem}>
              <Entypo name='text-document' size={20} color='#00FFC3' />
              <Text style={styles.label}>Owner Note</Text>
              <Text style={styles.value}>{carData.ownerNote}</Text>
            </View>
          )}

          {/* Insurance */}
          {carData.insurance && (
            <View style={styles.infoItem}>
              <Ionicons name='shield-checkmark' size={20} color='#00FFC3' />
              <Text style={styles.label}>Insurance</Text>
              <Text style={styles.value}>{carData.insurance}</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.climateContainer}>
          {weatherLoading ? (
            <ActivityIndicator size='large' color='#00FFB3' />
          ) : weather ? (
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Image
                source={{ uri: weather.iconUrl }}
                style={{ width: 50, height: 50 }}
              />
              <Text style={{ color: "#fff", fontSize: 24 }}>
                {weather.temperature}°C
              </Text>
              <Text style={{ color: "#aaa" }}>{weather.condition}</Text>
              <Text style={{ color: "#aaa" }}>
                Humidity: {weather.humidity}%
              </Text>
              <Text style={{ color: "#aaa" }}>
                Wind: {weather.windSpeed} m/s
              </Text>
              <Text style={{ color: "#666", fontSize: 12 }}>
                {weather.location}
              </Text>
            </View>
          ) : (
            <Text style={{ color: "#aaa", textAlign: "center" }}>
              Weather data unavailable
            </Text>
          )}
        </View>
      )}

      <View style={styles.contactInfo}>
        <Text style={styles.contactText}>Registered to: {carData.email}</Text>
        <Text style={styles.contactText}>Contact: {carData.phone}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1C1F",
    padding: 20,
    paddingTop: 50,
  },
  centered: { justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 59, 48, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    color: "#FF3B30",
    marginLeft: 5,
    fontWeight: "500",
  },
  noCarText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  carImage: { width: "100%", height: 200, marginVertical: 10 },
  statusTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  tabActive: {
    color: "#00FFB3",
    fontWeight: "600",
    fontSize: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#00FFB3",
    paddingBottom: 5,
  },
  tabInactive: { color: "#888", fontWeight: "400", fontSize: 16 },
  infoBox: {
    backgroundColor: "#142B2E",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoItem: {
    width: "48%",
    backgroundColor: "#0F2A2E",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  label: { color: "#ccc", fontSize: 12, marginTop: 4 },
  value: { color: "#fff", fontSize: 16, fontWeight: "700" },
  contactInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#142B2E",
    borderRadius: 8,
  },
  contactText: { color: "#aaa", fontSize: 14, marginBottom: 5 },
  climateContainer: {
    backgroundColor: "#142B2E",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
});

export default MyCar;
