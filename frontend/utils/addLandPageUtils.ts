import * as Yup from "yup"
import { Alert } from "react-native";
import axios from "axios";

export const LandSchema = Yup.object().shape({
    title: Yup.string().required('Land title is required'),
    description: Yup.string().required('Description is required'),
    area: Yup.number().positive('Area must be positive').required('Area is required'),
    unit: Yup.string().required('Unit is required'),
    location: Yup.string().required('Location is required'),
    soilType: Yup.string().required('Soil type is required'),
    waterSource: Yup.string().required('Water source is required'),
    rentPrice: Yup.number().positive('Rent price must be positive').required('Rent price is required'),
    availabilityFrom: Yup.date().required('Start date is required'),
    availabilityTo: Yup.date().required('End date is required'),
});

export const LandFormInitialValues = {
        title: '',
        description: '',
        area: '',
        unit: '',
        location: '',
        soilType: '',
        waterSource: '',
        availabilityFrom: new Date(),
        availabilityTo: new Date(),
        rentPrice: '',
};

export const handleSubmit = async (
    values: any, 
    selectedLocation : { address: string; coordinates: { latitude: number; longitude: number } } | null, 
    images : string[]
) => {
    const formData = {
        ...values,
        latitude: selectedLocation?.coordinates.latitude,
        longitude: selectedLocation?.coordinates.longitude,
        land_photos: images,
        rent_price_per_month: parseFloat(values.rentPrice),
        area: parseFloat(values.area),
    };
    
    console.log('Form Data:', formData);

    try {
        await axios.post('/lands/add')
        Alert.alert('Success', 'Land submitted !');

    } catch (error) {
        Alert.alert('Error', 'Error in registering');
    }

};



    