// /app/(tabs)/auctions.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Auction = {
  id: string;
  title: string;
  location: string;
  highestBid: number;
  bids: number;
  type: "live" | "timed" | "sealed";
  status: string;
};

const auctions: Auction[] = [
  {
    id: "1",
    title: "Prime Rice Paddy Fields - Thanjavur District",
    location: "Thanjavur, Tamil Nadu",
    highestBid: 83000,
    bids: 8,
    type: "live",
    status: "Ending soon",
  },
  {
    id: "2",
    title: "Cotton Fields - Vidarbha Region",
    location: "Nagpur, Maharashtra",
    highestBid: 90000,
    bids: 5,
    type: "sealed",
    status: "New Auction",
  },
];

export default function Auctions() {
  const router = useRouter();

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "live":
        return { backgroundColor: "#16a34a" }; // green
      case "timed":
        return { backgroundColor: "#2563eb" }; // blue
      case "sealed":
        return { backgroundColor: "#6b7280" }; // gray
      default:
        return { backgroundColor: "#9ca3af" };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.pageTitle}> Active Auctions</Text>

      {/* Auction List */}
      <FlatList
        data={auctions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Title + Location + Badge */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.location}</Text>
              </View>
              <View style={[styles.badge, getBadgeStyle(item.type)]}>
                <Text style={styles.badgeText}>
                  {item.type === "live"
                    ? "Live Auction"
                    : item.type === "timed"
                    ? "Timed Auction"
                    : "Sealed Bid"}
                </Text>
              </View>
            </View>

            {/* Price & Bids */}
            <View style={styles.rowBetween}>
              <View style={styles.row}>
                <Ionicons name="pricetag" size={18} color="#16a34a" />
                <Text style={styles.priceText}>
                  ₹{item.highestBid.toLocaleString()}
                </Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="people" size={18} color="#16a34a" />
                <Text style={styles.bidsText}>{item.bids} bids</Text>
              </View>
            </View>

            {/* Status & Action */}
            <View style={styles.rowBetween}>
              <View style={styles.row}>
                <Ionicons name="time" size={18} color="#f97316" />
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() =>
                  router.push({
                    pathname: "/AuctionRoom",
                    params: { auctionId: item.id },
                  })
                }
              >
                <Text style={styles.joinButtonText}>Join Auction</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 16 },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#16a34a",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  cardSubtitle: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  priceText: { fontSize: 16, fontWeight: "600", color: "#16a34a" },
  bidsText: { fontSize: 14, color: "#374151", marginLeft: 4 },
  statusText: { fontSize: 14, color: "#f97316", marginLeft: 4 },
  joinButton: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  joinButtonText: { color: "#fff", fontWeight: "600" },
});
