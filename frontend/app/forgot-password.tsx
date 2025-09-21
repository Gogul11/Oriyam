import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Formik } from "formik";
import TextField from "../components/form/textInput";
import Label from "../components/form/label";
import CustomButton from "../components/button";
import { router } from "expo-router";
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

const ForgotPassword = () => {
  const [step, setStep] = useState<"request" | "verify" | "reset">("request");
  const [email, setEmail] = useState("");

  const handleRequestOTP = async (values: any) => {
    try {
      await requestEmailOTP(values.email);
      setEmail(values.email);
      setStep("verify");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleVerifyOTP = async (values: any) => {
    try {
      await verifyEmailOTP(values.email, values.otp);
      setStep("reset");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleResetPassword = async (values: any) => {
    try {
      await resetPasswordWithEmail(values.email, values.newPassword);
      Alert.alert("Success", "Password reset successful. Please login again.");
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerClassName="flex py-10">
        {step === "request" && (
          <Formik
            initialValues={forgotPasswordInitialValues}
            validationSchema={forgotPasswordValidation}
            onSubmit={handleRequestOTP}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View className="flex-1 justify-center items-center gap-4 p-2">
                <Text className="text-2xl font-bold">Forgot Password</Text>

                <View className="w-[90%] gap-2">
                  <Label text="Email" required />
                  <TextField
                    value={values.email}
                    onChangeText={handleChange("email")}
                    placeholder="Enter email"
                    onBlur={handleBlur("email")}
                    keyboardType="email-address"
                  />
                  {errors.email && (
                    <Text className="text-red-500">{errors.email}</Text>
                  )}
                </View>

                <CustomButton text="Send OTP" onPress={handleSubmit} />
              </View>
            )}
          </Formik>
        )}

        {step === "verify" && (
          <Formik
            initialValues={{ ...otpInitialValues, email }}
            validationSchema={otpValidation}
            onSubmit={handleVerifyOTP}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View className="flex-1 justify-center items-center gap-4 p-2">
                <Text className="text-2xl font-bold">Verify OTP</Text>

                <View className="w-[90%] gap-2">
                  <Label text="OTP" required />
                  <TextField
                    value={values.otp}
                    onChangeText={handleChange("otp")}
                    placeholder="Enter OTP"
                    onBlur={handleBlur("otp")}
                    keyboardType="number-pad"
                  />
                  {errors.otp && (
                    <Text className="text-red-500">{errors.otp}</Text>
                  )}
                </View>

                <CustomButton text="Verify" onPress={handleSubmit} />
              </View>
            )}
          </Formik>
        )}

        {step === "reset" && (
          <Formik
            initialValues={{ ...resetPasswordInitialValues, email }}
            validationSchema={resetPasswordValidation}
            onSubmit={handleResetPassword}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View className="flex-1 justify-center items-center gap-4 p-2">
                <Text className="text-2xl font-bold">Reset Password</Text>

                <View className="w-[90%] gap-2">
                  <Label text="New Password" required />
                  <TextField
                    value={values.newPassword}
                    onChangeText={handleChange("newPassword")}
                    placeholder="Enter new password"
                    onBlur={handleBlur("newPassword")}
                    secureTextEntry
                  />
                  {errors.newPassword && (
                    <Text className="text-red-500">{errors.newPassword}</Text>
                  )}
                </View>

                <CustomButton text="Reset Password" onPress={handleSubmit} />
              </View>
            )}
          </Formik>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
