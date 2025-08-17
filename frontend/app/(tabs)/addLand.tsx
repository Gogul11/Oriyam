import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    ScrollView, 
    TouchableOpacity, 
    Image, 
    Alert,
    Platform,
    Linking 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import TextField from '../../components/form/textInput';
import FormButton from '../../components/button';
import Label from '../../components/form/label';
import { Ionicons } from '@expo/vector-icons';

// Validation schema
const LandSchema = Yup.object().shape({
    title: Yup.string().required('Land title is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().positive('Price must be positive').required('Price is required'),
    area: Yup.number().positive('Area must be positive').required('Area is required'),
    location: Yup.string().required('Location is required'),
    contactNumber: Yup.string().required('Contact number is required'),
    address: Yup.string().required('Address is required'),
});

// Image picker component
const ImagePickerComponent = ({ images, onImagesChange }: { 
    images: string[], 
    onImagesChange: (images: string[]) => void 
}) => {
    const pickImage = async () => {
        try {
            // Request permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Sorry, we need camera roll permissions to make this work!',
                    [{ text: 'OK' }]
                );
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                allowsMultipleSelection: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const newImage = result.assets[0].uri;
                onImagesChange([...images, newImage]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const takePhoto = async () => {
        try {
            // Request camera permissions
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Sorry, we need camera permissions to make this work!',
                    [{ text: 'OK' }]
                );
                return;
            }

            // Launch camera
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const newImage = result.assets[0].uri;
                onImagesChange([...images, newImage]);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    const showImageOptions = () => {
        Alert.alert(
            'Add Photo',
            'Choose how you want to add a photo',
            [
                {
                    text: 'Camera',
                    onPress: takePhoto,
                },
                {
                    text: 'Photo Library',
                    onPress: pickImage,
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    return (
        <View className="w-full">
            <Label text="Land Photos" required />
            <View className="flex-row flex-wrap gap-2 mt-2">
                {images.map((image, index) => (
                    <View key={index} className="relative">
                        <Image 
                            source={{ uri: image }} 
                            className="w-20 h-20 rounded-lg"
                        />
                        <TouchableOpacity
                            onPress={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                        >
                            <Ionicons name="close" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                ))}
                {images.length < 5 && (
                    <TouchableOpacity
                        onPress={showImageOptions}
                        className="w-20 h-20 border-2 border-dashed border-gray-400 rounded-lg items-center justify-center bg-gray-50"
                    >
                        <Ionicons name="camera" size={24} color="#666" />
                        <Text className="text-xs text-gray-500 mt-1">Add Photo</Text>
                    </TouchableOpacity>
                )}
            </View>
            <Text className="text-xs text-gray-500 mt-1">
                Maximum 5 photos allowed
            </Text>
        </View>
    );
};

// Location picker component
const LocationPicker = ({ 
    onLocationSelect, 
    currentLocation 
}: { 
    onLocationSelect: (location: { address: string; coordinates: { latitude: number; longitude: number } }) => void;
    currentLocation?: { address: string; coordinates: { latitude: number; longitude: number } } | null;
}) => {
    const openGoogleMaps = async () => {
        try {
            // Get current location as starting point
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Location permission is needed to open maps with your current location.',
                    [{ text: 'OK' }]
                );
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            // Open Google Maps with current location
            const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                await Linking.openURL(url);
                
                // Show instructions to user
                Alert.alert(
                    'Location Selection',
                    'Google Maps has opened. Please:\n\n1. Navigate to your desired location\n2. Long press on the map to drop a pin\n3. Copy the address from the bottom of the screen\n4. Return to this app and paste the address',
                    [
                        {
                            text: 'I\'ve Selected Location',
                            onPress: () => {
                                // For demo purposes, we'll use the current location
                                // In a real app, you might want to implement a more sophisticated solution
                                const demoAddress = `Demo Address at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                                onLocationSelect({
                                    address: demoAddress,
                                    coordinates: { latitude, longitude }
                                });
                            }
                        },
                        { text: 'Cancel', style: 'cancel' }
                    ]
                );
            } else {
                Alert.alert('Error', 'Google Maps is not available on this device.');
            }
        } catch (error) {
            console.error('Error opening Google Maps:', error);
            Alert.alert('Error', 'Failed to open Google Maps. Please try again.');
        }
    };

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Location permission is needed to get your current location.',
                    [{ text: 'OK' }]
                );
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            // Reverse geocode to get address
            const geocodeResult = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            });

            if (geocodeResult.length > 0) {
                const addressComponents = geocodeResult[0];
                const address = [
                    addressComponents.street,
                    addressComponents.city,
                    addressComponents.region,
                    addressComponents.country
                ].filter(Boolean).join(', ');

                onLocationSelect({
                    address: address || `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                    coordinates: { latitude, longitude }
                });
            }
        } catch (error) {
            console.error('Error getting current location:', error);
            Alert.alert('Error', 'Failed to get current location. Please try again.');
        }
    };

    const showLocationOptions = () => {
        Alert.alert(
            'Select Location',
            'Choose how you want to select the location',
            [
                {
                    text: 'Use Current Location',
                    onPress: getCurrentLocation,
                },
                {
                    text: 'Open Google Maps',
                    onPress: openGoogleMaps,
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    return (
        <View className="w-full">
            <View className="flex-row items-center justify-between mb-2">
                <Label text="Location" required />
                <TouchableOpacity
                    onPress={showLocationOptions}
                    className="flex-row items-center bg-blue-500 px-3 py-1 rounded-md"
                >
                    <Ionicons name="location" size={16} color="white" />
                    <Text className="text-white text-sm ml-1">Locate</Text>
                </TouchableOpacity>
            </View>
            {currentLocation && (
                <View className="bg-green-50 p-2 rounded-md mb-2">
                    <Text className="text-green-800 text-sm">
                        📍 Selected: {currentLocation.address}
                    </Text>
                </View>
            )}
        </View>
    );
};

const AddLandIndex = () => {
    const [images, setImages] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<{
        address: string;
        coordinates: { latitude: number; longitude: number };
    } | null>(null);

    const initialValues = {
        title: '',
        description: '',
        price: '',
        area: '',
        location: '',
        contactNumber: '',
        address: '',
        propertyType: '',
        features: '',
    };

    const handleSubmit = (values: any) => {
        const formData = {
            ...values,
            images,
            location: selectedLocation ? selectedLocation.address : values.location,
            coordinates: selectedLocation ? selectedLocation.coordinates : null,
            price: parseFloat(values.price),
            area: parseFloat(values.area),
        };
        console.log('Form submitted:', formData);
        Alert.alert('Success', 'Land information submitted successfully!');
    };

    const handleLocationSelect = (location: { address: string; coordinates: { latitude: number; longitude: number } }) => {
        setSelectedLocation(location);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 px-4 py-6">
                {/* Header */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-gray-800 mb-2">
                        Add New Land
                    </Text>
                    <Text className="text-gray-600">
                        Fill in the details below to list your land
                    </Text>
                </View>

                <Formik
                    initialValues={initialValues}
                    validationSchema={LandSchema}
                    onSubmit={handleSubmit}
                >
                    {({ 
                        handleChange, 
                        handleBlur, 
                        handleSubmit, 
                        values,
                        errors,
                        touched,
                        isValid,
                        setFieldValue
                    }) => (
                        <View className="space-y-4">
                            {/* Basic Information Section */}
                            <View className="bg-gray-50 p-4 rounded-lg">
                                <Text className="text-lg font-semibold text-gray-800 mb-4">
                                    Basic Information
                                </Text>
                                
                                <View className="space-y-4">
                                    <View>
                                        <Label text="Land Title" required />
                                        <TextField
                                            value={values.title}
                                            onChangeText={handleChange('title')}
                                            placeholder="Enter land title"
                                            onBlur={handleBlur('title')}
                                        />
                                        {touched.title && errors.title && (
                                            <Text className="text-red-500 text-sm mt-1">
                                                {errors.title}
                                            </Text>
                                        )}
                                    </View>

                                    <View>
                                        <Label text="Description" required />
                                        <TextField
                                            value={values.description}
                                            onChangeText={handleChange('description')}
                                            placeholder="Describe your land..."
                                            onBlur={handleBlur('description')}
                                            multiline
                                            numberOfLines={4}
                                            className="border border-gray-400 rounded-md h-24 pl-4 py-2 bg-black/10"
                                        />
                                        {touched.description && errors.description && (
                                            <Text className="text-red-500 text-sm mt-1">
                                                {errors.description}
                                            </Text>
                                        )}
                                    </View>

                                    <View className="flex-row space-x-4">
                                        <View className="flex-1">
                                            <Label text="Price (₹)" required />
                                            <TextField
                                                value={values.price}
                                                onChangeText={handleChange('price')}
                                                placeholder="Enter price"
                                                onBlur={handleBlur('price')}
                                                keyboardType="numeric"
                                            />
                                            {touched.price && errors.price && (
                                                <Text className="text-red-500 text-sm mt-1">
                                                    {errors.price}
                                                </Text>
                                            )}
                                        </View>
                                        <View className="flex-1">
                                            <Label text="Area (sq ft)" required />
                                            <TextField
                                                value={values.area}
                                                onChangeText={handleChange('area')}
                                                placeholder="Enter area"
                                                onBlur={handleBlur('area')}
                                                keyboardType="numeric"
                                            />
                                            {touched.area && errors.area && (
                                                <Text className="text-red-500 text-sm mt-1">
                                                    {errors.area}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Location Section */}
                            <View className="bg-gray-50 p-4 rounded-lg">
                                <Text className="text-lg font-semibold text-gray-800 mb-4">
                                    Location Details
                                </Text>
                                
                                <View className="space-y-4">
                                    <LocationPicker 
                                        onLocationSelect={handleLocationSelect}
                                        currentLocation={selectedLocation}
                                    />
                                    <TextField
                                        value={selectedLocation ? selectedLocation.address : values.location}
                                        onChangeText={(text) => {
                                            handleChange('location')(text);
                                            if (selectedLocation) {
                                                setSelectedLocation(null);
                                            }
                                        }}
                                        placeholder="City, State"
                                        onBlur={handleBlur('location')}
                                    />
                                    {touched.location && errors.location && (
                                        <Text className="text-red-500 text-sm mt-1">
                                            {errors.location}
                                        </Text>
                                    )}

                                    <View>
                                        <Label text="Full Address" required />
                                        <TextField
                                            value={values.address}
                                            onChangeText={handleChange('address')}
                                            placeholder="Enter complete address"
                                            onBlur={handleBlur('address')}
                                            multiline
                                            numberOfLines={3}
                                            className="border border-gray-400 rounded-md h-20 pl-4 py-2 bg-black/10"
                                        />
                                        {touched.address && errors.address && (
                                            <Text className="text-red-500 text-sm mt-1">
                                                {errors.address}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>

                            {/* Contact Information */}
                            <View className="bg-gray-50 p-4 rounded-lg">
                                <Text className="text-lg font-semibold text-gray-800 mb-4">
                                    Contact Information
                                </Text>
                                
                                <View>
                                    <Label text="Contact Number" required />
                                    <TextField
                                        value={values.contactNumber}
                                        onChangeText={handleChange('contactNumber')}
                                        placeholder="+91-XXXXXXXXXX"
                                        onBlur={handleBlur('contactNumber')}
                                        keyboardType="phone-pad"
                                    />
                                    {touched.contactNumber && errors.contactNumber && (
                                        <Text className="text-red-500 text-sm mt-1">
                                            {errors.contactNumber}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            {/* Additional Details */}
                            <View className="bg-gray-50 p-4 rounded-lg">
                                <Text className="text-lg font-semibold text-gray-800 mb-4">
                                    Additional Details
                                </Text>
                                
                                <View className="space-y-4">
                                    <View>
                                        <Label text="Property Type" />
                                        <TextField
                                            value={values.propertyType}
                                            onChangeText={handleChange('propertyType')}
                                            placeholder="e.g., Residential, Commercial, Agricultural"
                                            onBlur={handleBlur('propertyType')}
                                        />
                                    </View>

                                    <View>
                                        <Label text="Features" />
                                        <TextField
                                            value={values.features}
                                            onChangeText={handleChange('features')}
                                            placeholder="e.g., Water connection, Electricity, Road access"
                                            onBlur={handleBlur('features')}
                                            multiline
                                            numberOfLines={3}
                                            className="border border-gray-400 rounded-md h-20 pl-4 py-2 bg-black/10"
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Image Upload Section */}
                            <View className="bg-gray-50 p-4 rounded-lg">
                                <ImagePickerComponent 
                                    images={images} 
                                    onImagesChange={setImages} 
                                />
                            </View>

                            {/* Submit Button */}
                            <View className="mt-6 mb-8">
                                <FormButton
                                    text="Submit Land Information"
                                    onPress={handleSubmit}
                                    ButtonClassName="w-full h-12 rounded-lg flex flex-row justify-center items-center bg-blue-600"
                                    TextClassName="text-white text-center font-semibold text-lg"
                                />
                            </View>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddLandIndex;
