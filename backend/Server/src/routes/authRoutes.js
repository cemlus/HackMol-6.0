import express from 'express';
import bodyParser from "body-parser";
import bcrypt from 'bcrypt';
import { authenticateToken, generateJwtToken, generateRefreshToken } from '../middleware/authMiddleware.js';
// import { userRegistrationSchema } from '../schemas/user.schema.js';
import { User } from '../models/user.model.js';
import { FIR } from '../models/fir.model.js';
// import sendMail from '../utils/email.js'; 
import dotenv from "dotenv";
import { logger } from '../../app.js';  // Adjust the path to app.js
import questions from "../questions/questions.js";
import multer from "multer";
import cloudinary from "cloudinary";

dotenv.config();
cloudinary.config({ 
    cloud_name: "dicsxtvo5", 
    api_key: "695662827553358", 
    api_secret: "N7eChks-_HscnXxM7xANnjaNR6A"
  });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); 

const app = express();
const router = express.Router();
app.use(bodyParser.json());

const signUpQue = [];
let signUpIsLocked = false;
let currentSignUp = [];

router.post('/signup', upload.single("signature"), async (req, res) => {
    res.clearCookie("G_ENABLED_IDPS");
    console.log(req.body)
    const userReq = req.body;
    const file = req.file;
    
    if (!file) {
        return res.status(400).json({ error: "Signature file is required" });
    }

    try {
        const uploadResponse = await cloudinary.v2.uploader.upload_stream({
            folder: "signatures",
            resource_type: "image"
        }, async (error, result) => {
            if (error) {
                return res.status(500).json({ error: "Error uploading signature" });
            }

            userReq.signatureUrl = result.secure_url;
            if (signUpIsLocked) {
                signUpQue.push(userReq);
            } else {
                signUpIsLocked = true;
                currentSignUp.push(userReq);
                const result = await signUp(userReq);
                res.json(result);
            }

            while (signUpQue.length > 0) {
                const next_data = signUpQue.shift();
                const result_qued = await signUp(next_data);
                res.json(result_qued);
            }

            signUpIsLocked = false;
        });
        uploadResponse.end(file.buffer);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
async function signUp(userData) {
    try {
        console.log(userData);
        const timestamp = new Date().toISOString();
        console.log(`Request from ${userData.ip} on /signup route at ${timestamp}`);
        
        const existingUser = await User.findOne({ email: userData.email });
        if (!userData.name || !userData.email || !userData.password || !userData.phone || !userData.address || !userData.signatureUrl) {
            return { err: "Fill all details" };
        } else if (existingUser) {
            return { err: "Email already has an account associated with it, please login" };
        } 
        
        const hash = await bcrypt.hash(userData.password, 10);

        const newUser = await User.create({
            username: userData.name,
            email: userData.email,
            password: hash,
            phone: userData.phone,
            address: userData.address,
            signatureUrl: userData.signatureUrl,
            role: "user",
        });

        // Create corresponding empty FIR document linked to the new user
        const firRecord = await FIR.create({
            user: newUser._id,
            fir: []
        });

        return { redirect: "login" };
    } catch (error) {
        console.error("Signup error:", error);
        return { error: error.message || "Invalid data" };
    }
}

const policeSignUpQue = [];
let policeSignUpIsLocked = false;
let policeCurrentSignUp = [];
router.post('/policesignup', upload.single("signature"), async (req, res) => {
    res.clearCookie("G_ENABLED_IDPS");
    console.log(req.body)
    const userReq = req.body;
    const file = req.file;
    // console.log(file)
    
    if (!file) {
        return res.status(400).json({ error: "Signature file is required" });
    }

    try {
        const uploadResponse = await cloudinary.v2.uploader.upload_stream({
            folder: "signatures",
            resource_type: "image"
        }, async (error, result) => {
            if (error) {
                console.error("Cloudinary upload error:", error);
                return res.status(500).json({ error: "Error uploading signature" });
            }

            userReq.signatureUrl = result.secure_url;
            console.log(userReq.signatureUrl)
            if (policeSignUpIsLocked) {
                policeSignUpQue.push(userReq);
            } else {
                policeSignUpIsLocked = true;
                policeCurrentSignUp.push(userReq);
                const result = await policesignUp(userReq);
                res.json(result);
            }

            while (policeSignUpQue.length > 0) {
                const next_data = policeSignUpQue.shift();
                const result_qued = await policesignUp(next_data);
                res.json(result_qued);
            }

            policeSignUpIsLocked = false;
        });
        uploadResponse.end(file.buffer);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
async function policesignUp(userData) {
    try {
        console.log(userData);
        const timestamp = new Date().toISOString();
        console.log(`Request from ${userData.ip} on /signup route at ${timestamp}`);
        
        const existingUser = await User.findOne({ email: userData.email });
        if (!userData.name || !userData.email || !userData.password || !userData.phone || !userData.address || !userData.signatureUrl) {
            return { err: "Fill all details" };
        } else if (existingUser) {
            return { err: "Email already has an account associated with it, please login" };
        } 
        
        const hash = await bcrypt.hash(userData.password, 10);

        const newUser = await User.create({
            username: userData.name,
            email: userData.email,
            password: hash,
            phone: userData.phone,
            address: userData.address,
            signatureUrl: userData.signatureUrl,
            policeStationAddress: userData.policeStationAddress,
            district: userData.district,
            role: "police",
        });

        // Create corresponding empty FIR document linked to the new user
        const firRecord = await FIR.create({
            user: newUser._id,
            fir: []
        });

        return { redirect: "login" };
    } catch (error) {
        console.error("Signup error:", error);
        return { error: error.message || "Invalid data" };
    }
}


router.post('/login', async (req, res) => {
    res.clearCookie("G_ENABLED_IDPS");
    console.log(req.body);

    try {
        // const userData = userLoginSchema.parse(req.body);
        const timestamp = new Date().toISOString();
        console.log(`Request from ${req.ip} on /login route at ${timestamp} on port ${req.socket.localPort}`);
        // logger.info(`Request from ${req.ip} on /login route at ${timestamp}`);
        const userData = req.body;

        const user = await User.findOne({ email: userData.email });

        // Empty field check
        if (Object.values(userData).includes("")) {
            console.log("Empty field check failed");
            return res.json({ err: "Fill all details" });
        }

        // No user or team found
        else if (!user ) {
            return res.json({ err: "Invalid Details" });
        }

        else{
            bcrypt.compare(userData.password, user.password, (err, result) => {
                if (result) {
                    const accessToken = generateJwtToken({ _id: user._id ,email:user.email,role:user.role});
                    const refreshToken = generateRefreshToken({ _id: user._id,email:user.email,role:user.role});
                    res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "Lax" });
                    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "Lax" });
                    if(user.role==="police"){
                        console.log("Police login successful")
                        res.json({ redirect: "dashboardPolice" });
                    }else{
                        console.log("User login successful")
                        res.json({ redirect: "dashboard" });
                    }
                } else {
                    console.error(err);
                    res.json({ err: "Invalid Details" });
                }
            });
        }

        // Password comparison
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ error: error.errors || 'Invalid data' });
    }
    
});

