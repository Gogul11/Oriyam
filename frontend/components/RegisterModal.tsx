import React from "react";
import { Modal, View, Text, Button } from "react-native";
import CustomButton from "./button";
import { ScrollView } from "react-native";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  values: object;
}

export const RegisterModalComponent: React.FC<Props> = ({
  showModal,
  setShowModal,
  values,
}) => {
  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
        <View
            className="flex-1 w-full justify-center items-center bg-black/70"
        >
                <View className="bg-gray-200 w-[90%] max-h-[90%] flex justify-center gap-10 items-center rounded-md py-4">
                    <Text className="text-2xl font-bold">
                        Registration Details
                    </Text>
                    <ScrollView>
                        {Object.entries(values).map(([key, value]) => (
                            <View key={key} className="mb-2 w-full">
                                <Text className="font-semibold">{key.toUpperCase()}:</Text>
                                <Text className="my-2 pl-4">{String(value)}</Text>
                                <View className="border border-b-0 my-1"></View>
                            </View>
                        ))}
                    </ScrollView>

                    <CustomButton text="Close" onPress={() => setShowModal(false)} />
                </View>
        </View>
    </Modal>
  );
};
