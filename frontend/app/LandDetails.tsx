import React from 'react';
import { View, Text, Image, ScrollView, FlatList, useWindowDimensions } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

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

type LandDetailsRouteProp = RouteProp<RootStackParamList, 'LandDetails'>;

const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
  <View className="flex-row justify-between py-3 border-b border-gray-100">
    <Text className="text-md text-gray-600">{label}</Text>
    <Text className="text-md font-semibold text-gray-900 text-right">{value}</Text>
  </View>
);

const LandDetails = () => {
  const route = useRoute<LandDetailsRouteProp>();
  const { land } = route.params;
  const { width } = useWindowDimensions();

  return (
    <ScrollView className="flex-1 bg-white">
      <FlatList
        data={land.land_photos}
        keyExtractor={(photoUrl) => photoUrl}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        className="h-60" 
        renderItem={({ item: photoUrl }) => (
          <Image
            source={{ uri: photoUrl }}
            style={{ width: width, height: 240 }} 
            resizeMode="cover"
          />
        )}
      />

      <View className="p-5">
        <Text className="text-3xl font-bold text-gray-900">{land.title}</Text>
        <Text className="text-lg text-gray-500 mt-1">{land.location}</Text>
        <Text className="text-2xl font-bold text-gray-800 mt-5">{`₹${land.rent_price_per_month.toLocaleString()}/month`}</Text>
        <Text className="text-base text-gray-700 mt-4 leading-6">{land.description}</Text>

        <View className="mt-6 border-t border-gray-200 pt-4">
          <Text className="text-xl font-bold text-gray-800 mb-2">Property Details</Text>
          <DetailRow label="Area" value={`${land.area} ${land.unit}`} />
          <DetailRow label="Soil Type" value={land.soil_type} />
          <DetailRow label="Water Source" value={land.water_source} />
          <DetailRow label="Available From" value={land.availability_from} />
          <DetailRow label="Available To" value={land.availability_to} />
          <DetailRow label="Status" value={land.status ? 'Available' : 'Not Available'} />
        </View>
      </View>
    </ScrollView>
  );
};

export default LandDetails;