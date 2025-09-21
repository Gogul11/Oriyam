import axios from "axios"
import { userStore } from "../stores/userStore";

export type Land = {
  landId: string;
  userId: string;
  title: string;
  description: string;
  area: number;
  unit: "string"
  Coordinates: { latitude: number; longitude: number };
  soilType: string;
  waterSource: string;
  district : string;
  subDistrict : string;
  village : string;
  availabilityFrom: string;
  availabilityTo: string;
  rentPricePerMonth: number;
  status: boolean;
  photos: string[];
};

export const fetchLands = async(
    setLands : (lands : Land[]) => void
) => {
    try {
        if(!userStore.getState().token){
            return null;
        }
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        
        const res = await axios.get(
            `${apiUrl}/lands/view`, 
            {
                headers : {
                    Authorization : `Bearer ${userStore.getState().token}`
                }
            }
        )

        if(res.status === 200 && res.data.success === 1){
            console.log(res.data.lands)
            setLands(res.data.lands)
        }

        return null
    } catch (error : any) {
        console.log(error, error.message)        
        return null
    }
}