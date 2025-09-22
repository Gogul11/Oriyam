import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Image,
  Alert
} from "react-native";
import MapView, { Polygon, Marker } from 'react-native-maps';
import { getUserProfile, updateUserProfile } from "../../api/profile";
import { userStore } from "../../stores/userStore";

interface Land {
  landId: string;
  userId: string;
  title: string;
  description: string;
  area: string;
  unit: string;
  rentPricePerMonth: string;
  soilType: string;
  waterSource: string;
  availabilityFrom: string;
  availabilityTo: string;
  district: string;
  subDistrict: string;
  village: string;
  coordinates: { latitude: number; longitude: number }[];
  photos: string[];
  status: boolean;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  user_id: string;
  username: string;
  email: string;
  mobile: string;
  age: number;
  goverment_id: string;
  gov_id_type: string;
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
    goverment_id: "",
    gov_id_type: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);
  const mapRef = useRef<MapView>(null);

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
          goverment_id: data.goverment_id,
          gov_id_type: data.gov_id_type,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Adjust map zoom to polygon
  useEffect(() => {
    if (selectedLand && mapRef.current) {
      mapRef.current.fitToCoordinates(selectedLand.coordinates, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  }, [selectedLand]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    // Password validation
    if (form.newPassword || form.confirmNewPassword) {
      if (form.newPassword !== form.confirmNewPassword) {
        Alert.alert("Error", "New password and confirm password do not match");
        return;
      }
    }

    try {
      const updated = await updateUserProfile(userStore.getState().token, form);
      setProfile({
        ...updated,
        lands: profile?.lands || [],
      });
      setEditing(false);
      setForm({
        ...form,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      Alert.alert("Success", "Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile:", err);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  if (loading)
    return <ActivityIndicator size="large" color="#2e7d32" style={{ flex: 1 }} />;
  if (!profile) return <Text style={styles.error}>No profile found</Text>;

  return (
    <ScrollView className="flex-1 px-4 py-2">
      <View style={styles.header}>
        <Text style={styles.heading}>{profile.username}'s Profile</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Personal Information</Text>

        {editing ? (
          <>
            {[
              { label: "Username", field: "username", keyboard: "default" },
              { label: "Email", field: "email", keyboard: "email-address" },
              { label: "Mobile", field: "mobile", keyboard: "phone-pad" },
              { label: "Age", field: "age", keyboard: "numeric" },
              { label: "DOB", field: "dateofbirth", keyboard: "default" },
              { label: "Gov ID Type", field: "gov_id_type", keyboard: "default" },
              { label: "Gov ID Number", field: "goverment_id", keyboard: "default" },
            ].map(({ label, field, keyboard }) => (
              <View style={styles.inputRow} key={field}>
                <Text style={styles.inputLabel}>{label}:</Text>
                <TextInput
                  style={styles.input}
                  value={form[field as keyof typeof form]}
                  onChangeText={(val) => handleChange(field, val)}
                  placeholder={label}
                  keyboardType={keyboard as any}
                />
              </View>
            ))}

            {/* Password Fields */}
            <Text style={{ fontWeight: "700", marginTop: 10, color: "#2e7d32" }}>Change Password</Text>
            {["currentPassword", "newPassword", "confirmNewPassword"].map((field) => (
              <View style={styles.inputRow} key={field}>
                <Text style={styles.inputLabel}>
                  {field === "currentPassword" ? "Current" : field === "newPassword" ? "New" : "Confirm"}:
                </Text>
                <TextInput
                  style={styles.input}
                  value={form[field as keyof typeof form]}
                  onChangeText={(val) => handleChange(field, val)}
                  placeholder={field}
                  secureTextEntry
                />
              </View>
            ))}

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {[
              { label: "Email", value: profile.email },
              { label: "Mobile", value: profile.mobile },
              { label: "Age", value: profile.age.toString() },
              { label: "DOB", value: new Date(profile.dateofbirth).toDateString() },
              { label: "Gov ID Type", value: profile.gov_id_type },
              { label: "Gov ID Number", value: profile.goverment_id },
            ].map(({ label, value }) => (
              <View style={styles.infoRow} key={label}>
                <Text style={styles.label}>{label}:</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.subheading}>Owned Lands</Text>
      {profile.lands && profile.lands.length > 0 ? (
        profile.lands.map((item) => (
          <TouchableOpacity
            key={item.landId}
            style={styles.card}
            onPress={() => setSelectedLand(item)}
          >
            <Text style={styles.landTitle}>{item.title}</Text>
            <Text style={styles.landDescription}>{item.description}</Text>
            <Text
              style={[
                styles.status,
                item.status ? styles.available : styles.notAvailable,
              ]}
            >
              {item.status ? "Available" : "Not Available"}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.error}>No lands found</Text>
      )}

      {/* Modal for Land Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedLand}
        onRequestClose={() => setSelectedLand(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              {selectedLand && (
                <>
                  <Text style={styles.modalTitle}>{selectedLand.title}</Text>
                  <Text style={styles.modalValue}>{selectedLand.description}</Text>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Basic Details</Text>
                    <Text style={styles.modalRow}>
                      Area: {selectedLand.area} {selectedLand.unit}
                    </Text>
                    <Text style={styles.modalRow}>
                      Rent Price: ₹{selectedLand.rentPricePerMonth} / month
                    </Text>
                    <Text style={styles.modalRow}>
                      Soil Type: {selectedLand.soilType}
                    </Text>
                    <Text style={styles.modalRow}>
                      Water Source: {selectedLand.waterSource}
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Availability</Text>
                    <Text style={styles.modalRow}>
                      From: {selectedLand.availabilityFrom}
                    </Text>
                    <Text style={styles.modalRow}>
                      To: {selectedLand.availabilityTo}
                    </Text>
                  </View>

                  <View style={{ height: 300, marginVertical: 10, borderRadius: 10, overflow: "hidden" }}>
                    <MapView
                      ref={mapRef}
                      style={{ flex: 1 }}
                      initialRegion={{
                        latitude: selectedLand.coordinates[0].latitude,
                        longitude: selectedLand.coordinates[0].longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                    >
                      <Polygon
                        coordinates={selectedLand.coordinates}
                        strokeColor="#2e7d32"
                        fillColor="rgba(76, 175, 80, 0.3)"
                        strokeWidth={2}
                      />

                      <Marker
                        coordinate={{
                          latitude: selectedLand.coordinates[0].latitude,
                          longitude: selectedLand.coordinates[0].longitude,
                        }}
                        title={selectedLand.title}
                      />
                    </MapView>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Photos</Text>
                    <View style={styles.photoContainer}>
                      {selectedLand.photos.map((photo, idx) => (
                        <Image
                          key={idx}
                          source={{ uri: photo }}
                          style={styles.photo}
                          resizeMode="cover"
                        />
                      ))}
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.status,
                      selectedLand.status ? styles.available : styles.notAvailable,
                    ]}
                  >
                    {selectedLand.status ? "Active" : "Inactive"}
                  </Text>

                  <Text style={styles.modalValue}>
                    Created: {new Date(selectedLand.created_at).toLocaleDateString()}
                  </Text>
                  <Text style={styles.modalValue}>
                    Updated: {new Date(selectedLand.updated_at).toLocaleDateString()}
                  </Text>

                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setSelectedLand(null)}
                  >
                    <Text style={styles.closeBtnText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#e8f5e9" },
  header: {
    backgroundColor: "#2e7d32",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  heading: { fontSize: 26, fontWeight: "bold", color: "#fff", textAlign: "center" },
  subheading: { fontSize: 20, fontWeight: "600", marginVertical: 10, color: "#1b5e20" },
  section: { backgroundColor: "#fff", padding: 14, borderRadius: 10, marginBottom: 14, borderWidth: 1, borderColor: "#c8e6c9" },
  sectionHeading: { fontSize: 18, fontWeight: "700", marginBottom: 8, color: "#2e7d32" },
  infoRow: { flexDirection: "row", marginBottom: 6 },
  label: { fontWeight: "600", width: 120, color: "#388e3c" },
  value: { fontSize: 15, color: "#333" },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  inputLabel: { width: 120, fontWeight: "600", color: "#388e3c" },
  input: { flex: 1, borderWidth: 1, borderColor: "#2e7d32", borderRadius: 8, padding: 10, color: "#1b5e20" },
  editBtn: { backgroundColor: "#388e3c", padding: 12, borderRadius: 8, marginTop: 10 },
  editBtnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  saveBtn: { backgroundColor: "#2e7d32", padding: 12, borderRadius: 8, marginTop: 10 },
  saveBtnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  card: { backgroundColor: "#fff", padding: 14, marginBottom: 14, borderRadius: 10, borderWidth: 1, borderColor: "#c8e6c9" },
  landTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4, color: "#1b5e20" },
  landDescription: { fontSize: 14, marginBottom: 6, color: "#555" },
  error: { textAlign: "center", marginTop: 40, fontSize: 16, color: "red" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "90%", maxHeight: "85%", backgroundColor: "#f9fff9", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#c8e6c9" },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center", color: "#2e7d32" },
  modalSection: { marginBottom: 10 },
  modalSectionTitle: { fontSize: 16, fontWeight: "700", color: "#1b5e20", marginBottom: 4 },
  modalRow: { fontSize: 14, color: "#333", marginBottom: 4 },
  modalValue: { fontSize: 14, color: "#555", marginBottom: 4 },
  photoContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  photo: { width: 90, height: 90, margin: 5, borderRadius: 8, borderWidth: 1, borderColor: "#a5d6a7" },
  status: { marginTop: 10, fontWeight: "700", fontSize: 15, textAlign: "right" },
  available: { color: "#2e7d32", backgroundColor: "#c8e6c9", paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6, alignSelf: "flex-end" },
  notAvailable: { color: "#c62828", backgroundColor: "#ffcdd2", paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6, alignSelf: "flex-end" },
  closeBtn: { backgroundColor: "#2e7d32", padding: 12, borderRadius: 8, marginTop: 16 },
  closeBtnText: { color: "#fff", fontWeight: "700", textAlign: "center", fontSize: 15 },
});

export default ProfileScreen;