import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

type CarData = {
  email: string;
  phone: string;
  carType: string;
  carModel: string;
  licensePlate: string;
  color?: string;
  ownerNote?: string;
  insurance?: string;
  batteryCapacity: string;
  tirePressure: string;
};

const BACKEND_IP = "pa-ev-charge-finder-back.onrender.com";
const BASE_URL = `http://${BACKEND_IP}`;

const CarRegistrationScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CarData>({
    email: "",
    phone: "",
    carType: "Tesla",
    carModel: "Model X",
    licensePlate: "",
    color: "",
    ownerNote: "",
    insurance: "",
    batteryCapacity: "100",
    tirePressure: "32",
  });
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          // User is already logged in, redirect to car screen
          router.replace("/car");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Load saved form data on component mount
  useEffect(() => {
    const loadSavedFormData = async () => {
      try {
        const savedFormData = await AsyncStorage.getItem("carFormData");
        if (savedFormData) {
          const parsedData = JSON.parse(savedFormData);
          setFormData((prev) => ({ ...prev, ...parsedData }));
        }
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    };

    loadSavedFormData();
  }, []);

  // Save form data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveFormData = async () => {
      try {
        await AsyncStorage.setItem("carFormData", JSON.stringify(formData));
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    };

    saveFormData();
  }, [formData]);

  const handleChange = (field: keyof CarData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const safeJsonParse = async (response: Response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { error: text };
    }
  };

  const handleRegister = async () => {
    if (!formData.email || !formData.phone || !formData.licensePlate) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/registerCar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await safeJsonParse(response);

      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userCar", JSON.stringify(formData));
        // Clear the saved form data after successful registration
        await AsyncStorage.removeItem("carFormData");
        Alert.alert("Success", "Car registered successfully!");
        router.replace("/car");
      } else {
        Alert.alert("Error", data.error || "Failed to register car");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.phone) {
      Alert.alert("Error", "Please enter email and phone for login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, phone: formData.phone }),
      });

      const data = await safeJsonParse(response);

      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userCar", JSON.stringify(data.car));
        // Clear the saved form data after successful login
        await AsyncStorage.removeItem("carFormData");
        Alert.alert("Success", "Logged in successfully!");
        router.replace("/car");
      } else {
        Alert.alert("Error", data.error || "Failed to login");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.push("/");
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  // Show loading indicator while checking authentication status
  if (checkingAuth) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size='large' color='#00FFB3' />
        <Text style={styles.loadingText}>
          Checking authentication status...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <MaterialIcons name='arrow-back' size={28} color='#ffffff' />
      </TouchableOpacity>

      <Text style={styles.title}>
        {isLoginMode ? "Login to Your Car" : "Register Your Car"}
      </Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
          <Text style={styles.toggleText}>
            {isLoginMode
              ? "Need to register? Switch to Register"
              : "Already registered? Switch to Login"}
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder='Email *'
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType='email-address'
        autoCapitalize='none'
      />

      <TextInput
        style={styles.input}
        placeholder='Phone Number *'
        value={formData.phone}
        onChangeText={(text) => handleChange("phone", text)}
        keyboardType='phone-pad'
      />

      {!isLoginMode && (
        <>
          <View style={styles.row}>
            <View style={[styles.column, { marginRight: 10 }]}>
              <Text style={styles.label}>Car Type</Text>
              <TextInput
                style={styles.input}
                value={formData.carType}
                onChangeText={(text) => handleChange("carType", text)}
              />
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Model</Text>
              <TextInput
                style={styles.input}
                value={formData.carModel}
                onChangeText={(text) => handleChange("carModel", text)}
              />
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder='License Plate *'
            value={formData.licensePlate}
            onChangeText={(text) => handleChange("licensePlate", text)}
            autoCapitalize='characters'
          />

          <View style={styles.row}>
            <View style={[styles.column, { marginRight: 10 }]}>
              <Text style={styles.label}>Battery Capacity (%)</Text>
              <TextInput
                style={styles.input}
                value={formData.batteryCapacity}
                onChangeText={(text) => handleChange("batteryCapacity", text)}
                keyboardType='numeric'
              />
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Tire Pressure (PSI)</Text>
              <TextInput
                style={styles.input}
                value={formData.tirePressure}
                onChangeText={(text) => handleChange("tirePressure", text)}
                keyboardType='numeric'
              />
            </View>
          </View>
        </>
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={isLoginMode ? handleLogin : handleRegister}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading
            ? isLoginMode
              ? "Logging in..."
              : "Registering..."
            : isLoginMode
            ? "Login Car"
            : "Register Car"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1C1F",
    padding: 20,
    paddingTop: 60,
    position: "relative",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 20,
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    padding: 8,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  toggleContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  toggleButton: {
    padding: 10,
  },
  toggleText: {
    color: "#00FFB3",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  input: {
    backgroundColor: "#142B2E",
    color: "#fff",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    marginBottom: 15,
  },
  column: {
    flex: 1,
  },
  label: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: "#00FFB3",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#0D1C1F",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default CarRegistrationScreen;
