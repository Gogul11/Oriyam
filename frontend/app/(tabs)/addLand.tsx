import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
    KeyboardAvoidingView,
    Modal,
    Dimensions,
} from 'react-native';
import { Formik, FormikErrors, FormikProps } from 'formik';
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
// Assuming these utilities and data structures exist in your project:
import { LandSchema, LandFormInitialValues, handleSubmit } from '../../utils/addLandPageUtils';

const { width } = Dimensions.get('window');
const STEP_MARGIN = 16; 

// ------------------ Data & Utility Types ------------------ //

interface LandFormValues {
    title: string;
    description: string;
    soilType: string;
    waterSource: string;
    availabilityFrom: Date;
    availabilityTo: Date;
    district: string;
    subDistrict: string;
    village: string;
    area: string;
    unit: string;
    rentPricePerMonth: string;
}

interface StepProps extends Pick<FormikProps<LandFormValues>, 
    'values' | 'errors' | 'touched' | 'handleChange' | 'handleBlur' | 'setFieldValue'> 
{
    // Custom state props
    selectedDistrict: string;
    setSelectedDistrict: (value: string) => void;
    selectedSubDistrict: string;
    setSelectedSubDistrict: (value: string) => void;
    selectedVillage: string;
    setSelectedVillage: (value: string) => void;
    districts: string[];
    subDistricts: string[];
    villages: string[];
    datePicker1: boolean;
    setShowDatePicker1: (show: boolean) => void;
    datePicker2: boolean;
    setShowDatePicker2: (show: boolean) => void;
    showPolygonModal: boolean;
    setShowPolygonModal: (show: boolean) => void;
    polygonPoints: { latitude: number; longitude: number }[];
    setPolygonPoints: (points: { latitude: number; longitude: number }[]) => void;
    mapRegion: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null;
    selectedLocation: {
        address: string;
        coordinates: { latitude: number; longitude: number };
        polygonCoords?: { latitude: number; longitude: number }[];
    } | null;
    setSelectedLocation: (location: any) => void;
    images: string[];
    setImages: (images: string[]) => void;
}

// ------------------ Utility Functions (Preserved) ------------------ //

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

const chennaiRegion = {
    latitude: 13.0827,
    longitude: 80.2707,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
};

// ------------------ Image Picker (Preserved) ------------------ //

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

// ------------------ Step Components (Cleaned for horizontal scroll) ------------------ //

// All step components use consistent 'mx-4' and 'mb-4' for layout within the scroll view
const Step1BasicInfo = ({ values, handleChange, handleBlur, errors }: StepProps) => (
    <View style={{ width: width, paddingHorizontal: STEP_MARGIN }}>
        <View className="bg-gray-50 border p-4 rounded-md flex gap-4 mb-4">
            <Text className="text-xl font-bold text-gray-800">1. Basic Information</Text>
            <View>
                <Label text="Title" required />
                <TextField
                    value={values.title}
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                    placeholder="Land title"
                />
                {errors.title && <Text className="text-red-500 text-sm">{errors.title}</Text>}
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
                {errors.description && <Text className="text-red-500 text-sm">{errors.description}</Text>}
            </View>
        </View>
    </View>
);

const Step2LandDetails = ({ values, handleChange, handleBlur, errors }: StepProps) => (
    <View style={{ width: width, paddingHorizontal: STEP_MARGIN }}>
        <View className="bg-gray-50 p-4 rounded-md flex gap-4 border mb-4">
            <Text className="text-xl font-bold text-gray-800">2. Land Details</Text>
            <View className="flex-1">
                <Label text="Soil Type" required />
                <TextField
                    value={values.soilType}
                    onChangeText={handleChange('soilType')}
                    onBlur={handleBlur('soilType')}
                    placeholder="e.g., Sandy, Clay"
                />
                {errors.soilType && <Text className="text-red-500 text-sm">{errors.soilType}</Text>}
            </View>
            <View className="flex-1">
                <Label text="Water Source" required />
                <TextField
                    value={values.waterSource}
                    onChangeText={handleChange('waterSource')}
                    onBlur={handleBlur('waterSource')}
                    placeholder="e.g., Well, River"
                />
                {errors.waterSource && <Text className="text-red-500 text-sm">{errors.waterSource}</Text>}
            </View>
        </View>
    </View>
);

