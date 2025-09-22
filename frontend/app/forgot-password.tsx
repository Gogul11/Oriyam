import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import TextField from "../components/form/textInput";
import Label from "../components/form/label";
import CustomButton from "../components/button";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Added for visual aids
import {
    forgotPasswordInitialValues,
    forgotPasswordValidation,
    otpInitialValues,
    otpValidation,
    resetPasswordInitialValues,
    resetPasswordValidation,
} from "../utils/forgotPasswordUtils";
import {
    requestEmailOTP,
    verifyEmailOTP,
    resetPasswordWithEmail,
} from "../api/forgotPassword";

// --- Theme Colors ---
const PRIMARY_GREEN = '#1B5E20';
const LIGHT_BACKGROUND = '#F0FFF0';
const ACCENT_BLUE = '#3B82F6';

const ForgotPassword = () => {
    const [step, setStep] = useState<"request" | "verify" | "reset">("request");
    const [email, setEmail] = useState("");

    const handleRequestOTP = async (values: any) => {
        try {
            await requestEmailOTP(values.email);
            setEmail(values.email);
            Alert.alert("OTP Sent", `A verification code has been sent to ${values.email}.`);
            setStep("verify");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to send OTP.");
        }
    };

    const handleVerifyOTP = async (values: any) => {
        try {
            await verifyEmailOTP(values.email, values.otp);
            Alert.alert("Verified", "OTP verified successfully. You can now reset your password.");
            setStep("reset");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Invalid OTP.");
        }
    };

    const handleResetPassword = async (values: any) => {
        try {
            await resetPasswordWithEmail(email, values.newPassword);
            Alert.alert("Success", "Password reset successful. Please login again.");
            router.replace("/login");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to reset password.");
        }
    };

    const renderHeader = (currentTitle: string, currentStep: number) => (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{currentTitle}</Text>
            <Text style={styles.headerSubtitle}>Step {currentStep} of 3</Text>
            
            <TouchableOpacity style={styles.loginLink} onPress={() => router.replace("/login")}>
                <Ionicons name="arrow-back-outline" size={16} color={ACCENT_BLUE} />
                <Text style={styles.loginLinkText}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardContainer}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.formCard}>
                    
                    {/* --- STEP 1: REQUEST OTP --- */}
                    {step === "request" && (
                        <Formik
                            initialValues={forgotPasswordInitialValues}
                            validationSchema={forgotPasswordValidation}
                            onSubmit={handleRequestOTP}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                                <View style={styles.stepBody}>
                                    {renderHeader("Reset via Email", 1)}
                                    <Text style={styles.stepDescription}>
                                        Enter your registered email address to receive a verification code.
                                    </Text>
                                    <View style={styles.inputGroup}>
                                        <Label text="Email" required />
                                        <TextField
                                            value={values.email}
                                            onChangeText={handleChange("email")}
                                            placeholder="Enter email address"
                                            onBlur={handleBlur("email")}
                                            keyboardType="email-address"
                                        />
                                        {errors.email && (
                                            <Text style={styles.errorText}>{errors.email}</Text>
                                        )}
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        <CustomButton text="     Send OTP" onPress={handleSubmit} 
                                            ButtonClassName="bg-green-600 w-full py-3 rounded-xl shadow-lg"
                                            TextClassName="text-white text-lg font-bold"
                                        />
                                    </View>
                                </View>
                            )}
                        </Formik>
                    )}

                    {/* --- STEP 2: VERIFY OTP --- */}
                    {step === "verify" && (
                        <Formik
                            initialValues={{ ...otpInitialValues, email }}
                            validationSchema={otpValidation}
                            onSubmit={handleVerifyOTP}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                                <View style={styles.stepBody}>
                                    {renderHeader("Verify Code", 2)}
                                    <Text style={styles.stepDescription}>
                                        A 6-digit code was sent to <Text style={{fontWeight: 'bold', color: PRIMARY_GREEN}}>{email}</Text>.
                                    </Text>
                                    <View style={styles.inputGroup}>
                                        <Label text="OTP" required />
                                        <TextField
                                            value={values.otp}
                                            onChangeText={handleChange("otp")}
                                            placeholder="Enter 6-digit OTP"
                                            onBlur={handleBlur("otp")}
                                            keyboardType="number-pad"
                                            maxLength={6}
                                        />
                                        {errors.otp && (
                                            <Text style={styles.errorText}>{errors.otp}</Text>
                                        )}
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        <CustomButton text="Verify" onPress={handleSubmit} 
                                            ButtonClassName="bg-green-600 w-full py-3 rounded-xl shadow-lg"
                                            TextClassName="text-white text-lg font-bold"
                                        />
                                    </View>
                                </View>
                            )}
                        </Formik>
                    )}

                    {/* --- STEP 3: RESET PASSWORD --- */}
                    {step === "reset" && (
                        <Formik
                            initialValues={{ ...resetPasswordInitialValues, email }}
                            validationSchema={resetPasswordValidation}
                            onSubmit={handleResetPassword}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                                <View style={styles.stepBody}>
                                    {renderHeader("Set New Password", 3)}
                                    <Text style={styles.stepDescription}>
                                        Create a strong new password for your account.
                                    </Text>
                                    <View style={styles.inputGroup}>
                                        <Label text="New Password" required />
                                        <TextField
                                            value={values.newPassword}
                                            onChangeText={handleChange("newPassword")}
                                            placeholder="Enter new password"
                                            onBlur={handleBlur("newPassword")}
                                            secureTextEntry
                                        />
                                        {errors.newPassword && (
                                            <Text style={styles.errorText}>{errors.newPassword}</Text>
                                        )}
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Label text="Confirm Password" required />
                                        <TextField
                                            value={values.confirmPassword}
                                            onChangeText={handleChange("confirmPassword")}
                                            placeholder="Confirm new password"
                                            onBlur={handleBlur("confirmPassword")}
                                            secureTextEntry
                                        />
                                        {errors.confirmPassword && (
                                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                                        )}
                                    </View>

                                    <View style={styles.buttonContainer}>
                                        <CustomButton text="Reset Password" onPress={handleSubmit} 
                                            ButtonClassName="bg-green-600 w-full py-3 rounded-xl shadow-lg"
                                            TextClassName="text-white text-lg font-bold"
                                        />
                                    </View>
                                </View>
                            )}
                        </Formik>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
        backgroundColor: LIGHT_BACKGROUND,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    formCard: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 25,
        // Card Shadow
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 10 },
            android: { elevation: 10 },
        }),
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 15,
        width: '100%',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: PRIMARY_GREEN,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#6B7280',
        marginTop: 4,
    },
    loginLink: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    loginLinkText: {
        color: ACCENT_BLUE,
        textDecorationLine: 'underline',
        fontSize: 14,
        marginLeft: 5,
        fontWeight: '600',
    },
    stepBody: {
        gap: 20,
        width: '100%',
    },
    stepDescription: {
        fontSize: 15,
        color: '#4B5563',
        textAlign: 'center',
        marginBottom: 10,
    },
    inputGroup: {
        gap: 8,
    },
    errorText: {
        color: '#EF4444', // Red
        fontSize: 12,
        marginTop: 4,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
});

export default ForgotPassword;