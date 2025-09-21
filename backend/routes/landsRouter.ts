import { Router } from "express";
import { addLandContoller } from "../controllers/landsController";
import multer from "multer";
import { S3 } from "../db/cloudFlare";
import { PutObjectCommand } from "@aws-sdk/client-s3";
const landsRouter = Router();

landsRouter.get("/", (req, res) => {
    res.send("HI")
})

landsRouter.post("/add", addLandContoller)

// const upload = multer({ storage: multer.memoryStorage() }); // keeps file in RAM

// landsRouter.post("/addPhoto", upload.single("photo"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const bucket = "lands-images"; // your bucket name
//     const key = `uploads/${Date.now()}-${req.file.originalname}`;

//     await S3.send(
//       new PutObjectCommand({
//         Bucket: bucket,
//         Key: key,
//         Body: req.file.buffer,
//         ContentType: req.file.mimetype,
//       })
//     );

//     // If you want to serve via public URL:
//     const publicUrl = `https://${bucket}.${process.env.CLOUDFLARE_END_POINT}/${key}`;

//     res.json({ message: "Upload successful", key, url: publicUrl });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ error: "Upload failed" });
//   }
// })

export default landsRouter;