import axios from 'axios';
import FormData from 'form-data';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

const pinataApiKey = process.env.PINATA_API_IKEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

const pinataBaseUrl = process.env.PINATA_BASE_URL;

const gatewayUrl = process.env.GaTEWAY_URL;

export async function uploadToPinata(file, contactNumber){
    const formData = new FormData();

    if(!contactNumber){
        contactNumber = "default-contact-number";
    }

    if (!file || !file.buffer || !file.originalname) {
        throw new Error("Invalid file input");
    }

    const pinataMetadata = {
        name: `${contactNumber}-${file.originalname}`,
        keyvalues: {
            exampleKey: "exampleValue"
        }
    };

    formData.append("file", file.buffer, file.originalname);
    formData.append("pinataMetadata", JSON.stringify(pinataMetadata));
    
    try {
        const response = await axios.post(pinataBaseUrl, formData, {
            maxBodyLength: Infinity,
            headers: {
                ...formData.getHeaders(),
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            }
        });
        if (response.status !== 200) {
            throw new Error(`Error uploading to Pinata: ${response.statusText}`);
        }
        console.log(`File uploaded to Pinata: ${response.data.IpfsHash}`);
        return `${gatewayUrl}/${response.data.IpfsHash}`;
    } catch (error) {
        console.error("Error uploading to Pinata:", error);
        throw error;
    }
}