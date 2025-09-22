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
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchLandInterests } from "../api/lands";
import CustomButton from "../components/button";
import TextField from "../components/form/textInput";
import { userStore } from "../stores/userStore";
import axios from "axios";

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
  const [detail, setDetail] = useState(false)
  const [transaction, setTransaction] = useState(false)

  const [deposit, setDeposit] = useState('');
  const [monthlyDue, setMonthlyDue] = useState('');
  const [totalMonths, setTotalMonths] = useState('')

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
    setDetail(true)
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleTransaction = async(landId : string, buyerId : string) => {
    try {
      console.log(deposit, monthlyDue, totalMonths, landId, buyerId)
      if(!userStore.getState().token){
        Alert.alert("Please Login")
        return;
      }

      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const data = {
        landId : landId,
        buyerId : buyerId,
        initialDeposit : deposit,
        monthlyDue : monthlyDue,
        totalMonths : totalMonths,
        initialDepositStatus : "notpaid"
      }

      const res = await axios.post(
          `${apiUrl}/transactions/seller`,
          data,
          {
            headers : {
              Authorization : `Bearer ${userStore.getState().token}`
            }
          } 
      )

      Alert.alert("success", res.data.message)

      setTransaction(false)
      setDeposit('')
      setMonthlyDue('')
      setMonthlyDue('')
      
    } catch (error : any) {
        Alert.alert("OOPS!", error.message)
        console.log(error)
    }
  }
  
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }


  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      {!detail ?
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
        :
    
          <View className="flex justify-center items-center">
            <View style={styles.modalContainer}>
              {selectedUser && (
                <View className="text-lg flex gap-1">
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
                      onPress={() => setDetail(false)}
                    >
                      <Text style={styles.modalBtnText}>Close</Text>
                    </Pressable>
                  </View>

                 

                  {transaction && 
                    <View>
                        <Text className="text-lg font-semibold mt-2">Initial Deposit</Text>
                        <TextField
                          placeholder="Enter initial deposit"
                          keyboardType="numeric"
                          value={deposit}
                          onChangeText={setDeposit}
                        />

                        <Text className="text-lg font-semibold mt-4">Monthly Due</Text>
                        <TextField
                          placeholder="Enter monthly due"
                          keyboardType="numeric"
                          value={monthlyDue}
                          onChangeText={setMonthlyDue}
                        />

                        <Text className="text-lg font-semibold mt-4">Total Months</Text>
                        <TextField
                          placeholder="Total Months"
                          keyboardType="numeric"
                          value={totalMonths}
                          onChangeText={setTotalMonths}
                        />

                        <Text className="text-sm text-gray-600 italic mt-4">
                          *Initial deposit will be returned at the end of the agreement.
                        </Text>
                    </View>
                  }

                  {transaction ? 
                      <View className="w-full flex justify-center items-center my-4">
                        <CustomButton
                          text={"Make a deal"}
                          onPress={() => handleTransaction(selectedUser.landId, selectedUser.user_id)}
                        />
                      </View>
                    :
                    <View className="w-full flex justify-center items-center my-4">
                       <CustomButton
                          text="Proceed"
                          onPress={() => setTransaction(true)}
                        />
                    </View>
                  }
                </View>
              )}
            </View>
          </View>
      }
      {/* </Modal> */}
    </KeyboardAvoidingView>
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
  modalContainer: { width: "100%", backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#1b5e20" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  modalBtn: { padding: 12, borderRadius: 8, flex: 1, marginHorizontal: 5 },
  modalBtnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});

export default LandInterest;
