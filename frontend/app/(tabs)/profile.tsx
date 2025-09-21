import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { getUserProfile, updateUserProfile } from "../../api/profile"; 
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
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    mobile: "",
    age: "",
    dateofbirth: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(userStore.getState().token); 
        setProfile(data);
        setForm({
          username: data.username,
          email: data.email,
          mobile: data.mobile,
          age: data.age.toString(),
          dateofbirth: data.dateofbirth,
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
  try {
    const updated = await updateUserProfile(userStore.getState().token, form);
    setProfile({
      ...updated,
      lands: profile?.lands || [],
    });
    setEditing(false);
  } catch (err) {
    console.error("Failed to update profile:", err);
  }
};

  if (loading) return <ActivityIndicator size="large" color="#2e7d32" style={{ flex: 1 }} />;
  if (!profile) return <Text style={styles.error}>No profile found</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>{profile.username}'s Profile</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Personal Information</Text>

        {editing ? (
          <>
            <TextInput
              style={styles.input}
              value={form.username}
              onChangeText={(val) => handleChange("username", val)}
              placeholder="Username"
            />
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(val) => handleChange("email", val)}
              placeholder="Email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={form.mobile}
              onChangeText={(val) => handleChange("mobile", val)}
              placeholder="Mobile"
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              value={form.age}
              onChangeText={(val) => handleChange("age", val)}
              placeholder="Age"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={form.dateofbirth}
              onChangeText={(val) => handleChange("dateofbirth", val)}
              placeholder="YYYY-MM-DD"
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{profile.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mobile:</Text>
              <Text style={styles.value}>{profile.mobile}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Age:</Text>
              <Text style={styles.value}>{profile.age}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text style={styles.value}>{new Date(profile.dateofbirth).toDateString()}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.subheading}>Owned Lands</Text>
      {profile.lands && profile.lands.length > 0 ? (
        profile.lands.map((item) => (
          <View key={item.landId} style={styles.card}>
            <Text style={styles.landTitle}>{item.title}</Text>
            <Text style={styles.landDescription}>{item.description}</Text>
            <View style={styles.landInfoRow}>
              <Text style={styles.landLabel}>Area:</Text>
              <Text style={styles.landValue}>{item.area} {item.unit}</Text>
            </View>
            <View style={styles.landInfoRow}>
              <Text style={styles.landLabel}>Rent:</Text>
              <Text style={styles.landValue}>₹{item.rentPricePerMonth}/month</Text>
            </View>
            <View style={styles.landInfoRow}>
              <Text style={styles.landLabel}>Soil:</Text>
              <Text style={styles.landValue}>{item.soilType}</Text>
            </View>
            <View style={styles.landInfoRow}>
              <Text style={styles.landLabel}>Water Source:</Text>
              <Text style={styles.landValue}>{item.waterSource}</Text>
            </View>
            <Text style={[styles.status, item.status ? styles.available : styles.notAvailable]}>
              {item.status ? "Available" : "Not Available"}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.error}>No lands found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#e8f5e9", paddingBottom: 40 },
  header: { backgroundColor: "#2e7d32", paddingVertical: 20, paddingHorizontal: 16, borderRadius: 12, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
  heading: { fontSize: 28, fontWeight: "bold", color: "#fff", textAlign: "center" },
  subheading: { fontSize: 22, fontWeight: "600", marginVertical: 12, color: "#1b5e20" },
  section: { backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  sectionHeading: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#2e7d32" },
  infoRow: { flexDirection: "row", marginBottom: 8 },
  label: { fontWeight: "600", width: 120, color: "#4caf50" },
  value: { fontSize: 15, color: "#333" },
  input: { borderWidth: 1, borderColor: "#2e7d32", borderRadius: 8, padding: 10, marginBottom: 12, color: "#1b5e20" },
  editBtn: { backgroundColor: "#388e3c", paddingVertical: 10, borderRadius: 8, marginTop: 12 },
  editBtnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  saveBtn: { backgroundColor: "#2e7d32", paddingVertical: 10, borderRadius: 8, marginTop: 12 },
  saveBtnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  card: { backgroundColor: "#fff", padding: 16, marginBottom: 16, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  landTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 6, color: "#1b5e20" },
  landDescription: { fontSize: 15, marginBottom: 8, color: "#555" },
  landInfoRow: { flexDirection: "row", marginBottom: 4 },
  landLabel: { fontWeight: "600", width: 100, color: "#388e3c" },
  landValue: { color: "#333" },
  status: { marginTop: 8, fontWeight: "700", textAlign: "right", fontSize: 15 },
  available: { color: "#2e7d32" },
  notAvailable: { color: "#c62828" },
  error: { textAlign: "center", marginTop: 40, fontSize: 16, color: "red" },
});

export default ProfileScreen;