import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import '../global.css';
import { StatusBar } from 'react-native';

const Layout = () => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="default"/>
      <Slot />
    </SafeAreaView>
  );
};

export default Layout;
