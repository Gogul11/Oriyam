import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { getUserProfile } from "../../api/profile"; // updated API accepts no userId
import { userStore } from "../../stores/userStore";

interface Land {
  landId: string;
  title: string;
  description: string;
  area: string;
  unit: string;
  rentPricePerMonth: string;
  soilType: string;
  waterSource: string;
  status: boolean;
}

interface UserProfile {
  user_id: string;
  username: string;
  email: string;
  mobile: string;
  age: number;
  dateofbirth: string;
  lands: Land[];
}

const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(userStore.getState().token); // JWT sent automatically in API headers
        setProfile(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />;
  if (!profile) return <Text style={styles.error}>No profile found</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>👤 {profile.username}'s Profile</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{profile.email}</Text>

        <Text style={styles.label}>Mobile:</Text>
        <Text style={styles.value}>{profile.mobile}</Text>

        <Text style={styles.label}>Age:</Text>
        <Text style={styles.value}>{profile.age}</Text>

        <Text style={styles.label}>Date of Birth:</Text>
        <Text style={styles.value}>{new Date(profile.dateofbirth).toDateString()}</Text>
      </View>

      <Text style={styles.subheading}>Owned Lands</Text>
      {profile.lands && profile.lands.length > 0 ? (
        profile.lands.map((item) => (
        <View key={item.landId} style={styles.card}>
          <Text style={styles.landTitle}>{item.title}</Text>
          <Text>{item.description}</Text>
          <Text>Area: {item.area} {item.unit}</Text>
          <Text>Rent: ₹{item.rentPricePerMonth}/month</Text>
          <Text>Soil: {item.soilType}</Text>
          <Text>Water Source: {item.waterSource}</Text>
          <Text>Status: {item.status ? "✅ Available" : "❌ Not Available"}</Text>
        </View>
        ))
      ) : (
    <Text style={styles.error}>No lands found</Text>
    )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 26, fontWeight: "bold", marginBottom: 12 },
  subheading: { fontSize: 20, fontWeight: "600", marginTop: 20, marginBottom: 8 },
  section: { backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, marginBottom: 16 },
  label: { fontWeight: "600", marginTop: 4 },
  value: { marginLeft: 8, fontSize: 15 },
  card: { backgroundColor: "#fff", padding: 12, marginBottom: 12, borderRadius: 8, elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
  landTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  error: { textAlign: "center", marginTop: 40, fontSize: 16, color: "red" },
});

export default ProfileScreen;