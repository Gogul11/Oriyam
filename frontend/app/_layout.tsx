import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import '../global.css'

const Layout = () => {
    return (
        <SafeAreaView>
            <Text className='text-red-500'>Hi</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default Layout;
