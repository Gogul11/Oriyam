import * as Yup from "yup"
import { Alert } from "react-native";
import axios from "axios";
import { userStore } from "../stores/userStore";

export const LandSchema = Yup.object().shape({
    title: Yup.string().required('Land title is required'),
    description: Yup.string().required('Description is required'),
    area: Yup.number().positive('Area must be positive').required('Area is required'),
    unit: Yup.string().required('Unit is required'),
    soilType: Yup.string().required('Soil type is required'),
    waterSource: Yup.string().required('Water source is required'),
    rentPricePerMonth: Yup.number().positive('Rent price must be positive').required('Rent price is required'),
    availabilityFrom: Yup.date().required('Start date is required'),
    availabilityTo: Yup.date().required('End date is required'),
});

export const LandFormInitialValues = {
        title: '',
        description: '',
        area: '',
        unit: '',
        soilType: '',
        waterSource: '',
        availabilityFrom: new Date(),
        availabilityTo: new Date(),
        rentPricePerMonth: '',
        district : '',
        subDistrict : '',
        village : ''
};

export const handleSubmit = async (
    values: any, 
    selectedLocation : { address: string;
        coordinates: { latitude: number; longitude: number };
        polygonCoords?: { latitude: number; longitude: number }[];
    } | null, 
    images : string[]
) => {
    const formData = new FormData()

    formData.append("title", values.title)
    formData.append("description", values.description)
    formData.append("area", values.area)
    formData.append("unit", values.unit)
    formData.append("rentPricePerMonth", values.rentPricePerMonth)
    formData.append("soilType", values.soilType)
    formData.append("waterSource", values.waterSource)
    formData.append("availabilityFrom", values.availabilityFrom.toISOString())
    formData.append("availabilityTo", values.availabilityTo.toISOString())
    formData.append("district", values.district)
    formData.append("subDistrict", values.subDistrict)
    formData.append("village", values.village)

    if (selectedLocation?.polygonCoords) {
        formData.append(
            "coordinates",
            JSON.stringify(selectedLocation.polygonCoords)
        );
    }

    images.forEach((uri, index) => {
        const fileName = uri.split("/").pop() || `photo-${index}.jpg`;
        console.log(fileName)
        formData.append("photos", {
            uri,
            name: fileName,
            type: "image/jpeg",
        } as any);
    });
 
    console.log('Form Data:', formData);
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    try {
       
        const response = await axios.post(`${apiUrl}/lands/add`, formData, {
            headers : {
                Authorization : `Bearer ${userStore.getState().token}`,
                "Content-Type" : "multipart/form-data"
            }
        });
        console.log(response.data, apiUrl);

        if(response.status === 200)
            Alert.alert('Success', response.data.message);
        else
            Alert.alert('', response.data.message);
    } catch (error : any) {
        Alert.alert("OOPS!", error.message)
        console.log(error)
    }

};



    