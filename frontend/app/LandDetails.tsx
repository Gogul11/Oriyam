import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, Image, useWindowDimensions, StyleSheet, TouchableOpacity, Platform } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { useRoute, RouteProp } from '@react-navigation/native';
import { type Land } from '../utils/viewLandsPageUtils';
import CustomButton from '../components/button';
import InterestForm from '../components/intrestForm';
import { handleIntrestSubmit } from '../utils/landDetatilsPageUtils';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
    Search: undefined;
    LandDetails: { land: Land };
};

type LandDetailsRouteProp = RouteProp<RootStackParamList, 'LandDetails'>;

// Enhanced Detail Row Component
const DetailRow = ({ label, value, iconName }: { label: string; value: string | number; iconName: keyof typeof Ionicons.glyph }) => (
    <View style={styles.detailRow}>
        <View style={styles.detailRowLeft}>
            <Ionicons name={iconName} size={18} color="#388e3c" style={{ marginRight: 10 }} />
            <Text style={styles.detailLabel}>{label}</Text>
        </View>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const LandDetails = () => {
    const route = useRoute<LandDetailsRouteProp>();
    const { land } = route.params;
    const { width } = useWindowDimensions();
    const mapRef = useRef<MapView | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    
    // State is only set to null for now, not used directly in render
    const [submittedData, setSubmittedData] = useState<any>(null); 
    
    // Function to handle map zoom/centering
    useEffect(() => {
        if (land.coordinates.length > 0 && mapRef.current) {
            // Give map time to render, then fit to polygon coordinates
            const timeout = setTimeout(() => {
                 mapRef.current?.fitToCoordinates(land.coordinates, {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                });
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [land.coordinates]);


    const handleInterestPress = (data: any, landId: string) => {
        handleIntrestSubmit(data, landId);
        setModalVisible(false);
        // Add alert for user feedback
        alert('Interest submitted successfully!');
    }

    return (
        <ScrollView style={styles.container}>
            {/* Image Carousel with Pagination Indicator (No change in component, relying on new styles) */}
            <FlatList
                data={land.photos}
                keyExtractor={(photoUrl) => photoUrl}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.imageCarousel}
                renderItem={({ item: photoUrl }) => (
                    <Image
                        source={{ uri: photoUrl || 'https://via.placeholder.com/400x240?text=Land+Photo' }}
                        style={{ width: width, height: 260 }} // Increased height for better view
                        resizeMode="cover"
                    />
                )}
                // Fallback for no photos
                ListEmptyComponent={<Image source={{uri: 'https://via.placeholder.com/400x240?text=No+Images'}} style={{ width: width, height: 260 }} resizeMode="cover" />}
            />

            <View style={styles.contentArea}>
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Text style={styles.title}>{land.title}</Text>
                    <View style={styles.locationContainer}>
                        <Ionicons name="map-outline" size={18} color="#6B7280" />
                        <Text style={styles.locationText}>
                            {`${land.village}, ${land.subDistrict}, ${land.district}`}
                        </Text>
                    </View>
                    <Text style={styles.price}>{`₹${Number(land.rentPricePerMonth).toLocaleString('en-IN')}/month`}</Text>
                </View>
                
                {/* Status Badge */}
                <View style={[styles.statusBadge, land.status ? styles.statusAvailable : styles.statusUnavailable]}>
                    <Text style={styles.statusText}>
                        {land.status ? 'AVAILABLE' : 'RENTED'}
                    </Text>
                </View>

                {/* Description Card */}
                <View style={styles.card}>
                    <Text style={styles.cardHeading}>Description</Text>
                    <Text style={styles.descriptionText}>{land.description}</Text>
                </View>

                {/* Property Details Card */}
                <View style={styles.card}>
                    <Text style={styles.cardHeading}>Property Details</Text>
                    <DetailRow label="Area" value={`${land.area} ${land.unit}`} iconName="resize-outline" />
                    <DetailRow label="Soil Type" value={land.soilType} iconName="leaf-outline" />
                    <DetailRow label="Water Source" value={land.waterSource} iconName="water-outline" />
                    <DetailRow label="Available From" value={land.availabilityFrom} iconName="calendar-outline" />
                    <DetailRow label="Available To" value={land.availabilityTo} iconName="calendar-sharp" />
                    <DetailRow label="Status" value={land.status ? 'Available' : 'Not Available'} iconName={land.status ? "checkmark-circle-outline" : "close-circle-outline"} />
                </View>

                {/* Map Section */}
                <View style={[styles.card, styles.mapContainer]}>
                    <Text style={styles.cardHeading}>    Land Boundary</Text>
                    <View style={styles.mapViewWrapper}>
                        <MapView
                            ref={mapRef}
                            style={styles.mapView}
                            initialRegion={{
                                latitude: land.coordinates[0]?.latitude || 13.0827,
                                longitude: land.coordinates[0]?.longitude || 80.2707,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                            scrollEnabled={true}
                            zoomEnabled={true}
                        >
                            {land.coordinates.length >= 3 && (
                                <Polygon
                                    coordinates={land.coordinates}
                                    strokeColor="#2e7d32"
                                    fillColor="rgba(76, 175, 80, 0.3)"
                                    strokeWidth={3}
                                />
                            )}
                            {land.coordinates.length > 0 && (
                                <Marker
                                    coordinate={land.coordinates[0]}
                                    title={land.title}
                                />
                            )}
                        </MapView>
                    </View>
                </View>
                
                {/* Show Interest Button */}
                <View style={{ marginBottom: 40, marginTop: 10 }}>
                    <InterestForm
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        onSubmit={(data) => handleInterestPress(data, land.landId)}
                    />
                    <CustomButton
                        text="Show Interest"
                        onPress={() => setModalVisible(true)}
                        ButtonClassName="bg-green-700 w-full py-3 rounded-xl"
                        TextClassName="text-white text-center text-lg font-bold"
                    />
                </View>
            </View>
        </ScrollView>
    );
};

// --- Stylesheet ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0FFF0', // Very light green/off-white background
    },
    imageCarousel: {
        height: 260,
        backgroundColor: '#E8F5E9',
        borderBottomWidth: 5,
        borderBottomColor: '#388e3c',
    },
    contentArea: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    headerSection: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1B5E20', // Dark green header
        marginBottom: 5,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    locationText: {
        fontSize: 16,
        color: '#6B7280',
        marginLeft: 5,
        fontWeight: '500',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#388e3c', // Green for price emphasis
        marginTop: 5,
    },
    descriptionText: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 24,
        marginTop: 5,
    },
    // Card Styles
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E8F5E9',
        // Shadow for lift
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
            android: { elevation: 5 },
        }),
    },
    cardHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1B5E20',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 5,
    },
    // Detail Row Styles
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    detailRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
    },
    detailLabel: {
        fontSize: 16,
        color: '#4B5563',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'right',
        marginLeft: 10,
    },
    // Map Styles
    mapContainer: {
        padding: 0,
        paddingTop: 15,
    },
    mapViewWrapper: {
        height: 300,
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 10,
    },
    mapView: {
        flex: 1,
    },
    // Status Badge
    statusBadge: {
        position: 'absolute',
        top: 0,
        right: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        zIndex: 10,
        transform: [{ translateY: -15 }], // Lift it slightly above the content
    },
    statusAvailable: {
        backgroundColor: '#388e3c', // Green
    },
    statusUnavailable: {
        backgroundColor: '#D97706', // Amber/Orange
    },
    statusText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    }
});

export default LandDetails;