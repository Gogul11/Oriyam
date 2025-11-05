import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, useWindowDimensions, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { fetchLands, type Land } from '../../utils/viewLandsPageUtils';

// --- Type Definitions (Assuming Land interface has the necessary fields) ---
type RootStackParamList = {
    Search: undefined;
    LandDetails: { land: Land };
};

// --- Component Implementation ---

const SearchLandScreen = () => {
    const [search, setSearch] = useState('');
    const [allLands, setAllLands] = useState<Land[]>([]);
    const [filteredLands, setFilteredLands] = useState<Land[]>([]);
    const [loading, setLoading] = useState(true);
    
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { width } = useWindowDimensions();
    const cardWidth = width - 32;

    // Fetch initial data
    useEffect(() => {
        setLoading(true);
        fetchLands(setAllLands)
            .finally(() => setLoading(false));
    }, []);

    // Filtering Logic
    useEffect(() => {
        if (!search) {
            setFilteredLands(allLands);
            return;
        }

        const lowerCaseSearch = search.toLowerCase();
        
        const results = allLands.filter(
            (land) =>
                land.title.toLowerCase().includes(lowerCaseSearch) ||
                land.district.toLowerCase().includes(lowerCaseSearch) ||
                land.subDistrict.toLowerCase().includes(lowerCaseSearch) ||
                land.village.toLowerCase().includes(lowerCaseSearch) ||
                land.soilType.toLowerCase().includes(lowerCaseSearch)
        );
        setFilteredLands(results);
    }, [search, allLands]);
    
    // --- Render Functions ---

    const renderLandCard = ({ item }: { item: Land }) => {
        const isAvailable = item.status;
        
        // Determine location display for search feedback
        const locationText = 
            `${item.village || ''}, ${item.subDistrict || ''}, ${item.district || ''}`;

        return (
            <View style={styles.cardContainer}>
                {/* Photo Carousel (FlatList nested for image gallery) */}
                <FlatList
                    data={item.photos}
                    keyExtractor={(photoUrl, index) => `${item.landId}-${index}`}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item: photoUrl }) => (
                        <Image
                            source={{ uri: photoUrl || 'https://via.placeholder.com/400x160?text=No+Image' }}
                            style={{ width: cardWidth, height: 180 }} // Increased height slightly
                            resizeMode="cover"
                        />
                    )}
                    ListEmptyComponent={<Image source={{uri: 'https://via.placeholder.com/400x160?text=No+Image'}} style={{ width: cardWidth, height: 180 }} />}
                />
                
                {/* Status Badge */}
                <View style={styles.badgeContainer}>
                    <Text 
                        style={[
                            styles.badge, 
                            isAvailable ? styles.badgeAvailable : styles.badgeUnavailable
                        ]}
                    >
                        {isAvailable ? 'Available' : 'Rented'}
                    </Text>
                </View>

                {/* Details Section */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('LandDetails', { land: item })}
                >
                    <View className="p-4">
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        
                        <View style={styles.infoRow}>
                             <Ionicons name="location-outline" size={16} color="#4B5563" style={{ marginRight: 4 }} />
                            <Text style={styles.cardSubtitle} numberOfLines={1}>{locationText}</Text>
                        </View>
                        
                        <View style={styles.infoRow}>
                            <Ionicons name="resize-outline" size={16} color="#4B5563" style={{ marginRight: 4 }} />
                            <Text style={styles.cardSubtitle}>{`${item.area} ${item.unit}`}</Text>
                        </View>
                        
                        <View style={styles.infoRow}>
                            <Ionicons name="leaf-outline" size={16} color="#4B5563" style={{ marginRight: 4 }} />
                            <Text style={styles.cardSubtitle}>Soil: {item.soilType}</Text>
                        </View>

                        <Text style={styles.cardPrice}>
                            {`₹${Number(item.rentPricePerMonth).toLocaleString('en-IN')}/month`}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };
    
    // --- Main Render ---

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#10B981" />
                <Text style={styles.loadingText}>Fetching lands...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Search Input with Icon */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search by location, soil, or name"
                    placeholderTextColor="#9CA3AF"
                />
            </View>
            
            {/* Land List */}
            <FlatList
                data={filteredLands}
                keyExtractor={(item) => item.landId}
                renderItem={renderLandCard}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="close-circle-outline" size={40} color="#EF4444" />
                        <Text style={styles.emptyText}>
                            {search ? `No results found for "${search}".` : 'No lands are available yet.'}
                        </Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

// --- Stylesheet ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8f5e9', // Light green background for the page
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    // Search Bar Styles
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
        paddingHorizontal: 10,
        height: 50,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    // Card Styles
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        // Enhanced Shadow
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
    },
    // Badge Styles
    badgeContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 0.5,
        color: 'white',
    },
    badgeAvailable: {
        backgroundColor: '#10B981', // Green-500
    },
    badgeUnavailable: {
        backgroundColor: '#F59E0B', // Amber-500
    },
    // Text and Info Styles
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#4B5563',
    },
    cardPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#059669', // Stronger green for price
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 8,
    },
    // State Styles
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7FEE7',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#4B5563',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
        padding: 20,
        backgroundColor: '#FEF2F2',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FCA5A5',
    },
    emptyText: {
        marginTop: 10,
        fontSize: 18,
        color: '#EF4444',
        textAlign: 'center',
    },
});

export default SearchLandScreen;