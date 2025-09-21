import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

interface InterestFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { budgetPerMonth: string; rentPeriod: string; reason: string}) => void;
}

const InterestForm: React.FC<InterestFormProps> = ({ visible, onClose, onSubmit }) => {
  const [budgetPerMonth, setBudget] = useState("");
  const [rentPeriod, setRentPeriod] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onSubmit({ budgetPerMonth , rentPeriod, reason});
    setBudget("");
    setRentPeriod("");
    setReason("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-md p-6 w-11/12 shadow-lg">
          <Text className="text-lg font-semibold mb-4 text-center">Interest Form</Text>

          {/* Budget Input */}
          <Text className="text-gray-700 mb-1">Budget per month</Text>
          <TextInput
            className="border border-gray-300 rounded px-3 py-2 mb-3"
            placeholder="Enter your budgetPerMonth"
            value={budgetPerMonth}
            onChangeText={setBudget}
            keyboardType="numeric"
          />

          {/* Rent Period Input */}
          <Text className="text-gray-700 mb-1">Rent period</Text>
          <TextInput
            className="border border-gray-300 rounded px-3 py-2 mb-3"
            placeholder="e.g., 6 months"
            value={rentPeriod}
            onChangeText={setRentPeriod}
            keyboardType="numeric"
          />

          {/* Reason Input */}
          <Text className="text-gray-700 mb-1">Reason</Text>
          <TextInput
            className="border border-gray-300 rounded px-3 py-2 mb-4"
            placeholder="Why are you interested?"
            value={reason}
            onChangeText={setReason}
          />

          {/* Buttons */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-300 px-4 py-2 rounded-md"
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-green-700 px-4 py-2 rounded-md"
            >
              <Text className="text-white">Give</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default InterestForm;
