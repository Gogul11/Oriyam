import { Request, Response } from "express";
import * as interestService from "../services/interestServices";

export const getInterests = async (req: Request, res: Response) => {
  try {
    const { landId } = req.params;

    if (!landId) {
      return res.status(400).json({ error: "landId is required" });
    }

    const interests = await interestService.getLandInterestsByLandId(landId);

    return res.status(200).json(interests);
  } catch (err: any) {
    console.error("Controller error:", err.message);
    res.status(500).json({ error: "Failed to fetch interests" });
  }
};