import * as Yup from "yup"
import { Alert } from "react-native";
import axios from "axios";

export const LandSchema = Yup.object().shape({
    title: Yup.string().required('Land title is required'),
    description: Yup.string().required('Description is required'),
    area: Yup.number().positive('Area must be positive').required('Area is required'),
    unit: Yup.string().required('Unit is required'),
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
        district : '',
        subDistrict : '',
        village : ''
};

export const handleSubmit = async (
    values: any, 
    selectedLocation : { address: string; coordinates: { latitude: number; longitude: number } } | null, 
    images : string[]
) => {
    const formData = {
        ...values,
        selectedLocation,
        land_photos: images,
        area: parseFloat(values.area),
    };
    
    console.log('Form Data:', formData);
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    // try {
       
    //     const response = await axios.post(`${apiUrl}/lands/add`, formData);
    //     console.log(response.data, apiUrl);

    //     Alert.alert('Success', 'Land submitted !');

    // } catch (error) {
    //     Alert.alert('Error', 'Error in registering');
    //     console.log(error)
    // }

};



    