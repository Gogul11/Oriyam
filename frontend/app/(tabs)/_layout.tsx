import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Platform } from 'react-native';

// Define a central theme color for consistency
const primaryGreen = '#2e7d32'; // Deep Green

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primaryGreen, // Active icon/label color
        tabBarInactiveTintColor: '#9e9e9e', // Grey for inactive items
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#f9fff9', // Very light green/off-white background
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: Platform.OS === 'ios' ? 90 : 60, // Adjust height for iOS safety area
          paddingBottom: Platform.OS === 'ios' ? 30 : 0, // Padding for iOS icons
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="addLand"
        options={{
          title: 'Add Land',
          // Distinct style for the primary action button
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={24} color={color} />
          ),
          // Custom label positioning/styling for the central icon
          tabBarLabel: ({ focused }) => (
            <Text style={{
              color: focused ? primaryGreen : '#9e9e9e',
              fontSize: 10,
              marginTop: -5,
              fontWeight: '600',
            }}>
              Add Land
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}