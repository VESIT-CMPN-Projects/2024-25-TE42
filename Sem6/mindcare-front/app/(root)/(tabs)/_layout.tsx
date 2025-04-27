import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import ChatScreen from "./ChatScreen";

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
    <Feather name={name} size={24} color={focused ? "#fff" : "#bbb"} />
  </View> 
);

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="message-circle" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="user" focused={focused} />,
        }}
      />
      
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 5, // Slightly above the screen edge
    left: 15,
    right: 15,
    height: 45, // Slightly increased for a modern feel
    backgroundColor: "#EAE0C8", // Light background to match the theme
    borderRadius: 5,
    borderTopWidth: 0,
    elevation: 6, // Soft shadow effect
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  iconContainerActive: {
    backgroundColor: "#262424", // Highlight color for active tab
  },
});