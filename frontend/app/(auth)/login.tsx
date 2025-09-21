import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '../../components/form/textInput';
import Label from '../../components/form/label';
import CustomButton from '../../components/button';
import { router } from 'expo-router';
import { loginFormInitialValues, loginFormValidation } from '../../utils/loginPageUtils';
import { loginUser } from '../../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userStore } from '../../stores/userStore';


const handleLogin = async (values: any) => {
    try {
      console.log("Login Values:", values);

      const data = await loginUser(values.mobile, values.password);

      // await AsyncStorage.setItem('authToken', data.token);
      userStore.getState().setToken(data.token)

      router.push('/search');

    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
};
  
const Login = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerClassName="flex py-10">
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
            <View className="flex-1 justify-center items-center gap-4 p-2">
              <View className="items-center mb-6">
                <Text className="text-2xl font-bold text-gray-900">Login</Text>
                <Text className="text-md text-gray-500 mt-1">Welcome back!</Text>
              </View>

              <View className="w-[90%] justify-center gap-2">
                <Label text="Mobile Number" required />
                <TextField
                  value={values.mobile}
                  onChangeText={handleChange('mobile')}
                  placeholder="Enter mobile number"
                  onBlur={handleBlur('mobile')}
                  keyboardType="phone-pad"
                />
                {errors.mobile && (
                  <Text className="text-red-500">{errors.mobile}</Text>
                )}
              </View>

              <View className="w-[90%] justify-center gap-2">
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
                  <Text className="text-red-500">{errors.password}</Text>
                )}
              </View>

              <View className="w-full items-center">
                <CustomButton text="Login" onPress={handleSubmit} />
              </View>

              <View className="items-center mt-2">
                <Text
                  className="text-md text-blue-600 underline"
                  onPress={() => router.push("/forgot-password")}
                >
                  Forgot Password?
                </Text>
              </View>

              <View className="items-center mt-4">
                <Text className="text-md text-gray-500">Don't have an account?</Text>
                <Text
                  className="text-md text-blue-600 underline mt-1"
                  onPress={() => router.push("/register")}
                >
                  Register
                </Text>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
