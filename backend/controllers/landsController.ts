import { Request, Response } from "express";
import { db } from "../db/connection";
import { land } from "../db/schema/land";
import multer from "multer";
import { S3 } from "../db/cloudFlare";
import { PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv'
dotenv.config()


export const addLandContoller = async (
    req : Request,
    res : Response
) => {
    try {
        if(!req.token){
            console.log("Please provide token from land controller")
            return res.status(403).json({success : 'Please login again'})
        }


        if(!req.files){
            console.log("No files uploaded")
            return res.status(202).json({ error: "No files uploaded" });
        }

        const files = req.files as Express.Multer.File[]
        const photoKeys = []
        const Bucket = process.env.BUCKET_NAME

        for(const file of files){
            const key = `uploads/${req.token.id}/${Date.now()}-${file.originalname}`

            try {    
                await S3.send(
                    new PutObjectCommand({
                        Bucket: Bucket,
                        Key: key,
                        Body: file.buffer,
                        ContentType: file.mimetype,
                    })
                );

                const publicUrl = `${process.env.CLOUDFLARE_IMAGE_END_POINT}/${key}`

                photoKeys.push(publicUrl)
            } catch (error) {
                console.log("Error in uploading Images", error)
                if(photoKeys.length > 0){
                     await S3.send(
                        new DeleteObjectsCommand({
                            Bucket: Bucket,
                            Delete: {
                                Objects: photoKeys.map((k) => ({ Key: k })),
                            }
                        })
                    )
                }

                return res.status(500).json({ 
                    success: false, 
                    error: "Failed to upload images to cloud storage" 
                });
            }

        }
        
        const formData = {...req.body, status : true, userId : req.token.id, photos : photoKeys}
        
        console.log(formData)
        console.log("Token : ", req.token)

        const [newLand] = await db.insert(land).values(formData).returning()

        if(!newLand){
            await S3.send(
                new DeleteObjectsCommand({
                    Bucket: Bucket,
                    Delete: {
                        Objects: photoKeys.map((k) => ({ Key: k })),
                    }
                })
            )
            return res.status(500).json({message : "Land registration failed"})
        }

        return res.status(200).json({success : 1, message : "Land successfully registered!"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error registering Land" });
    }
}