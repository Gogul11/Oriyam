import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AuctionRoom() {
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [chatMessages] = useState<any[]>([]);

  // quick bid options
  const quickBids = ['91000', '96000', '101000', '116000'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* ================= 1. Auction Chat Screen ================= */}
      <View style={styles.card}>
        {/* Header row */}
        <Text style={styles.title}>Cotton Fields - Vidarbha Region</Text>
        <Text style={styles.subInfo}>Nagpur, Maharashtra • 20 acres</Text>

        <View style={styles.badgeRow}>
          <Text style={styles.badgeLive}>Live Auction</Text>
          <Text style={styles.badgeEnded}>Auction Ended</Text>
          <Text style={styles.badgeNeutral}>0 participants</Text>
        </View>

        {/* Chat Section */}
        <View style={styles.chatSection}>
          {chatMessages.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={36} color="#66bb6a" />
              <Text style={styles.emptyText}>
                No messages yet. Be the first to start the conversation!
              </Text>
            </View>
          ) : (
            <FlatList
              data={chatMessages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.chatBubble}>
                  <Text>{item.message}</Text>
                </View>
              )}
            />
          )}
        </View>

        {/* Chat Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendBtn}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ================= 2. Place Your Bid Screen ================= */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Ionicons name="cash-outline" size={22} color="#2e7d32" />
          <Text style={[styles.title, { marginLeft: 8 }]}>Place Your Bid</Text>
        </View>

        {/* Current Bid info */}
        <View style={styles.bidInfoRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bidLabel}>Current Highest Bid</Text>
            <Text style={styles.bidValue}>₹90,000/year</Text>
          </View>
          <View>
            <Text style={styles.bidLabel}>Base Price</Text>
            <Text style={styles.bidSmall}>₹90,000</Text>
          </View>
        </View>

        {/* Bid input */}
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Your Bid Amount (Minimum: ₹91,000)"
          value={bidAmount}
          onChangeText={setBidAmount}
        />

        {/* Quick Bid options */}
        <View style={styles.quickBidGrid}>
          {quickBids.map((q, i) => (
            <TouchableOpacity key={i} style={styles.quickBidBtn}>
              <Text style={{ color: '#2e7d32', fontWeight: '600' }}>₹{q}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Optional message box */}
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          maxLength={200}
          placeholder="Optional message (max 200 characters)"
        />

        {/* Place bid button */}
        <TouchableOpacity style={styles.placeBidBtn}>
          <Text style={styles.placeBidText}>Place Bid - ₹0</Text>
        </TouchableOpacity>
      </View>

      {/* ================= 3. Property Details & Auction Info Screen ================= */}
      <View style={styles.card}>
        <Text style={styles.title}>Property Details</Text>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={18} color="#555" />
          <Text style={styles.infoText}>Wardha, Nagpur, Maharashtra</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.infoText}>20 acres</Text>
          <Text style={styles.infoText}>Black Cotton</Text>
        </View>
        <Text style={styles.sectionLabel}>Water Sources</Text>
        <View style={styles.chipRow}>
          <Text style={styles.chip}>Rainwater</Text>
          <Text style={styles.chip}>Borewell</Text>
        </View>
        <Text style={styles.sectionLabel}>Allowed Crops</Text>
        <View style={styles.chipRow}>
          <Text style={styles.chip}>Cotton</Text>
          <Text style={styles.chip}>Soybean</Text>
          <Text style={styles.chip}>Wheat</Text>
          <Text style={styles.chip}>Gram</Text>
        </View>
        <Text style={styles.infoText}>12 months lease</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Auction Info</Text>
        <Text style={styles.infoText}>Auction Type: Sealed Bid</Text>
        <Text style={styles.infoText}>Total Bids: 8</Text>
        <Text style={styles.infoText}>Ends At: January 14th, 2025, 9:30 PM</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Participants (0)</Text>
        <Text style={styles.emptyText}>No participants yet</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f5e9' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32' },
  subInfo: { fontSize: 14, color: '#555', marginVertical: 4 },
  badgeRow: { flexDirection: 'row', marginVertical: 8 },
  badgeLive: {
    backgroundColor: '#c8e6c9',
    color: '#2e7d32',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  badgeEnded: {
    backgroundColor: '#ffcdd2',
    color: '#b71c1c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  badgeNeutral: {
    backgroundColor: '#eeeeee',
    color: '#555',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chatSection: { minHeight: 100, marginTop: 10 },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  emptyText: { color: '#555', marginTop: 8, textAlign: 'center' },
  chatBubble: {
    backgroundColor: '#c8e6c9',
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  inputRow: { flexDirection: 'row', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#a5d6a7',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f1f8f1',
    marginBottom: 10,
  },
  sendBtn: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 8,
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bidInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bidLabel: { fontSize: 14, color: '#555' },
  bidValue: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32' },
  bidSmall: { fontSize: 14, color: '#333' },
  quickBidGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  quickBidBtn: {
    borderWidth: 1,
    borderColor: '#2e7d32',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 8,
    flexBasis: '48%',
    alignItems: 'center',
  },
  placeBidBtn: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    padding: 14,
    marginTop: 10,
  },
  placeBidText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  infoText: { fontSize: 14, color: '#333' },
  sectionLabel: { marginTop: 10, fontWeight: '600', color: '#2e7d32' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 6 },
  chip: {
    backgroundColor: '#c8e6c9',
    color: '#2e7d32',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    fontSize: 13,
  },
});
