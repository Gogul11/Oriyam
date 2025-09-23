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
import { Ionicons } from '@expo/vector-icons'; // Added for icons

// --- Theme and Utility Styles ---
const PRIMARY_GREEN = '#1B5E20';
const ACCENT_GREEN = '#388e3c';
const LIGHT_BACKGROUND = '#F0FFF0';
const ACCENT_BLUE = '#3B82F6';

// --- Interface Definitions (Preserved) ---
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
                setInterests(Array.isArray(interestsData) ? interestsData : []);

                const transData = await fetchUserTransactions(token);

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
    
    const handleLogout = () => {
        userStore.getState().logout();
        router.replace('/'); 
    };

    if (loading)
        return <ActivityIndicator size="large" color="#2e7d32" style={{ flex: 1 }} />;
    if (!profile) return <Text style={styles.error}>No profile found</Text>;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>{profile.username}'s Profile</Text>
            </View>

            {/* Personal Information Section */}
            <View style={styles.section}>
                <Text style={styles.sectionHeading}>Personal Information</Text>

                {editing ? (
                    <>
                        {[
    { label: "Username", field: "username", keyboard: "default" },
    { label: "Email", field: "email", keyboard: "email-address" },
    { label: "Mobile", field: "mobile", keyboard: "phone-pad" },
    // Replaced 'age' with 'dateofbirth'
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

                        <View style={styles.linkRow}>
                            <Text
                                style={styles.forgotPasswordLink}
                                onPress={() => router.push("/forgot-password")}
                            >
                                Forgot Password?
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveBtnText}>Save Changes</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {[
                            { label: "Email", value: profile.email, icon: "mail-outline" },
                            { label: "Mobile", value: profile.mobile, icon: "call-outline" },
                            { label: "Age", value: profile.age.toString(), icon: "happy-outline" },
                            { label: "DOB", value: new Date(profile.dateofbirth).toDateString(), icon: "calendar-outline" },
                            { label: "Gov ID Type", value: profile.gov_id_type, icon: "document-text-outline" },
                            {
                                label: "Gov ID Number",
                                value: profile.goverment_id ? `****${profile.goverment_id.slice(-4)}` : "N/A",
                                icon: "id-card-outline"
                            },
                        ].map(({ label, value, icon }) => (
                            <View style={styles.infoRow} key={label}>
                                <Ionicons name={icon as any} size={18} color={ACCENT_GREEN} style={{ marginRight: 8 }} />
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
                style={styles.collapsibleSectionHeader}
                onPress={() => setShowLands(!showLands)}
            >
                <Text style={styles.sectionHeading}>
                    Owned Lands ({profile.lands?.length || 0})
                </Text>
                <Ionicons name={showLands ? "chevron-up" : "chevron-down"} size={18} color={ACCENT_GREEN} />
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
                                <View style={styles.statusRow}>
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
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyStateText}>No lands currently listed.</Text>
                ))}

            {/* Interests Shown by User */}
            <TouchableOpacity
                style={styles.collapsibleSectionHeader}
                onPress={() => setShowInterests(!showInterests)}
            >
                <Text style={styles.sectionHeading}>Interests ({interests.length})</Text>
                <Ionicons name={showInterests ? "chevron-up" : "chevron-down"} size={18} color={ACCENT_GREEN} />
            </TouchableOpacity>

            {showInterests && interests.length > 0 ? (
                interests.map((interest) => (
                    <View key={interest.interestId} style={{ marginBottom: 10 }}>
                        <TouchableOpacity
                            style={styles.card}
                        >
                            <Text style={styles.landTitle}>{interest.landTitle}</Text>
                            <Text style={styles.infoText}>Budget: ₹{interest.budgetPerMonth.toLocaleString('en-IN')}</Text>
                            <Text style={styles.infoText}>Rent Period: {interest.rentPeriod}</Text>
                            <Text style={styles.infoText}>Status: {interest.landStatus ? "Active" : "Inactive"}</Text>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                showInterests && <Text style={styles.emptyStateText}>No interests found</Text>
            )}

            {/* Transactions Shown by User */}
            <TouchableOpacity
                style={styles.collapsibleSectionHeader}
                onPress={() => setShowTrans(!showTrans)}
            >
                <Text style={styles.sectionHeading}>Transactions ({trans.length})</Text>
                <Ionicons name={showTrans ? "chevron-up" : "chevron-down"} size={18} color={ACCENT_GREEN} />
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
                            <Text style={styles.infoText}>Initial Deposit: ₹{t.initialDeposit}</Text>
                            <Text style={styles.infoText}>Deposit Status: {t.initialDepositStatus}</Text>
                            <Text style={styles.infoText}>Monthly Due: ₹{t.monthlyDue}</Text>
                            <Text style={styles.infoText}>Total Months: {t.totalMonths}</Text>
                            <Text style={styles.infoText}>Buyer Approved: {t.buyerApproved ? "✅" : "❌"}</Text>
                            <Text style={styles.infoText}>Seller Approved: {t.sellerApproved ? "✅" : "❌"}</Text>
                            <Text style={styles.infoText}>Date: {new Date(t.transactionDate).toDateString()}</Text>
                        </TouchableOpacity>

                        {!t.buyerApproved && (
                            <TouchableOpacity
                                style={styles.payAdvanceBtn}
                                onPress={() => {
                                    console.log("Pay advance for transaction:", t.transactionId);
                                }}
                            >
                                <Text style={styles.payAdvanceBtnText}>Pay Advance</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))
            ) : (
                showTrans && <Text style={styles.emptyStateText}>No Transactions found</Text>
            )}

            {/* Logout Button (if needed, uncomment below) */}
            {/* <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity> */}


            {/* Modal for Land Details (remains unchanged) */}
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
                                        <Text style={styles.modalSectionTitle}>Location</Text>
                                        <Text style={styles.modalRow}>
                                            Village: {selectedLand.village}
                                        </Text>
                                        <Text style={styles.modalRow}>
                                            SubDistrict: {selectedLand.subDistrict}
                                        </Text>
                                        <Text style={styles.modalRow}>
                                            District: {selectedLand.district}
                                        </Text>
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

                                    <View style={styles.mapModalWrapper}>
                                        <MapView
                                            ref={mapRef}
                                            style={{ flex: 1 }}
                                            initialRegion={{
                                                latitude: selectedLand.coordinates[0]?.latitude || 0,
                                                longitude: selectedLand.coordinates[0]?.longitude || 0,
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
                                                coordinate={selectedLand.coordinates[0]}
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
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
        backgroundColor: LIGHT_BACKGROUND,
    },
    header: {
        backgroundColor: PRIMARY_GREEN,
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        opacity: 0.9,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
            android: { elevation: 6 },
        })
    },
    heading: {
        fontSize: 24,
        color: "#fff",
        textAlign: "center",
        fontWeight: 'bold',
    },
    // --- Card/Section Styles ---
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
    collapsibleSectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 10,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#a5d6a7",
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
            android: { elevation: 3 },
        }),
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: "700",
        color: PRIMARY_GREEN,
    },
    card: {
        backgroundColor: "#fff",
        padding: 14,
        marginBottom: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#e8f5e9", // Lighter border for inner cards
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 1 },
            android: { elevation: 1 },
        })
    },
    // --- Information Display Styles ---
    infoRow: {
        flexDirection: "row",
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: { // General text style for interest/transaction details
        fontSize: 15,
        color: '#4B5563',
        marginBottom: 4,
    },
    label: {
        fontWeight: "600",
        width: 100,
        color: ACCENT_GREEN,
        fontSize: 15,
    },
    value: {
        fontSize: 15,
        color: "#333",
        flex: 1,
    },
    // --- Input and Editing Styles ---
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    inputLabel: {
        width: 120,
        fontWeight: "600",
        color: ACCENT_GREEN,
        fontSize: 15,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#c8e6c9", // Lighter border
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#F3F4F6', // Light background color
        color: '#1b5e20',
    },
    editBtn: {
        backgroundColor: ACCENT_GREEN,
        padding: 12,
        borderRadius: 8,
        marginTop: 15,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
            android: { elevation: 5 },
        })
    },
    editBtnText: {
        color: "#fff",
        fontWeight: "700",
        textAlign: "center"
    },
    saveBtn: {
        backgroundColor: PRIMARY_GREEN,
        padding: 12,
        borderRadius: 8,
        marginTop: 15,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
            android: { elevation: 5 },
        })
    },
    saveBtnText: {
        color: "#fff",
        fontWeight: "700",
        textAlign: "center"
    },
    linkRow: {
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    forgotPasswordLink: {
        color: ACCENT_BLUE,
        textDecorationLine: 'underline',
        fontSize: 14,
    },
    // --- Land Card Details ---
    landTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
        color: PRIMARY_GREEN
    },
    landDescription: {
        fontSize: 14,
        marginBottom: 6,
        color: "#555"
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    status: {
        marginTop: 0,
        fontWeight: "700",
        fontSize: 14,
    },
    available: {
        color: ACCENT_GREEN,
        backgroundColor: "#e8f5e9",
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    notAvailable: {
        color: "#c62828",
        backgroundColor: "#ffcdd2",
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    interestBtn: {
        backgroundColor: ACCENT_GREEN,
        padding: 8,
        borderRadius: 6,
    },
    interestBtnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },
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
    // --- Modal Styles (Matching other modals) ---
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
    modalContainer: { width: "90%", maxHeight: "85%", backgroundColor: "#f9fff9", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#c8e6c9" },
    modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center", color: PRIMARY_GREEN },
    modalSection: { marginBottom: 10 },
    modalSectionTitle: { fontSize: 16, fontWeight: "700", color: PRIMARY_GREEN, marginBottom: 4 },
    modalRow: { fontSize: 14, color: "#333", marginBottom: 4 },
    modalValue: { fontSize: 14, color: "#555", marginBottom: 4 },
    mapModalWrapper: { height: 300, marginVertical: 10, borderRadius: 10, overflow: "hidden" },
    photoContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
    photo: { width: 90, height: 90, margin: 5, borderRadius: 8, borderWidth: 1, borderColor: "#a5d6a7" },
    closeBtn: { backgroundColor: PRIMARY_GREEN, padding: 12, borderRadius: 8, marginTop: 16 },
    closeBtnText: { color: "#fff", fontWeight: "700", textAlign: "center", fontSize: 15 },
    error: { textAlign: "center", marginTop: 40, fontSize: 16, color: "red" },
});

export default ProfileScreen;