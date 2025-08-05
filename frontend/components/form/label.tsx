import React from 'react';
import { Text, View } from 'react-native';

interface LabelProps {
  text: string;
  required?: boolean;
  className?: string;
}

const Label = ({ text, required = false, className }: LabelProps) => {
  return (
      <Text className={className ?? "text-lg text-black"}>
        {text}  {required && <Text className="text-red-500">*</Text>}
      </Text>
  );
};

export default Label;
