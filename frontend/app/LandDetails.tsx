import React, {useState} from 'react';
import { View, Text, Image, ScrollView, FlatList, useWindowDimensions } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { type Land } from '../utils/viewLandsPageUtils';
import CustomButton from '../components/button';
import InterestForm from '../components/intrestForm';
import { handleIntrestSubmit } from '../utils/landDetatilsPageUtils';

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

  const [modalVisible, setModalVisible] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  return (
    <ScrollView className="flex-1 bg-[#e8f5e9] p-2">
      <FlatList
        data={land.photos}
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
        <Text className="text-md text-gray-600 mt-1">{land.district}</Text>
        <Text className="text-md text-gray-600 mt-1">{land.subDistrict}</Text>
        <Text className="text-md text-gray-600 mt-1">{land.village}</Text>
        <Text className="text-lg font-semibold text-gray-800 mt-3">{`₹${land.rentPricePerMonth.toLocaleString()}/month`}</Text>
        <Text className="text-base text-gray-700 mt-4 leading-6">{land.description}</Text>

        <View className="mt-6 border-t border-gray-200 pt-4">
          <Text className="text-xl font-bold text-gray-800 mb-2">Property Details</Text>
          <DetailRow label="Area" value={`${land.area} ${land.unit}`} />
          <DetailRow label="Soil Type" value={land.soilType} />
          <DetailRow label="Water Source" value={land.waterSource} />
          <DetailRow label="Available From" value={land.availabilityFrom} />
          <DetailRow label="Available To" value={land.availabilityTo} />
          <DetailRow label="Status" value={land.status ? 'Available' : 'Not Available'} />
        </View>

        <View>
          <InterestForm
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSubmit={(data) => handleIntrestSubmit(data, land.landId)}
          />
          <CustomButton
            text="Show Interest"
            onPress={() => setModalVisible(true)}
            ButtonClassName="border border-green-600 w-full py-3 my-4 rounded-2xl"
            TextClassName="text-green-700 text-center text-lg font-semibold"
          ></CustomButton>
        </View>
      </View>
    </ScrollView>
  );
};

export default LandDetails;