import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Land = {
  land_id: string;
  user_id: string;
  title: string;
  description: string;
  area: number;
  unit: 'acres' | 'hectares' | 'sqft';
  location: string;
  Coordinates: { latitude: number; longitude: number };
  soil_type: string;
  water_source: string;
  availability_from: string;
  availability_to: string;
  rent_price_per_month: number;
  status: boolean;
  land_photos: string[];
};

type RootStackParamList = {
  Search: undefined;
  LandDetails: { land: Land };
};

const LAND_DATA: Land[] = [
  {
    land_id: '1',
    user_id: 'user123',
    title: 'Serene Farmland',
    description: 'A beautiful and vast farmland with rich soil, perfect for organic cultivation. Comes with a dedicated water source.',
    area: 10,
    unit: 'acres',
    location: 'Bangalore, Karnataka',
    Coordinates: { latitude: 12.9716, longitude: 77.5946 },
    soil_type: 'Red Loam',
    water_source: 'Borewell',
    availability_from: '2025-09-01',
    availability_to: '2026-08-31',
    rent_price_per_month: 25000,
    status: true,
    land_photos: [
      'https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1444930694458-01bab749586b?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    land_id: '2',
    user_id: 'user456',
    title: 'Golden Pastures',
    description: 'Expansive green fields ready for livestock or large-scale farming. Peaceful and well-connected.',
    area: 25,
    unit: 'acres',
    location: 'Hyderabad, Telangana',
    Coordinates: { latitude: 17.3850, longitude: 78.4867 },
    soil_type: 'Black Cotton',
    water_source: 'Canal',
    availability_from: '2025-10-15',
    availability_to: '2027-10-14',
    rent_price_per_month: 45000,
    status: true,
    land_photos: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542273917363-3b1817469a68?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    land_id: '3',
    user_id: 'user456',
    title: 'Golden Pastures',
    description: 'Expansive green fields ready for livestock or large-scale farming. Peaceful and well-connected.',
    area: 25,
    unit: 'acres',
    location: 'Hyderabad, Telangana',
    Coordinates: { latitude: 17.3850, longitude: 78.4867 },
    soil_type: 'Black Cotton',
    water_source: 'Canal',
    availability_from: '2025-10-15',
    availability_to: '2027-10-14',
    rent_price_per_month: 45000,
    status: true,
    land_photos: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542273917363-3b1817469a68?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

const SearchLandScreen = () => {
  const [search, setSearch] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const cardWidth = width - 32;

  const filteredData = LAND_DATA.filter(
    (land) =>
      land.title.toLowerCase().includes(search.toLowerCase()) ||
      land.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <TextInput
        className="h-12 bg-white border border-gray-300 rounded-lg px-4 mb-5 text-base text-gray-900"
        value={search}
        onChangeText={setSearch}
        placeholder="Search by location or name"
        placeholderTextColor="#9CA3AF"
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.land_id}
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl mb-6 overflow-hidden border border-gray-200 shadow-sm">
            <FlatList
              data={item.land_photos}
              keyExtractor={(photoUrl) => photoUrl}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={({ item: photoUrl }) => (
                <Image
                  source={{ uri: photoUrl }}
                  style={{ width: cardWidth, height: 160 }}
                  resizeMode="cover"
                />
              )}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('LandDetails', { land: item })}
            >
              <View className="p-4">
                <Text className="text-xl font-bold text-gray-900">{item.title}</Text>
                <Text className="text-md text-gray-600 mt-1">{item.location}</Text>
                <Text className="text-md text-gray-600 mt-1">{`${item.area} ${item.unit}`}</Text>
                <Text className="text-lg font-semibold text-gray-800 mt-3">{`₹${item.rent_price_per_month.toLocaleString()}/month`}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">No lands found.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SearchLandScreen;