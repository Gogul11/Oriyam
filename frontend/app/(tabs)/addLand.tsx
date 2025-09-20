import React, { useState, useEffect } from 'react';
import { 
    Text, 
    View, 
    ScrollView, 
    TouchableOpacity, 
    Image, 
    Alert, 
    Platform,
    Linking,
    KeyboardAvoidingView,
    Modal
} from 'react-native';
import { Formik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import TextField from '../../components/form/textInput';
import FormButton from '../../components/button';
import Label from '../../components/form/label';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker, Polygon } from 'react-native-maps';
import tnData from '../../data/TamilNadu.json';
import { LandSchema, LandFormInitialValues, handleSubmit } from '../../utils/addLandPageUtils';

// ------------------ Image Picker ------------------ //
const ImagePickerComponent = ({ images, onImagesChange }: { images: string[], onImagesChange: (images: string[]) => void }) => {
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return Alert.alert('Permission required', 'Camera roll permission needed');
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });
        if (!result.canceled && result.assets.length > 0) {
            onImagesChange([...images, result.assets[0].uri]);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') return Alert.alert('Permission required', 'Camera permission needed');
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });
        if (!result.canceled && result.assets.length > 0) {
            onImagesChange([...images, result.assets[0].uri]);
        }
    };

    const showOptions = () => {
        Alert.alert('Add Photo', 'Choose photo source', [
            { text: 'Camera', onPress: takePhoto },
            { text: 'Gallery', onPress: pickImage },
            { text: 'Cancel', style: 'cancel' }
        ]);
    };

    const removeImage = (index: number) => {
        onImagesChange(images.filter((_, i) => i !== index));
    };

    return (
        <View className="w-full">
            <Label text="Land Photos" required />
            <View className="flex-row flex-wrap gap-2 mt-2">
                {images.map((img, idx) => (
                    <View key={idx} className="relative">
                        <Image source={{ uri: img }} className="w-20 h-20 rounded-lg" />
                        <TouchableOpacity onPress={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center">
                            <Ionicons name="close" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                ))}
                {images.length < 5 && (
                    <TouchableOpacity onPress={showOptions} 
                        className="w-20 h-20 border-2 border-dashed border-gray-400 rounded-lg items-center justify-center bg-gray-50">
                        <Ionicons name="camera" size={24} color="#666" />
                        <Text className="text-xs text-gray-500 mt-1">Add Photo</Text>
                    </TouchableOpacity>
                )}
            </View>
            <Text className="text-xs text-gray-500 mt-1">Maximum 5 photos</Text>
        </View>
    );
};

// ------------------ Location Picker ------------------ //
const LocationPicker = ({ onLocationSelect, currentLocation }: { 
    onLocationSelect: (loc: { address: string; coordinates: { latitude: number; longitude: number } }) => void, 
    currentLocation?: { address: string; coordinates: { latitude: number; longitude: number } } | null 
}) => {
    const getCurrentLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return Alert.alert('Permission required', 'Location permission needed');
        const loc = await Location.getCurrentPositionAsync({});
        const geo = await Location.reverseGeocodeAsync(loc.coords);
        const address = geo.length > 0 ? `${geo[0].street}, ${geo[0].city}` : `Lat:${loc.coords.latitude}, Lon:${loc.coords.longitude}`;
        onLocationSelect({ address, coordinates: { latitude: loc.coords.latitude, longitude: loc.coords.longitude } });
    };

    const openGoogleMaps = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return Alert.alert('Permission required', 'Location permission needed');
        const loc = await Location.getCurrentPositionAsync({});
        const url = `https://www.google.com/maps/search/?api=1&query=${loc.coords.latitude},${loc.coords.longitude}`;
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) await Linking.openURL(url);
        Alert.alert('Select location in Maps then paste here.');
    };

    return (
        <View className="w-full mb-2">
            <View className="flex-row items-center justify-between mb-2">
                <Label text="Location" required />
                <TouchableOpacity onPress={() => {
                    Alert.alert('Select Location', '', [
                        { text: 'Use Current', onPress: getCurrentLocation },
                        { text: 'Open Google Maps', onPress: openGoogleMaps },
                        { text: 'Cancel', style: 'cancel' }
                    ])
                }} className="flex-row items-center bg-blue-500 px-3 py-1 rounded-md">
                    <Ionicons name="location" size={16} color="white" />
                    <Text className="text-white text-sm ml-1">Locate</Text>
                </TouchableOpacity>
            </View>
            {currentLocation && (
                <View className="bg-green-50 p-2 rounded-md mb-2">
                    <Text className="text-green-800 text-sm">📍 Selected: {currentLocation.address}</Text>
                </View>
            )}
        </View>
    );
};

