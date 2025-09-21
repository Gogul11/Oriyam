import { S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
dotenv.config();

let S3 : S3Client;
const initCloudFlare = async () => {
    try {
        if (!process.env.CLOUDFLARE_END_POINT ||
        !process.env.ACCESS_KEY_ID ||
        !process.env.SECRET_ACCESS_KEY) 
        {
            throw new Error("Missing Cloudflare R2 environment variables");
        }

        S3 = new S3Client({
            region : "auto",
            endpoint : process.env.CLOUDFLARE_END_POINT,
            credentials : {
                accessKeyId : process.env.ACCESS_KEY_ID!,
                secretAccessKey : process.env.SECRET_ACCESS_KEY!
            },
        })


        const data = await S3.send(new HeadBucketCommand({ Bucket: process.env.BUCKET_NAME }));
        console.log("CloudFlare connected!")
    } catch (error) {
        console.error("CloudFlare connection failed:", error);
        process.exit(1);
    }
}

export {initCloudFlare, S3}