// profileController.ts
import * as profileServices from "../services/profileServices";

export const getProfile = async (req:any, res:any) => {
  try {
    if(!req.token){
      console.log("token not avl - profController")
      return res.status(403).json({success : 'Please login again'})
    }
    const userId = req.token.id; // verifyToken should attach user info
    const profile = await profileServices.getProfileByUserId(userId);
    res.status(200).json(profile);
  } catch (err:any) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: err.message });
  }
};
