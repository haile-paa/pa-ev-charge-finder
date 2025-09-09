import { Stack, usePathname, Link } from "expo-router";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const pathname = usePathname();
  const [active, setActive] = useState<"home" | "car" | null>(null);

  useEffect(() => {
    if (pathname === "/") setActive("home");
    else if (pathname === "/car") setActive("car");
    else setActive(null);
  }, [pathname]);

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name='car' />
        <Stack.Screen name='map' />
      </Stack>

      {active && (
        <View style={styles.footerContainer}>
          <View style={styles.footerBackground} />

          {/* Home Tab */}
          <Link href='/' asChild>
            <TouchableOpacity style={styles.tabButton}>
              <View
                style={[
                  styles.iconWrapper,
                  active === "home" && styles.activeIcon,
                ]}
              >
                <Ionicons
                  name='home'
                  size={22}
                  color={
                    active === "home" ? "#00FF7F" : "rgba(255,255,255,0.6)"
                  }
                />
              </View>
              <Text
                style={[styles.tabText, active === "home" && styles.activeTab]}
              >
                Home
              </Text>
            </TouchableOpacity>
          </Link>

          {/* My Car Tab */}
          <Link href='/car/register' asChild>
            <TouchableOpacity style={styles.tabButton}>
              <View
                style={[
                  styles.iconWrapper,
                  active === "car" && styles.activeIcon,
                ]}
              >
                <Ionicons
                  name='car-sport'
                  size={22}
                  color={active === "car" ? "#00FF7F" : "rgba(255,255,255,0.6)"}
                />
              </View>
              <Text
                style={[styles.tabText, active === "car" && styles.activeTab]}
              >
                My Car
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  footerContainer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 65,
    borderRadius: 20,
    backgroundColor: "rgba(10,15,25,0.9)",
    shadowColor: "#00FF7F",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },

  footerBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.15)",
  },

  tabButton: { alignItems: "center", justifyContent: "center" },

  iconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  activeIcon: {
    backgroundColor: "rgba(0,255,127,0.15)",
    shadowColor: "#00FF7F",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    elevation: 6,
  },

  tabText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },

  activeTab: { color: "#00FF7F", fontWeight: "700" },
});
