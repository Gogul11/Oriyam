import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import CustomButton from '../components/button'; // adjust path if needed

const Index = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Text className="text-3xl font-extrabold text-black mb-4 text-center">
        Oriyam
      </Text>

      <Text className="text-lg text-gray-600 text-center mb-8">
        A secure land lease & registry system powered by trust & technology.
      </Text>

      {/* Register Button */}
      <CustomButton
        text="Register"
        onPress={() => router.push("(auth)/register")}
        ButtonClassName="bg-green-600 w-full py-3 rounded-2xl mb-4"
        TextClassName="text-white text-center text-lg font-semibold"
      />

      {/* Login Button */}
      <CustomButton
        text="Login"
        onPress={() => router.push("(auth)/login")}
        ButtonClassName="border border-green-600 w-full py-3 rounded-2xl"
        TextClassName="text-green-700 text-center text-lg font-semibold"
      />

      <CustomButton
        text="View lands"
        onPress={() => router.push("(tabs)/search")}
        ButtonClassName="border border-green-600 w-full py-3 my-4 rounded-2xl"
        TextClassName="text-green-700 text-center text-lg font-semibold"
      />
    </View>
  );
};

export default Index;
