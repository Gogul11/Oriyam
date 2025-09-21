import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, useWindowDimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchLands, type Land} from '../../utils/viewLandsPageUtils';



type RootStackParamList = {
  Search: undefined;
  LandDetails: { land: Land };
};



const SearchLandScreen = () => {
  const [search, setSearch] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const cardWidth = width - 32;


  const[lands, setLands] = useState<Land[]>([])

  useEffect(() => {
    fetchLands(setLands)
    console.log(lands)
  }, [])
  
  // const filteredData = LAND_DATA.filter(
  //   (land) =>
  //     land.title.toLowerCase().includes(search.toLowerCase()) ||
  //     land.location.toLowerCase().includes(search.toLowerCase())
  // );
  return (
    <View className="flex-1 bg-green-100 p-4">
      <TextInput
        className="h-12 bg-white border border-gray-300 rounded-lg px-4 mb-5 text-base text-gray-900"
        value={search}
        onChangeText={setSearch}
        placeholder="Search by location or name"
        placeholderTextColor="#9CA3AF"
      />
      <FlatList
        data={lands}
        keyExtractor={(item) => item.landId}
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl mb-6 overflow-hidden border border-gray-200 shadow-sm">
            <FlatList
              data={item.photos}
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
                <Text className="text-md text-gray-600 mt-1">{item.district}</Text>
                <Text className="text-md text-gray-600 mt-1">{item.subDistrict}</Text>
                <Text className="text-md text-gray-600 mt-1">{item.village}</Text>
                <Text className="text-md text-gray-600 mt-1">{`${item.area} ${item.unit}`}</Text>
                <Text className="text-lg font-semibold text-gray-800 mt-3">{`₹${item.rentPricePerMonth.toLocaleString()}/month`}</Text>
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