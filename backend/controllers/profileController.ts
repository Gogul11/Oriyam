// profileController.ts
import * as profileServices from "../services/profileServices";

// Get profile
export const getProfile = async (req: any, res: any) => {
  try {
    if (!req.token) {
      console.log("token not available - profileController");
      return res.status(403).json({ success: 'Please login again' });
    }

    const userId = req.token.id; // verifyToken attaches user info
    const profile = await profileServices.getProfileByUserId(userId);
    res.status(200).json(profile);
  } catch (err: any) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update profile
export const updateProfile = async (req: any, res: any) => {
  try {
    if (!req.token) {
      return res.status(403).json({ success: 'Please login again' });
    }

    const userId = req.token.id;
    const { username, email, mobile, age, dateofbirth } = req.body;

    const updatedProfile = await profileServices.updateProfileByUserId(userId, {
      username,
      email,
      mobile,
      age,
      dateofbirth,
    });

    res.status(200).json(updatedProfile);
  } catch (err: any) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: err.message });
  }
};
