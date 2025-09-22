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
  Alert,
  Platform,
} from "react-native";
import MapView, { Polygon, Marker } from 'react-native-maps';
import { getUserProfile, updateUserProfile } from "../../api/profile";
import { userStore } from "../../stores/userStore";
import { useRouter } from "expo-router";
import { fetchUserInterests } from "../../api/lands";
import { fetchUserTransactions } from "../../api/transactions";


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
interface Interest {
  interestId: string;
  landId: string;
  landTitle: string; // land title
  budgetPerMonth: number;
  rentPeriod: string;
  reason: string;
  created_at: string;
  landStatus: boolean;
}
interface Transaction {
  transactionId: string;
  landId: string;
  buyerId: string;
  sellerId: string;
  initialDeposit: string;
  initialDepositStatus: "paid" | "notpaid";
  monthlyDue: string;
  totalMonths: number;
  buyerApproved: boolean;
  sellerApproved: boolean;
  payments: any | null; // If you later add a payments table, replace `any` with proper type
  transactionDate: string;
}

const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [trans, setTrans] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const router = useRouter();
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
  const [showLands, setShowLands] = useState(false);
  const [showInterests, setShowInterests] = useState(false);
  const [showTrans, setShowTrans] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = userStore.getState().token;
        const data = await getUserProfile(token);
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

        const interestsData = await fetchUserInterests(data.user_id);
        // Ensure interests state is always an array
        setInterests(Array.isArray(interestsData) ? interestsData : []);

        const transData = await fetchUserTransactions(token);

        // FIX: Robustly ensure transData is an array before setting state
        if (Array.isArray(transData)) {
          setTrans(transData);
        } else {
          console.warn("Transactions API returned non-array data. Setting transactions to empty array.");
          setTrans([]);
        }

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

            <View className="items-center mt-2">
              <Text
                className="text-md text-blue-600 underline"
                onPress={() => router.push("/forgot-password")}
              >
                Forgot Password?
              </Text>
            </View>

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
              {
                label: "Gov ID Number",
                value: profile.goverment_id ? `****${profile.goverment_id.slice(-4)}` : ""
              },
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

      {/* Owned Lands Section */}
      <TouchableOpacity
        style={[styles.section, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
        onPress={() => setShowLands(!showLands)}
      >
        <Text style={styles.sectionHeading}>
          Owned Lands ({profile.lands?.length || 0})
        </Text>
        <Text style={{ color: "#388e3c", fontSize: 13 }}>
          {showLands ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {showLands && (
        profile.lands && profile.lands.length > 0 ? (
          profile.lands.map((item) => (
            <View key={item.landId} style={{ marginBottom: 10 }}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => setSelectedLand(item)}
              >
                <Text style={styles.landTitle}>{item.title}</Text>
                <Text style={styles.landDescription}>{item.description}</Text>
                <Text style={[styles.status, item.status ? styles.available : styles.notAvailable]}>
                  {item.status ? "Available" : "Not Available"}
                </Text>
                <TouchableOpacity style={styles.interestBtn}
                  onPress={() =>
                    router.push({
                      pathname: "LandInterest",
                      params: {
                        landId: item.landId,
                        title: item.title,
                        district: item.district,
                      },
                    })
                  }
                >
                  <Text style={styles.interestBtnText}>View Interests</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyStateText}>No lands currently listed.</Text>
        ))}

      {/* Interests Shown by User */}
      <TouchableOpacity
        style={[styles.section, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
        onPress={() => setShowInterests(!showInterests)}
      >
        <Text style={styles.sectionHeading}>Interests ({interests.length})</Text>
        <Text style={{ color: "#388e3c", fontSize: 13 }}>
          {showInterests ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {showInterests && interests.length > 0 ? (
        interests.map((interest) => (
          <View key={interest.interestId} style={{ marginBottom: 10 }}>
            <TouchableOpacity
              style={styles.card}
            >
              <Text style={styles.landTitle}>{interest.landTitle}</Text>
              <Text>Budget: ₹{interest.budgetPerMonth}</Text>
              <Text>Rent Period: {interest.rentPeriod}</Text>
              <Text>Status: {interest.landStatus ? "Active" : "Inactive"}</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        // FIX: Display empty state message when expanded and empty
        showInterests && <Text style={styles.emptyStateText}>No interests found</Text>
      )}

      {/* Transactions Shown by User */}
      <TouchableOpacity
        style={[
          styles.section,
          { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
        ]}
        onPress={() => setShowTrans(!showTrans)}
      >
        <Text style={styles.sectionHeading}>Transactions ({trans.length})</Text>
        <Text style={{ color: "#388e3c", fontSize: 13 }}>
          {showTrans ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {showTrans && Array.isArray(trans) && trans.length > 0 ? (
        trans.map((t) => (
          <View key={t.transactionId} style={{ marginBottom: 10 }}>
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "Transaction",
                  params: { landId: t.transactionId, date: t.transactionDate },
                })
              }
            >
              <Text>Initial Deposit: ₹{t.initialDeposit}</Text>
              <Text>Deposit Status: {t.initialDepositStatus}</Text>
              <Text>Monthly Due: ₹{t.monthlyDue}</Text>
              <Text>Total Months: {t.totalMonths}</Text>
              <Text>Buyer Approved: {t.buyerApproved ? "✅" : "❌"}</Text>
              <Text>Seller Approved: {t.sellerApproved ? "✅" : "❌"}</Text>
              <Text>Date: {new Date(t.transactionDate).toDateString()}</Text>
            </TouchableOpacity>

            {!t.buyerApproved && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#388e3c",
                  padding: 10,
                  borderRadius: 8,
                  marginTop: 8,
                  alignItems: "center",
                }}
                onPress={() => {
                  console.log("Pay advance for transaction:", t.transactionId);
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Pay Advance</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      ) : (
        // FIX: Display empty state message when expanded and empty
        showTrans && <Text style={styles.emptyStateText}>No Transactions found</Text>
      )}

      {/* Logout Button */}
      {/* <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>Logout</Text>
      </TouchableOpacity> */}


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
                    {/* --- INSERTED LOCATION DETAILS HERE ---*/}
                    <Text style={styles.modalRow}>
                      Village: {selectedLand.village}
                    </Text>
                    <Text style={styles.modalRow}>
                      SubDistrict: {selectedLand.subDistrict}
                    </Text>
                    <Text style={styles.modalRow}>
                      District: {selectedLand.district}
                    </Text>
                    {/*--- END INSERTED LOCATION DETAILS ---*/}
                  </View>

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

                  {/* ... (MapView and Photos sections follow) ... */}

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
    borderRadius: 5,
    marginBottom: 20,
    opacity: 0.9
  },
  heading: { fontSize: 20, color: "#fff", textAlign: "center" },
  subheading: { fontSize: 20, fontWeight: "600", marginVertical: 10, color: "#1b5e20" },
  section: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#c8e6c9",
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
      android: { elevation: 3 },
    })
  },
  sectionHeading: { fontSize: 18, fontWeight: "700", marginBottom: 8, color: "#2e7d32" },
  infoRow: { flexDirection: "row", marginBottom: 6 },
  label: { fontWeight: "600", width: 120, color: "#388e3c" },
  value: { fontSize: 15, color: "#333" },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  inputLabel: { width: 120, fontWeight: "600", color: "#388e3c" },
  input: { flex: 1, borderWidth: 1, borderColor: "#2e7d32", borderRadius: 8, padding: 10, color: "#1b5e20" },
  editBtn: {
    backgroundColor: "#388e3c",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
      android: { elevation: 5 },
    })
  },
  editBtnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  saveBtn: {
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
      android: { elevation: 5 },
    })
  },
  saveBtnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  logoutBtn: {
    backgroundColor: "#c62828",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 40,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
      android: { elevation: 5 },
    })
  },
  logoutBtnText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center"
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    marginBottom: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c8e6c9",
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 1 },
      android: { elevation: 1 },
    })
  },
  landTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4, color: "#1b5e20" },
  landDescription: { fontSize: 14, marginBottom: 6, color: "#555" },
  error: { textAlign: "center", marginTop: 40, fontSize: 16, color: "red" },
  emptyStateText: {
    textAlign: "center",
    fontSize: 15,
    color: "#757575",
    paddingVertical: 10,
    backgroundColor: '#f1f8e9',
    borderRadius: 8,
    marginHorizontal: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e8f5e9'
  },
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
  interestBtn: { backgroundColor: "#4caf50", padding: 10, borderRadius: 8, marginTop: 5, marginHorizontal: 5 },
  interestBtnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});

export default ProfileScreen;