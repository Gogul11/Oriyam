import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface FormButtonProps {
    text : string,
    icon ?: ReactNode,
    onPress ?: () => void,
    ButtonClassName ?: string,
    TextClassName ?: string
}

const FormButton = ({
    text,
    icon,
    onPress,
    ButtonClassName,
    TextClassName
} : FormButtonProps) => {

    return (
        <TouchableOpacity 
            className={ButtonClassName ?? 'w-[90%] h-10 rounded-md flex flex-row justify-center items-center bg-black'}
            onPress={onPress}
        >
            {icon && <View className="mr-2">{icon}</View>}
            <Text 
                className={TextClassName ?? 'text-white text-center'}
            >{text}</Text>
        </TouchableOpacity>
    );
}


export default FormButton;
