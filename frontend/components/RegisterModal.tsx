import React from "react";
import { Modal, View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import CustomButton from "./button";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  values: any; // Using `any` for flexibility with Formik values object
}

export const RegisterModalComponent: React.FC<Props> = ({
  showModal,
  setShowModal,
  values,
}) => {
  // Format the key for display (e.g., 'userName' -> 'User Name')
  const formatKey = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Registration Details</Text>
          <Text style={styles.subtitle}>Please review your information before submitting.</Text>
          <ScrollView style={styles.scrollView}>
            {Object.entries(values).map(([key, value]) => {
              // Exclude password fields for security
              if (key === 'password' || key === 'confirmPassword') {
                return null;
              }

              const displayValue = value ? (value instanceof Date ? value.toDateString() : String(value)) : 'Not provided';

              return (
                <View key={key} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{formatKey(key)}:</Text>
                  <Text style={styles.detailValue}>{displayValue}</Text>
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <CustomButton
              text="Close"
              onPress={() => setShowModal(false)}
              ButtonClassName="bg-gray-400 w-full py-3 rounded-lg shadow-md"
              TextClassName="text-white text-center text-lg font-semibold"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#F9FFF9', // Light green
    borderRadius: 15,
    padding: 20,
    // Shadow for a lifted effect
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
      android: { elevation: 10 },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20', // Dark green title
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#388e3c', // Green label
  },
  detailValue: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});