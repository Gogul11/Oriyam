import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import TextField from '../../components/form/textInput';
import Label from '../../components/form/label';
import CustomButton from '../../components/button';
import { router } from 'expo-router';
import { loginFormInitialValues, loginFormValidation } from '../../utils/loginPageUtils';
import { loginUser } from '../../api/auth';
import { userStore } from '../../stores/userStore';


const handleLogin = async (values: any) => {
  try {
    console.log("Login Values:", values);

    const data = await loginUser(values.mobile, values.password);

    userStore.getState().setToken(data.token);

    router.push('/search');

  } catch (error: any) {
    Alert.alert("Login Failed", error.message || "An unknown error occurred.");
  }
};


const Login = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Welcome Back to Oriyam</Text>
          <Text style={styles.headerSubtitle}>Please log in to continue your journey.</Text>
        </View>

        <View style={styles.formCard}>
          <Formik
            initialValues={loginFormInitialValues}
            validationSchema={loginFormValidation}
            onSubmit={handleLogin}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
            }) => (
              <View style={styles.formBody}>
                { }
                <View style={styles.inputGroup}>
                  <Label text="Mobile Number" required />
                  <TextField
                    value={values.mobile}
                    onChangeText={handleChange('mobile')}
                    placeholder="Enter mobile number"
                    onBlur={handleBlur('mobile')}
                    keyboardType="phone-pad"
                  />
                  {errors.mobile && (
                    <Text style={styles.errorText}>{errors.mobile}</Text>
                  )}
                </View>

                { }
                <View style={styles.inputGroup}>
                  <Label text="Password" required />
                  <TextField
                    value={values.password}
                    onChangeText={handleChange('password')}
                    placeholder="Enter password"
                    onBlur={handleBlur('password')}
                    secureTextEntry={true}
                    autoCapitalize="none"
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                { }
                <View style={styles.loginButtonContainer}>
                  <CustomButton
                    text="Secure Login"
                    onPress={handleSubmit}
                    ButtonClassName="bg-green-700 w-full py-3 rounded-xl shadow-lg"
                    TextClassName="text-white text-center text-lg font-bold"
                  />
                </View>

                { }
                <TouchableOpacity
                  style={styles.linkContainer}
                  onPress={() => router.push("/forgot-password")}
                >
                  <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>

                { }
                <View style={styles.registerContainer}>
                  <Text style={styles.textGray}>Don't have an account?</Text>
                  <TouchableOpacity
                    onPress={() => router.push("/register")}
                  >
                    <Text style={styles.registerLink}>Create Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#F0FFF0',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#4B5563',
  },
  formCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,

    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
      android: { elevation: 10 },
    }),
  },
  formBody: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  loginButtonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  linkContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
    marginRight: 4,
  },
  linkText: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  registerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  textGray: {
    color: '#6B7280',
    fontSize: 15,
  },
  registerLink: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default Login;