import { useRouter } from 'expo-router';
import React, { useRef, useEffect } from 'react';
import { Text, View, StyleSheet, Animated, Easing, Dimensions, Platform } from 'react-native';
import CustomButton from '../components/button';
import { Ionicons } from '@expo/vector-icons';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const PRIMARY_GREEN = '#1B5E20'; // Dark Green
const LIGHT_GREEN = '#C8E6C9'; // Light Green

// --- 1. Falling Leaf Component (Simplified Animation) ---
// This component simulates a falling, spinning leaf for the background.
const FallingLeaf = ({ duration, delay, startX }: { duration: number, delay: number, startX: number }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnimation = () => {
      animatedValue.setValue(-50); // Start slightly above the screen
      Animated.timing(animatedValue, {
        toValue: screenHeight + 50, // Fall past the bottom
        duration: duration,
        delay: delay,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => loopAnimation());
    };

    loopAnimation();
  }, [duration, delay]);

  // Interpolate for spinning effect during the fall
  const spin = animatedValue.interpolate({
    inputRange: [0, screenHeight],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.leaf,
        {
          left: startX,
          transform: [
            { translateY: animatedValue },
            { rotate: spin },
          ],
          opacity: 0.8,
        },
      ]}
    >
      <Ionicons name="leaf-outline" size={24} color={LIGHT_GREEN} />
    </Animated.View>
  );
};

const Index = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background Animated Leaves Layer (Simulated Animation) */}
      <View style={styles.animationLayer}>
        <FallingLeaf duration={8000} delay={0} startX={screenWidth * 0.1} />
        <FallingLeaf duration={6500} delay={2000} startX={screenWidth * 0.5} />
        <FallingLeaf duration={9000} delay={4000} startX={screenWidth * 0.8} />
        <FallingLeaf duration={7200} delay={1000} startX={screenWidth * 0.25} />
        <FallingLeaf duration={8500} delay={3000} startX={screenWidth * 0.6} />
      </View>

      <View style={styles.content}>
        {/* App Logo/Icon */}
        <View style={styles.logoContainer}>
          <Ionicons name="location-outline" size={60} color={PRIMARY_GREEN} />
        </View>

        <Text style={styles.mainTitle}>
          Oriyam
        </Text>

        <Text style={styles.tagline}>
          A secure land lease & registry system powered by trust & technology.
        </Text>

        {/* Register Button (Primary Action) */}
        <CustomButton
          text="Register"
          onPress={() => router.push("(auth)/register")}
          // Using Tailwind classes within the style object for CustomButton props
          ButtonClassName="bg-green-700 w-full py-4 rounded-xl mb-4 shadow-lg"
          TextClassName="text-white text-center text-xl font-bold"
        />

        {/* Login Button (Secondary Action) */}
        <CustomButton
          text="Login"
          onPress={() => router.push("(auth)/login")}
          ButtonClassName="border border-green-700 w-full py-4 rounded-xl mb-4"
          TextClassName="text-green-700 text-center text-xl font-bold"
        />

        {/* View Lands Button (Tertiary/Browse) */}
        <CustomButton
          text="View Lands"
          onPress={() => router.push("(tabs)/search")}
          ButtonClassName="border border-green-700 w-full py-4 my-4 rounded-xl"
          TextClassName="text-green-700 text-center text-xl font-bold"
        />
      </View>
    </View>
  );
};

// --- Stylesheet ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FFF0', // Very light mint green background
  },
  animationLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  leaf: {
    position: 'absolute',
    top: -50,
    zIndex: 0,
  },
  content: {
    flex: 1,
    zIndex: 1, // Ensure content is above the animation
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 75,
    backgroundColor: LIGHT_GREEN,
    borderWidth: 3,
    borderColor: PRIMARY_GREEN,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
      android: { elevation: 8 }, // Android shadow
    }),
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: '900', 
    color: PRIMARY_GREEN,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tagline: {
    fontSize: 18,
    color: '#4B5563', 
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 25,
  },
});

export default Index;