router.post('/mallard/admin/signup', async (req, res) => {
    res.clearCookie("G_ENABLED_IDPS");
    const userReq = req.body
    if (signUpIsLocked) {
            signUpQue.push(userReq);
    }
    else{
        signUpIsLocked = true;
        currentSignUp.push(userReq);
        const result = await signUp(userReq);
        res.json(result);
    }

    while (signUpQue.length > 0) {
        const next_data = signUpQue.shift();
        const result_qued = await signUp(next_data);
        res.json(result_qued);
    }

    signUpIsLocked = false;

    
    async function signUp(userData){
        try {
            // const userData = userRegistrationSchema.parse(req.body);
            console.log(userData)
            const timestamp = new Date().toISOString();
            console.log(`Request from ${req.ip} on /signup route at ${timestamp} on port ${req.socket.localPort}`);
            // logger.info(`Request from ${req.ip} on /signup route at ${timestamp}`);
            const existingUser = await User.findOne({ email: userData.lMail });
    
            if (Object.values(userData).includes("")) {
                return { err: "Fill all details" };
            }
    
            else if (existingUser) {
                return { err: 'email already has an account associated with it, please login' };
            }
    
            else{
                const hash = await bcrypt.hash(userData.lPassword, 10);

                const newUser = await User.create({
                    username: userData.lName,
                    email: userData.lMail,
                    password: hash,
                    role:"admin",
                    teamName:userData.lTeamName
                });

                const team = await Team.findOne({teamName:newUser.teamName});
                if(!team){
                    const existingTeams = await Team.countDocuments();
                    const assignedSet = (existingTeams % 3) + 1; // Distribute across 5 sets

                    const newTeam = new Team({
                        teamName:newUser.teamName,
                        questionSet: assignedSet,
                        questions: questions[`set${assignedSet}`] // Correct way to access question set
                    });

                    await newTeam.save();
                }

        
                // await sendMail(userData.lName, userData.lMail);
    
                return { redirect: 'login' };
    
            }
    
        }
        catch (error) {
            console.error('Signup error:', error);
            res.status(400).json({ error: error.errors || 'Invalid data' });
        }
    }
});

router.get("/checkAuth", authenticateToken, (req, res) => {
    res.json({ authenticated: true,role:req.user.role });
    const timestamp = new Date().toISOString();
    console.log(`Request from ${req.ip} on /checkAuth route at ${timestamp} on port ${req.socket.localPort}`);
    // logger.info(`Request from ${req.ip} on /checkAuth route at ${timestamp}`);
});

router.get("/checkAdmin", authenticateToken, (req, res) => {
    if(req.user.role==="admin"){
        res.json({ authenticated: true });
    }else{
        res.json({ authenticated: false });
    }
    const timestamp = new Date().toISOString();
    console.log(`Request from ${req.ip} on /checkAuth route at ${timestamp} on port ${req.socket.localPort}`);
    // logger.info(`Request from ${req.ip} on /checkAuth route at ${timestamp}`);
});

router.post("/logout", (req, res) => {
    // Clear the authentication token or session here
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logout successful" });
    
});

export default router;