const Step3Availability = ({ values, errors, setFieldValue, datePicker1, setShowDatePicker1, datePicker2, setShowDatePicker2 }: StepProps) => (
    <View style={{ width: width, paddingHorizontal: STEP_MARGIN }}>
        <View className="bg-gray-50 p-4 rounded-md flex gap-4 border mb-4">
            <Text className="text-xl font-bold text-gray-800">3. Availability</Text>
            <View>
                <Label text="From" required />
                <TouchableOpacity
                    className="p-3 border border-gray-300 rounded-md bg-black/10"
                    onPress={() => setShowDatePicker1(true)}
                >
                    <Text className="text-gray-700">
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
                {errors.availabilityFrom && <Text className="text-red-500 text-sm">{errors.availabilityFrom as string}</Text>}
            </View>
            <View>
                <Label text="To" required />
                <TouchableOpacity
                    className="p-3 border border-gray-300 rounded-md bg-black/10"
                    onPress={() => setShowDatePicker2(true)}
                >
                    <Text className="text-gray-700">
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
                {errors.availabilityTo && <Text className="text-red-500 text-sm">{errors.availabilityTo as string}</Text>}
            </View>
        </View>
    </View>
);

const Step4Location = ({ selectedDistrict, setSelectedDistrict, selectedSubDistrict, setSelectedSubDistrict, selectedVillage, setSelectedVillage, districts, subDistricts, villages, errors }: StepProps) => (
    <View style={{ width: width, paddingHorizontal: STEP_MARGIN }}>
        <View className="bg-gray-50 p-4 rounded-md flex gap-4 border mb-4">
            <Text className="text-xl font-bold text-gray-800">4. Location Selection</Text>
            {/* ... (Pickers remain the same) ... */}
            <View>
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
                {errors.district && <Text className="text-red-500 text-sm">{errors.district}</Text>}
            </View>
            <View>
                <Label text="Sub-District" required />
                <View className="border border-gray-400 rounded-md bg-black/10">
                    <Picker
                        selectedValue={selectedSubDistrict}
                        onValueChange={(value) => {
                            setSelectedSubDistrict(value);
                            setSelectedVillage('');
                        }}
                        enabled={!!selectedDistrict}
                    >
                        <Picker.Item label="Select Sub-District" value="" />
                        {subDistricts.map(sd => <Picker.Item key={sd} label={sd} value={sd} />)}
                    </Picker>
                </View>
                {errors.subDistrict && <Text className="text-red-500 text-sm">{errors.subDistrict}</Text>}
            </View>
            <View>
                <Label text="Village" required />
                <View className="border border-gray-400 rounded-md bg-black/10">
                    <Picker
                        selectedValue={selectedVillage}
                        onValueChange={value => setSelectedVillage(value)}
                        enabled={!!selectedSubDistrict}
                    >
                        <Picker.Item label="Select Village" value="" />
                        {villages.map(v => <Picker.Item key={v} label={v} value={v} />)}
                    </Picker>
                </View>
                {errors.village && <Text className="text-red-500 text-sm">{errors.village}</Text>}
            </View>
        </View>
    </View>
);