function calculatePolygonArea(
    coords: { latitude: number; longitude: number }[],
    unit: string = 'sq m'
): string {
    if (coords.length < 3) return '0';

    const R = 6378137; // Earth radius in meters
    const pts = coords.map(p => ({
        x: p.longitude * Math.PI / 180 * R * Math.cos(p.latitude * Math.PI / 180),
        y: p.latitude * Math.PI / 180 * R
    }));

    let area = 0;
    for (let i = 0; i < pts.length; i++) {
        const j = (i + 1) % pts.length;
        area += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
    }
    area = Math.abs(area / 2); // in m²

    switch (unit) {
        case 'sq ft':
            return (area * 10.7639).toFixed(2);
        case 'acres':
            return (area / 4046.86).toFixed(4);
        default:
            return area.toFixed(2); // sq m
    }
}

// ------------------ Geocoding Function ------------------ //
export async function fetchCoordinates(place: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
        const response = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(place)}&limit=1`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].geometry.coordinates;
            return { latitude: lat, longitude: lng };
        }
        return null;
    } catch (error) {
        console.warn('Geocoding error:', error);
        return null;
    }
}

// ------------------ Main AddLand Form ------------------ //
const AddLandIndex = () => {
    const [images, setImages] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<{
        address: string;
        coordinates: { latitude: number; longitude: number };
        polygonCoords?: { latitude: number; longitude: number }[];
    } | null>(null);

    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>('');
    const [selectedVillage, setSelectedVillage] = useState<string>('');
    const [mapRegion, setMapRegion] = useState<{
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    } | null>(null);

    const [datePicker1, setShowDatePicker1] = useState(false);
    const [datePicker2, setShowDatePicker2] = useState(false);

    const [showPolygonModal, setShowPolygonModal] = useState(false);
    const [polygonPoints, setPolygonPoints] = useState<{ latitude: number; longitude: number }[]>([]);

    const districts = tnData.districts.map((d: any) => d.district);
    const subDistricts = selectedDistrict
        ? tnData.districts.find((d: any) => d.district === selectedDistrict)?.subDistricts.map((sd: any) => sd.subDistrict) || []
        : [];
    const villages = selectedDistrict && selectedSubDistrict
        ? tnData.districts
              .find((d: any) => d.district === selectedDistrict)
              ?.subDistricts.find((sd: any) => sd.subDistrict === selectedSubDistrict)
              ?.villages || []
        : [];

    useEffect(() => {
        const updateMapRegion = async () => {
            if (selectedDistrict && selectedSubDistrict && selectedVillage) {
                const place = `${selectedVillage}, ${selectedSubDistrict}, ${selectedDistrict}, Tamil Nadu`;
                const coords = await fetchCoordinates(place);
                if (coords) {
                    setMapRegion({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05
                    });
                }
            }
        };
        updateMapRegion();
    }, [selectedDistrict, selectedSubDistrict, selectedVillage]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView className="flex-1 px-4">
                {/* Header */}
                <View className="my-6">
                    <Text className="text-2xl font-bold text-gray-800 mb-2">Add New Land</Text>
                    <Text className="text-gray-600">Fill all fields to list your land</Text>
                </View>

                <Formik
                    initialValues={LandFormInitialValues}
                    validationSchema={LandSchema}
                    onSubmit={(values) => handleSubmit(values, selectedLocation, images)}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View className="flex gap-2">
                            
                            {/* Basic Info */}
                            <View className="bg-gray-50 border p-4 rounded-md flex gap-4">
                                <Text className="text-lg font-semibold text-gray-800">Basic Information</Text>
                                <View>
                                    <Label text="Title" required />
                                    <TextField
                                        value={values.title}
                                        onChangeText={handleChange('title')}
                                        onBlur={handleBlur('title')}
                                        placeholder="Land title"
                                    />
                                    {touched.title && errors.title && (
                                        <Text className="text-red-500 text-sm">{errors.title}</Text>
                                    )}
                                </View>
                                <View>
                                    <Label text="Description" required />
                                    <TextField
                                        value={values.description}
                                        onChangeText={handleChange('description')}
                                        onBlur={handleBlur('description')}
                                        placeholder="Description"
                                        multiline
                                        numberOfLines={4}
                                        className="border border-gray-400 rounded-md h-24 pl-4 py-2 bg-black/10"
                                    />
                                    {touched.description && errors.description && (
                                        <Text className="text-red-500 text-sm">{errors.description}</Text>
                                    )}
                                </View>
                            </View>

                            {/* Rent & Soil/Water */}
                            <View className="p-4 rounded-md flex gap-4 border">
                                <Text className="text-lg font-semibold text-gray-800">Land Details</Text>
                                <View className="flex-1">
                                    <Label text="Soil Type" required />
                                    <TextField
                                        value={values.soilType}
                                        onChangeText={handleChange('soilType')}
                                        onBlur={handleBlur('soilType')}
                                        placeholder="e.g., Sandy, Clay"
                                    />
                                    {touched.soilType && errors.soilType && (
                                        <Text className="text-red-500 text-sm">{errors.soilType}</Text>
                                    )}
                                </View>
                                <View className="flex-1">
                                    <Label text="Water Source" required />
                                    <TextField
                                        value={values.waterSource}
                                        onChangeText={handleChange('waterSource')}
                                        onBlur={handleBlur('waterSource')}
                                        placeholder="e.g., Well, River"
                                    />
                                    {touched.waterSource && errors.waterSource && (
                                        <Text className="text-red-500 text-sm">{errors.waterSource}</Text>
                                    )}
                                </View>
                            </View>

                            {/* Availability */}
                            <View className="p-4 rounded-md flex gap-4 border">
                                <Text className="text-lg font-semibold text-gray-800">Availability</Text>
                                <View>
                                    <Label text="From" required />
                                    <TouchableOpacity
                                        className="p-3 border border-gray-300 rounded-md bg-black/10"
                                        onPress={() => setShowDatePicker1(true)}
                                    >
                                        <Text>
                                            {values.availabilityFrom ? values.availabilityFrom.toDateString() : "Select availability start"}
                                        </Text>
                                    </TouchableOpacity>
                                    {datePicker1 && (
                                        <RNDateTimePicker
                                            mode="date"
                                            value={values.availabilityFrom}
                                            minimumDate={new Date()}
                                            onChange={(event, selectedDate) => {
                                                setShowDatePicker1(false);
                                                if (selectedDate) setFieldValue("availabilityFrom", selectedDate);
                                            }}
                                        />
                                    )}
                                </View>
                                <View>
                                    <Label text="To" required />
                                    <TouchableOpacity
                                        className="p-3 border border-gray-300 rounded-md bg-black/10"
                                        onPress={() => setShowDatePicker2(true)}
                                    >
                                        <Text>
                                            {values.availabilityTo ? values.availabilityTo.toDateString() : "Select availability end"}
                                        </Text>
                                    </TouchableOpacity>
                                    {datePicker2 && (
                                        <RNDateTimePicker
                                            mode="date"
                                            value={values.availabilityTo}
                                            minimumDate={values.availabilityFrom}
                                            onChange={(event, selectedDate) => {
                                                setShowDatePicker2(false);
                                                if (selectedDate) setFieldValue("availabilityTo", selectedDate);
                                            }}
                                        />
                                    )}
                                </View>
                            </View>

                            {/* Location & Village Selection */}
                            <View className="p-4 rounded-md flex gap-4 border">
                                <Text className="text-lg font-semibold text-gray-800">Location</Text>

                                {/* District */}
                                <Label text="District" required />
                                <View className="border border-gray-400 rounded-md bg-black/10">
                                    <Picker
                                        selectedValue={selectedDistrict}
                                        onValueChange={(value) => {
                                            setSelectedDistrict(value);
                                            setSelectedSubDistrict('');
                                            setSelectedVillage('');
                                        }}
                                    >
                                        <Picker.Item label="Select District" value="" />
                                        {districts.map(d => <Picker.Item key={d} label={d} value={d} />)}
                                    </Picker>
                                </View>

                                {/* Sub-District */}
                                <Label text="Sub-District" required />
                                <View className="border border-gray-400 rounded-md bg-black/10">
                                    <Picker
                                        selectedValue={selectedSubDistrict}
                                        onValueChange={(value) => {
                                            setSelectedSubDistrict(value);
                                            setSelectedVillage('');
                                        }}
                                    >
                                        <Picker.Item label="Select Sub-District" value="" />
                                        {subDistricts.map(sd => <Picker.Item key={sd} label={sd} value={sd} />)}
                                    </Picker>
                                </View>

                                {/* Village */}
                                <Label text="Village" required />
                                <View className="border border-gray-400 rounded-md bg-black/10">
                                    <Picker
                                        selectedValue={selectedVillage}
                                        onValueChange={value => setSelectedVillage(value)}
                                    >
                                        <Picker.Item label="Select Village" value="" />
                                        {villages.map(v => <Picker.Item key={v} label={v} value={v} />)}
                                    </Picker>
                                </View>
                            </View>

                            {/* Polygon Picker */}
                            <View className="p-4 rounded-md flex gap-4 border">
                                <Text className="text-lg font-semibold text-gray-800">Land Polygon</Text>
                                <TouchableOpacity
                                    onPress={() => setShowPolygonModal(true)}
                                    className="flex-row items-center bg-blue-500 px-3 py-2 rounded-md"
                                >
                                    <Ionicons name="map" size={16} color="white" />
                                    <Text className="text-white text-sm ml-2">Select Land Polygon</Text>
                                </TouchableOpacity>

                                <Modal visible={showPolygonModal} animationType="slide">
                                    <View style={{ flex: 1 }}>
                                        {mapRegion && (
                                            <MapView
                                                style={{ flex: 1 }}
                                                region={mapRegion}
                                                onPress={(e) => {
                                                    const { latitude, longitude } = e.nativeEvent.coordinate;
                                                    setPolygonPoints([...polygonPoints, { latitude, longitude }]);
                                                }}
                                            >
                                                {polygonPoints.map((point, idx) => (
                                                    <Marker key={idx} coordinate={point} />
                                                ))}
                                                {polygonPoints.length >= 3 && (
                                                    <Polygon coordinates={polygonPoints} fillColor="rgba(0,150,255,0.3)" />
                                                )}
                                            </MapView>
                                        )}
                                        <View className="flex-row justify-around p-4 bg-white">
                                            <TouchableOpacity onPress={() => setPolygonPoints([])} className="px-4 py-2 bg-red-500 rounded">
                                                <Text className="text-white font-semibold">Reset</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (polygonPoints.length < 3) {
                                                        Alert.alert('Polygon Error', 'Please select at least 3 points');
                                                        return;
                                                    }
                                                    setSelectedLocation({
                                                        address: selectedVillage
                                                            ? `${selectedVillage}, ${selectedSubDistrict}, ${selectedDistrict}`
                                                            : 'Polygon Selected',
                                                        coordinates: polygonPoints[0],
                                                        polygonCoords: polygonPoints,
                                                    });
                                                    setShowPolygonModal(false);
                                                }}
                                                className="px-4 py-2 bg-green-500 rounded"
                                            >
                                                <Text className="text-white font-semibold">Save Polygon</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setShowPolygonModal(false)} className="px-4 py-2 bg-gray-400 rounded">
                                                <Text className="text-white font-semibold">Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>

                                {/* Display Polygon Coordinates and Area */}
                                {selectedLocation?.polygonCoords && selectedLocation.polygonCoords.length > 0 && (
                                    <View className="mt-2 bg-gray-100 p-2 rounded">
                                        <Text className="font-semibold text-gray-700 mb-1">Polygon Coordinates:</Text>
                                        {selectedLocation.polygonCoords.map((point, idx) => (
                                            <Text key={idx} className="text-sm text-gray-600">
                                                {idx + 1}. Lat: {point.latitude.toFixed(6)}, Lon: {point.longitude.toFixed(6)}
                                            </Text>
                                        ))}

                                        {/* Calculate Area */}
                                        <Text className="font-semibold text-gray-700 mt-2">
                                            Area: {calculatePolygonArea(selectedLocation.polygonCoords)} m²
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Area & Unit */}
                            <View className="bg-gray-50 p-4 rounded-md border flex gap-4">
                                <Text className="text-lg font-semibold text-gray-800">Area & Unit</Text>

                                <View>
                                    <Label text="Area" required />
                                    <TextField
                                        value={
                                            selectedLocation?.polygonCoords
                                                ? calculatePolygonArea(selectedLocation.polygonCoords, values.unit)
                                                : values.area
                                        }
                                        onChangeText={handleChange('area')}
                                        onBlur={handleBlur('area')}
                                        placeholder="Area"
                                        keyboardType="numeric"
                                    />
                                    {touched.area && errors.area && (
                                        <Text className="text-red-500 text-sm">{errors.area}</Text>
                                    )}
                                </View>

                                <View>
                                    <Label text="Unit" required />
                                    <View className="border border-gray-400 rounded-md pl-4 py-2 bg-black/10">
                                        <Picker
                                            selectedValue={values.unit}
                                            onValueChange={(itemValue) => setFieldValue('unit', itemValue)}
                                        >
                                            <Picker.Item label="Select Unit" value="" />
                                            <Picker.Item label="sq m" value="sq m" />
                                            <Picker.Item label="sq ft" value="sq ft" />
                                            <Picker.Item label="acres" value="acres" />
                                        </Picker>
                                    </View>
                                </View>

                                <View>
                                    <Label text="Rent Price" required />
                                    <TextField
                                        value={values.rentPrice}
                                        onChangeText={handleChange('rentPrice')}
                                        onBlur={handleBlur('rentPrice')}
                                        placeholder="₹ / month"
                                        keyboardType="numeric"
                                    />
                                    {touched.rentPrice && errors.rentPrice && (
                                        <Text className="text-red-500 text-sm">{errors.rentPrice}</Text>
                                    )}
                                </View>
                            </View>

                            {/* Images */}
                            {/* <View className="p-4 rounded-md flex gap-4 border">
                                <Text className="text-lg font-semibold text-gray-800">Land Photos</Text>
                                <ImagePickerComponent images={images} onImagesChange={setImages} />
                            </View> */}

                            {/* Submit */}
                            <View className="mb-12">
                                <FormButton
                                    text="Submit Land"
                                    onPress={handleSubmit}
                                    ButtonClassName="w-full h-12 bg-blue-600 rounded-lg items-center justify-center"
                                    TextClassName="text-white text-lg font-semibold"
                                />
                            </View>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddLandIndex;