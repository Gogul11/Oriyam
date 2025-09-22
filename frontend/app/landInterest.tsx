import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchLandInterests } from "../api/lands";

interface Interest {
  interestId: string;
  landId: string;
  user_id: string;
  username: string;
  email: string;
  mobile: string;
  age: number;
  budgetPerMonth: number;
  rentPeriod: string;
  reason?: string;
  created_at: string;
}

const LandInterest = () => {
  const { landId, title, district } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedUser, setSelectedUser] = useState<Interest | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const getInterests = async () => {
      try {
        setLoading(true);
        console.log("Fetching interests for landId:", landId);
        if (landId) {
          const data = await fetchLandInterests(landId as string);
          setInterests(data);
        }
      } catch (err) {
        console.error("Failed to fetch interests", err);
      } finally {
        setLoading(false);
      }
    };

    getInterests();
  }, [landId]);

  const handleCardPress = (user: Interest) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{district}</Text>
        </View>

        {interests.length === 0 ? (
          <Text style={styles.empty}>No interests yet for this land.</Text>
        ) : (
          interests.map((item) => (
            <TouchableOpacity
              key={item.interestId}
              style={styles.card}
              onPress={() => handleCardPress(item)}
            >
              <Text style={styles.userName}>{item.username}</Text>
              <Text style={styles.bid}>
                Bid: ₹{item.budgetPerMonth.toLocaleString()} / month
              </Text>
              {item.reason && <Text style={styles.message}>"{item.reason}"</Text>}
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push("(tabs)/profile")}
        >
          <Text style={styles.backBtnText}>⬅ Back</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 🔹 Modal for user details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedUser && (
              <>
                <Text style={styles.modalTitle}>{selectedUser.username}</Text>
                <Text>Email: {selectedUser.email}</Text>
                <Text>Mobile: {selectedUser.mobile}</Text>
                <Text>Age: {selectedUser.age}</Text>
                <Text>Bid: ₹{selectedUser.budgetPerMonth.toLocaleString()}</Text>
                {selectedUser.reason && <Text>Reason: {selectedUser.reason}</Text>}

                <View style={styles.modalButtons}>
                  <Pressable
                    style={[styles.modalBtn, { backgroundColor: "#2e7d32" }]}
                    onPress={() => handleCall(selectedUser.mobile)}
                  >
                    <Text style={styles.modalBtnText}>Call</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.modalBtn, { backgroundColor: "#aaa" }]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalBtnText}>Close</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#e8f5e9", flexGrow: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { backgroundColor: "#2e7d32", padding: 16, borderRadius: 10, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 16, color: "#c8e6c9", marginTop: 4 },
  empty: { textAlign: "center", fontSize: 16, color: "#555", marginTop: 30 },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#c8e6c9",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  userName: { fontSize: 18, fontWeight: "bold", color: "#1b5e20" },
  bid: { fontSize: 16, fontWeight: "600", marginTop: 4, color: "#2e7d32" },
  message: { fontStyle: "italic", marginTop: 6, color: "#555" },
  backBtn: { backgroundColor: "#2e7d32", padding: 12, borderRadius: 8, marginTop: 20 },
  backBtnText: { color: "#fff", fontWeight: "700", textAlign: "center" },

  // Modal styles
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { width: "85%", backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#1b5e20" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  modalBtn: { padding: 12, borderRadius: 8, flex: 1, marginHorizontal: 5 },
  modalBtnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});

export default LandInterest;