const Step5PolygonMapping = (props: StepProps) => (
    <View style={{ width: width, paddingHorizontal: STEP_MARGIN }}>
        <View className="bg-gray-50 p-4 rounded-md flex gap-4 border mb-4">
            <Text className="text-xl font-bold text-gray-800">5. Land Polygon</Text>
            <Text className="text-gray-600">Mark the boundary of your land on the map.</Text>
            {/* ... (Button and Modal logic remain the same) ... */}
            <TouchableOpacity
                onPress={() => {
                    if (!props.selectedVillage) {
                        Alert.alert('Incomplete Location', 'Please select District, Sub-District, and Village first.');
                    } else {
                        props.setShowPolygonModal(true);
                    }
                }}
                className="flex-row items-center bg-green-600 px-3 py-3 rounded-md shadow-md"
            >
                <Ionicons name="map" size={20} color="white" />
                <Text className="text-white text-lg font-semibold ml-2">Select Land Polygon</Text>
            </TouchableOpacity>

            <Modal visible={props.showPolygonModal} animationType="slide">
                {/* ... (Modal content for map view) ... */}
                <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 40 : 0 }}>
                    <Text className="text-center p-3 text-lg font-bold bg-green-100 text-green-800">
                        Tap on the map to mark corner points.
                    </Text>
                    <Text className="text-center pb-2 text-sm text-gray-600">
                        Points selected: {props.polygonPoints.length} (Min 3)
                    </Text>
                    {props.mapRegion && (
                        <MapView
                            style={{ flex: 1 }}
                            initialRegion={props.mapRegion || chennaiRegion}
                            region={props.mapRegion || chennaiRegion}
                            onPress={(e) => {
                                const { latitude, longitude } = e.nativeEvent.coordinate;
                                props.setPolygonPoints([...props.polygonPoints, { latitude, longitude }]);
                            }}
                        >
                            {props.polygonPoints.map((point, idx) => (
                                <Marker
                                    key={idx}
                                    coordinate={point}
                                    title={`Point ${idx + 1}`}
                                />
                            ))}
                            {props.polygonPoints.length >= 3 && (
                                <Polygon coordinates={props.polygonPoints} strokeWidth={2} strokeColor="green" fillColor="rgba(0,200,80,0.3)" />
                            )}
                        </MapView>
                    )}
                    <View className="flex-row justify-around p-4 bg-white border-t border-gray-200">
                        <TouchableOpacity onPress={() => props.setPolygonPoints([])} className="px-5 py-3 bg-red-500 rounded-lg shadow-md">
                            <Text className="text-white font-semibold">Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                if (props.polygonPoints.length < 3) {
                                    Alert.alert('Polygon Error', 'Please select at least 3 points to form a polygon.');
                                    return;
                                }
                                props.setSelectedLocation({
                                    address: props.selectedVillage
                                        ? `${props.selectedVillage}, ${props.selectedSubDistrict}, ${props.selectedDistrict}`
                                        : 'Polygon Selected',
                                    coordinates: props.polygonPoints[0],
                                    polygonCoords: props.polygonPoints,
                                });
                                props.setShowPolygonModal(false);
                            }}
                            className={`px-5 py-3 ${props.polygonPoints.length >= 3 ? 'bg-green-600' : 'bg-gray-400'} rounded-lg shadow-md`}
                            disabled={props.polygonPoints.length < 3}
                        >
                            <Text className="text-white font-semibold">Save Polygon</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.setShowPolygonModal(false)} className="px-5 py-3 bg-gray-600 rounded-lg shadow-md">
                            <Text className="text-white font-semibold">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
            {props.selectedLocation?.polygonCoords && props.selectedLocation.polygonCoords.length > 0 && (
                <View className="mt-2 bg-green-50 p-3 rounded-lg border border-green-200">
                    <Text className="font-semibold text-green-800 mb-1">Polygon Selected!</Text>
                    <Text className="font-bold text-green-800 text-md">
                        Calculated Area: {calculatePolygonArea(props.selectedLocation.polygonCoords)} m²
                    </Text>
                </View>
            )}
        </View>
    </View>
);

const Step6PricingArea = ({ values, handleChange, handleBlur, errors, setFieldValue, selectedLocation }: StepProps) => {
    useEffect(() => {
        if (selectedLocation?.polygonCoords) {
            const area = calculatePolygonArea(selectedLocation.polygonCoords, values.unit);
            setFieldValue('area', area, false);
        }
    }, [values.unit, selectedLocation?.polygonCoords, setFieldValue]);

    return (
        <View style={{ width: width, paddingHorizontal: STEP_MARGIN }}>
            <View className="bg-gray-50 p-4 rounded-md border flex gap-4 mb-4">
                <Text className="text-xl font-bold text-gray-800">6. Pricing & Area</Text>
                <View>
                    <Label text="Area" required />
                    <TextField
                        value={values.area}
                        onChangeText={handleChange('area')}
                        onBlur={handleBlur('area')}
                        placeholder="Land Area"
                        keyboardType="numeric"
                        editable={!selectedLocation?.polygonCoords}
                        className={!selectedLocation?.polygonCoords ? "border border-gray-400 rounded-md pl-4 py-2 bg-black/10" : "border border-gray-400 rounded-md pl-4 py-2 bg-gray-200"}
                    />
                    {selectedLocation?.polygonCoords && <Text className="text-xs text-blue-500 mt-1">Area auto-calculated from polygon.</Text>}
                    {errors.area && <Text className="text-red-500 text-sm">{errors.area}</Text>}
                </View>
                <View>
                    <Label text="Unit" required />
                    <View className="border border-gray-400 rounded-md bg-black/10">
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
                    {errors.unit && <Text className="text-red-500 text-sm">{errors.unit}</Text>}
                </View>
                <View>
                    <Label text="Rent Price" required />
                    <TextField
                        value={values.rentPricePerMonth}
                        onChangeText={handleChange('rentPricePerMonth')}
                        onBlur={handleBlur('rentPricePerMonth')}
                        placeholder="₹ / month"
                        keyboardType="numeric"
                    />
                    {errors.rentPricePerMonth && <Text className="text-red-500 text-sm">{errors.rentPricePerMonth}</Text>}
                </View>
            </View>
        </View>
    );
};

