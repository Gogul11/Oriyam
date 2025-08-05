import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const Index = () => {

    const router = useRouter()

    return (
        <View>
            <Text>Landing page</Text>
            <Button 
                onPress={() => router.replace("(auth)/register")}
                title='Sign up' />
            <Button 
                onPress={() => router.replace("(tabs)/search")}
                title='Tabs' />
        </View>
    );
}


export default Index;
