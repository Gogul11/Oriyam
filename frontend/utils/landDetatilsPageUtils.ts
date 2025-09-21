import axios from "axios";
import { Alert } from "react-native";
import { userStore } from "../stores/userStore";

export const handleIntrestSubmit = async(
    data: { 
        budgetPerMonth: string; 
        rentPeriod: string; 
        reason: string;
    },
    landId : string
) => {
    try {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;


        const response = await axios.post(
            `${apiUrl}/lands/interest`, 
            {...data, landId : landId}, 
            {
                headers : {
                    Authorization : `Bearer ${userStore.getState().token}`
                }
            }
        )

        if(response.status === 200){
            Alert.alert("Done", response.data.message)
        }

    } catch (error : any) {
        Alert.alert("OOPS!", error.message)
        console.log(error)
    }
}