const Step7Photos = ({ images, setImages }: StepProps) => (
    <View style={{ width: width, paddingHorizontal: STEP_MARGIN }}>
        <View className="bg-gray-50 p-4 rounded-md flex gap-4 border mb-4">
            <Text className="text-xl font-bold text-gray-800">7. Land Photos</Text>
            <ImagePickerComponent images={images} onImagesChange={setImages} />
        </View>
    </View>
);

// ------------------ Main AddLand Form (Wizard) ------------------ //

const AddLandIndex = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const scrollRef = useRef<ScrollView>(null);
    
    // ... (All other state hooks remain, e.g., images, selectedLocation, location state, etc.)
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

    const totalSteps = 7;

    const steps = [
        { component: Step1BasicInfo, title: "Basic Info", fields: ['title', 'description'] },
        { component: Step2LandDetails, title: "Land Details", fields: ['soilType', 'waterSource'] },
        { component: Step3Availability, title: "Availability", fields: ['availabilityFrom', 'availabilityTo'] },
        { component: Step4Location, title: "Location", fields: ['district', 'subDistrict', 'village'] },
        { component: Step5PolygonMapping, title: "Polygon", fields: [] },
        { component: Step6PricingArea, title: "Pricing & Area", fields: ['area', 'unit', 'rentPricePerMonth'] },
        { component: Step7Photos, title: "Photos", fields: [] },
    ];
    
    // --- Navigation Function using ScrollView Ref ---
    const navigateStep = (step: number) => {
        if (step < 1 || step > totalSteps) return;
        
        scrollRef.current?.scrollTo({ 
            x: (step - 1) * width, 
            animated: true 
        });
        setCurrentStep(step);
    };
    // ------------------------------------------------

    // --- Side Effects (Map/Formik sync) ---
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
            } else if (selectedLocation?.coordinates) {
                 setMapRegion({
                    latitude: selectedLocation.coordinates.latitude,
                    longitude: selectedLocation.coordinates.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                });
            }
        };
        updateMapRegion();
    }, [selectedDistrict, selectedSubDistrict, selectedVillage, selectedLocation?.coordinates]);
    
    // --- Step Indicator & Buttons (Refactored) ---
    
    const StepIndicator = ({ step }: { step: number }) => (
        <View className="flex-row justify-between mx-4 my-3">
            {steps.map((s, index) => (
                <View key={index} className="flex-1 items-center">
                    <View
                        className={`w-8 h-8 rounded-full items-center justify-center border-2 
                        ${index + 1 === step ? 'bg-green-600 border-green-700' : index + 1 < step ? 'bg-green-400 border-green-500' : 'bg-gray-200 border-gray-400'}`}
                    >
                        <Text className={`font-bold ${index + 1 <= step ? 'text-white' : 'text-gray-600'}`}>{index + 1}</Text>
                    </View>
                    <Text className={`text-xs mt-1 text-center ${index + 1 === step ? 'text-green-600 font-bold' : 'text-gray-600'}`}>
                        {s.title}
                    </Text>
                </View>
            ))}
        </View>
    );

    const NextButton = ({ handleSubmit, step, currentErrors, values }: { handleSubmit: () => void, step: number, currentErrors: FormikErrors<LandFormValues>, values: LandFormValues }) => {
        const isLastStep = step === totalSteps;

        const handleNext = () => {
            // --- Custom Validation Checks ---
            if (step === 4 && (!selectedDistrict || !selectedSubDistrict || !selectedVillage)) {
                 return Alert.alert('Validation Error', 'Please select District, Sub-District, and Village.');
            }
            if (step === 5 && (!selectedLocation?.polygonCoords || selectedLocation.polygonCoords.length < 3)) {
                 return Alert.alert('Validation Error', 'Please map the land polygon (min 3 points).');
            }
            if (step === 7 && images.length === 0) {
                 return Alert.alert('Validation Error', 'Please upload at least one land photo.');
            }
            
            // --- Formik Validation Check ---
            const stepFields = steps[step - 1].fields;
            const hasFieldErrors = stepFields.some(field => currentErrors[field as keyof LandFormValues]);
            const hasMissingValues = stepFields.some(field => {
                const value = (LandFormInitialValues as any)[field as keyof LandFormValues] instanceof Date ? 
                    !(values as any)[field as keyof LandFormValues] :
                    !(values as any)[field as keyof LandFormValues]?.toString().trim()
                return (values as any)[field as keyof LandFormValues] !== undefined && value;
            });
            
            if (hasFieldErrors || hasMissingValues) {
                 return Alert.alert('Validation Error', 'Please correct all required fields before proceeding.');
            }
            // --------------------------------

            if (isLastStep) {
                handleSubmit();
            } else {
                navigateStep(step + 1);
            }
        };

        return (
            <FormButton
                text={isLastStep ? "Submit Land" : "Next"}
                onPress={handleNext}
                ButtonClassName={`w-full h-12 ${isLastStep ? 'bg-blue-600' : 'bg-green-600'} rounded-lg items-center justify-center shadow-lg`}
                TextClassName="text-white text-lg font-semibold"
            />
        );
    };

    const PrevButton = ({ step }: { step: number }) => (
        <TouchableOpacity
            onPress={() => navigateStep(step - 1)}
            className="w-1/4 h-12 bg-gray-400 rounded-lg items-center justify-center shadow-lg"
            disabled={step === 1}
        >
            <Text className="text-white text-lg font-semibold">Prev</Text>
        </TouchableOpacity>
    );

    // --------------------------------------------------------------------------

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView className="flex-1 bg-[#e8f5e9]">
                {/* Header */}
                <View className="my-6 px-4">
                    <Text className="text-3xl font-extrabold text-green-800 mb-2">Add New Land </Text>
                    <Text className="text-gray-600">Step {currentStep} of {totalSteps}: {steps[currentStep - 1].title}</Text>
                </View>

                {/* Step Indicator */}
                <StepIndicator step={currentStep} />

                <Formik<LandFormValues>
                    initialValues={LandFormInitialValues}
                    validationSchema={LandSchema}
                    onSubmit={async (values, { resetForm }) => {
                        await handleSubmit(values, selectedLocation, images);
                        resetForm();
                        navigateStep(1); // Reset to first step
                        setImages([]);
                        setSelectedDistrict('');
                        setSelectedSubDistrict('');
                        setSelectedVillage('');
                        setSelectedLocation(null);
                        setPolygonPoints([]);
                        Alert.alert("Success", "Land listed successfully!");
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit: formikSubmit, values, errors, touched, setFieldValue }) => {

                        // Auto-update Formik location fields
                        useEffect(() => {
                            setFieldValue('district', selectedDistrict, true);
                            setFieldValue('subDistrict', selectedSubDistrict, true);
                            setFieldValue('village', selectedVillage, true);
                        }, [selectedDistrict, selectedSubDistrict, selectedVillage]);

                        // Step Props for rendering
                        const stepProps: StepProps = {
                            values, errors, touched, handleChange, handleBlur, setFieldValue,
                            selectedDistrict, setSelectedDistrict, selectedSubDistrict, setSelectedSubDistrict, selectedVillage, setSelectedVillage,
                            districts, subDistricts, villages, datePicker1, setShowDatePicker1, datePicker2, setShowDatePicker2,
                            showPolygonModal, setShowPolygonModal, polygonPoints, setPolygonPoints, mapRegion, selectedLocation, setSelectedLocation,
                            images, setImages,
                        };
                        
                        return (
                            <View>
                                {/* Horizontal ScrollView for Paging */}
                                <ScrollView
                                    ref={scrollRef}
                                    horizontal
                                    pagingEnabled
                                    scrollEnabled={false} // Disable manual swipe, use buttons
                                    showsHorizontalScrollIndicator={false}
                                    onScroll={e => {
                                        const newStep = Math.round(e.nativeEvent.contentOffset.x / width) + 1;
                                        if (newStep !== currentStep) {
                                            setCurrentStep(newStep);
                                        }
                                    }}
                                    scrollEventThrottle={200}
                                >
                                    {steps.map((Step, index) => {
                                        const StepComponent = Step.component;
                                        return (
                                            // The key is the step index, ensuring correct re-rendering
                                            <StepComponent 
                                                key={index} 
                                                {...stepProps} 
                                            />
                                        );
                                    })}
                                </ScrollView>

                                {/* Navigation Buttons */}
                                <View className="flex-row justify-between items-center mt-6 gap-3 px-4 pb-12">
                                    <PrevButton step={currentStep} />
                                    <View className="flex-1">
                                        <NextButton
                                            handleSubmit={formikSubmit}
                                            step={currentStep}
                                            currentErrors={errors}
                                            values={values} 
                                        />
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddLandIndex;