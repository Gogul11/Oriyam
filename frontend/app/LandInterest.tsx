import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Modal,
    Pressable,
    Linking,
    KeyboardAvoidingView,
    Alert,
    Platform,
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
    const [showTransactionForm, setShowTransactionForm] = useState(false);

    const [deposit, setDeposit] = useState('');
    const [monthlyDue, setMonthlyDue] = useState('');
    const [totalMonths, setTotalMonths] = useState('');

    useEffect(() => {
        const getInterests = async () => {
            try {
                setLoading(true);
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

    const handleTransaction = async (landId: string, buyerId: string) => {
        try {
            if (!userStore.getState().token) {
                Alert.alert("Please Login");
                return;
            }

            // Simple validation
            if (!deposit || !monthlyDue || !totalMonths) {
                Alert.alert("Error", "All transaction fields are required.");
                return;
            }

            const apiUrl = process.env.EXPO_PUBLIC_API_URL;
            const data = {
                landId: landId,
                buyerId: buyerId,
                initialDeposit: deposit,
                monthlyDue: monthlyDue,
                totalMonths: totalMonths,
                initialDepositStatus: "notpaid"
            };

            const res = await axios.post(
                `${apiUrl}/transactions/seller`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${userStore.getState().token}`
                    }
                }
            );

            Alert.alert("Success", res.data.message);

            setModalVisible(false);
            setShowTransactionForm(false);
            setDeposit('');
            setMonthlyDue('');
            setTotalMonths('');
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || error.message);
            console.log(error);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2e7d32" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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

            {/* Modal for User Details and Transaction Form */}
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
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{selectedUser.username}</Text>
                                    <Text style={styles.modalSubtitle}>User Details</Text>
                                </View>
                                
                                <View style={styles.modalDetails}>
                                    <Text style={styles.modalText}>Email: {selectedUser.email}</Text>
                                    <Text style={styles.modalText}>Mobile: {selectedUser.mobile}</Text>
                                    <Text style={styles.modalText}>Age: {selectedUser.age}</Text>
                                    <Text style={styles.modalText}>Bid: ₹{selectedUser.budgetPerMonth.toLocaleString()}</Text>
                                    {selectedUser.reason && <Text style={styles.modalText}>Reason: {selectedUser.reason}</Text>}
                                </View>

                                {/* Transaction Form Section */}
                                {showTransactionForm && (
                                    <View style={styles.transactionForm}>
                                        <Text style={styles.modalTitle}>Finalize Deal</Text>
                                        <Text style={styles.modalSubtitle}>Enter transaction details</Text>
                                        
                                        <Text style={styles.inputLabel}>Initial Deposit</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter initial deposit"
                                            keyboardType="numeric"
                                            value={deposit}
                                            onChangeText={setDeposit}
                                        />

                                        <Text style={styles.inputLabel}>Monthly Due</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter monthly due"
                                            keyboardType="numeric"
                                            value={monthlyDue}
                                            onChangeText={setMonthlyDue}
                                        />

                                        <Text style={styles.inputLabel}>Total Months</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Total Months"
                                            keyboardType="numeric"
                                            value={totalMonths}
                                            onChangeText={setTotalMonths}
                                        />
                                        
                                        <Text style={styles.transactionNote}>
                                            *Initial deposit will be returned at the end of the agreement.
                                        </Text>
                                    </View>
                                )}

                                {/* Modal Actions */}
                                <View style={styles.modalButtons}>
                                    <Pressable
                                        style={[styles.modalBtn, { backgroundColor: "#2e7d32" }]}
                                        onPress={() => handleCall(selectedUser.mobile)}
                                    >
                                        <Text style={styles.modalBtnText}>Call</Text>
                                    </Pressable>

                                    <Pressable
                                        style={[styles.modalBtn, { backgroundColor: "#4caf50" }]}
                                        onPress={() => {
                                            if (showTransactionForm) {
                                                handleTransaction(selectedUser.landId, selectedUser.user_id);
                                            } else {
                                                setShowTransactionForm(true);
                                            }
                                        }}
                                    >
                                        <Text style={styles.modalBtnText}>
                                            {showTransactionForm ? "Make a deal" : "Proceed"}
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        style={[styles.modalBtn, { backgroundColor: "#aaa" }]}
                                        onPress={() => {
                                            if (showTransactionForm) {
                                                setShowTransactionForm(false);
                                            } else {
                                                setModalVisible(false);
                                            }
                                        }}
                                    >
                                        <Text style={styles.modalBtnText}>
                                            {showTransactionForm ? "Back" : "Close"}
                                        </Text>
                                    </Pressable>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#e8f5e9",
        flexGrow: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e8f5e9",
    },
    header: {
        backgroundColor: "#2e7d32",
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
            android: { elevation: 5 },
        }),
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    subtitle: {
        fontSize: 16,
        color: "#c8e6c9",
        marginTop: 4,
    },
    empty: {
        textAlign: "center",
        fontSize: 16,
        color: "#555",
        marginTop: 30,
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#c8e6c9",
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
            android: { elevation: 3 },
        }),
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1b5e20",
    },
    bid: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 4,
        color: "#2e7d32",
    },
    message: {
        fontStyle: "italic",
        marginTop: 6,
        color: "#555",
    },
    backBtn: {
        backgroundColor: "#2e7d32",
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
            android: { elevation: 5 },
        }),
    },
    backBtnText: {
        color: "#fff",
        fontWeight: "700",
        textAlign: "center",
    },
    // Modal styles
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
            android: { elevation: 10 },
        }),
    },
    modalHeader: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1b5e20",
    },
    modalSubtitle: {
        fontSize: 16,
        color: "#616161",
        marginTop: 4,
    },
    modalDetails: {
        marginBottom: 20,
    },
    modalText: {
        fontSize: 16,
        color: "#424242",
        marginBottom: 5,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    modalBtn: {
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
            android: { elevation: 5 },
        }),
    },
    modalBtnText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
    // Transaction form styles
    transactionForm: {
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 5,
        color: '#1b5e20',
    },
    input: {
        height: 40,
        borderColor: '#c8e6c9',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#f1f8e9',
        color: '#333',
    },
    transactionNote: {
        fontSize: 12,
        color: '#757575',
        fontStyle: 'italic',
        marginTop: 8,
    },
});

export default LandInterest;