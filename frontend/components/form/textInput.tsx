import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

interface TextFieldProps extends TextInputProps {
  value: string;
  placeholder: string;
  className?: string;
  onChangeText?: (text: string) => void;
}

const TextField = ({ 
    value, 
    placeholder, 
    className, 
    onChangeText ,
    ...rest
}: TextFieldProps) => {

  return (
    <TextInput
        value={value}
        placeholder={placeholder}
        className={className ?? 'border border-gray-400 rounded-md h-12 pl-4 py-2 bg-black/10'}
        onChangeText={(value : string) => onChangeText?.(value)}
        {...rest}
    />
  );
};

export default TextField;
