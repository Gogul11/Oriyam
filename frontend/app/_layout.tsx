import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import '../global.css';

const Layout = () => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Slot />
    </SafeAreaView>
  );
};

export default Layout;
