import { Request, Response } from "express";

export const addLandContoller = (
    req : Request,
    res : Response
) => {
    try {
        console.log(req.body)
        return res.status(200).json({success : "hi"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error registering user" });
    }
}