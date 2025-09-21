import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

interface Interest {
  id: string;
  userName: string;
  bidAmount: number;
  message?: string;
  createdAt: string;
}

const LandInterest = () => {
  const { landId, title, district } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [interests, setInterests] = useState<Interest[]>([]);

  useEffect(() => {
    // 🔹 Replace with your real API call
    const fetchInterests = async () => {
      setLoading(true);
      try {
        // Mock data
        const data: Interest[] = [
          {
            id: "1",
            userName: "Ravi Kumar",
            bidAmount: 95000,
            message: "Looking for long-term lease",
            createdAt: "2025-09-20T12:30:00Z",
          },
          {
            id: "2",
            userName: "Priya Sharma",
            bidAmount: 100000,
            message: "Ready to pay in advance",
            createdAt: "2025-09-21T09:15:00Z",
          },
        ];
        setInterests(data);
      } catch (err) {
        console.error("Failed to fetch interests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, [landId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{district}</Text>
      </View>

      {interests.length === 0 ? (
        <Text style={styles.empty}>No interests yet for this land.</Text>
      ) : (
        interests.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.bid}>Bid: ₹{item.bidAmount.toLocaleString()}</Text>
            {item.message && <Text style={styles.message}>"{item.message}"</Text>}
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        ))
      )}

      <TouchableOpacity
  style={styles.backBtn}
  onPress={() => router.push("(tabs)/profile")}
>
  <Text style={styles.backBtnText}>⬅ Back</Text>
</TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#e8f5e9",
    flexGrow: 1,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
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
  date: { marginTop: 8, fontSize: 12, color: "#777" },
  backBtn: {
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  backBtnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});

export default LandInterest;
