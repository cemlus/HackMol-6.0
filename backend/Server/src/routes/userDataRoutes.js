import express from 'express';
import bodyParser from "body-parser";
import { authenticateToken, generateJwtToken, generateRefreshToken } from '../middleware/authMiddleware.js';
import { User } from '../models/user.model.js';


const app = express();
const router = express.Router();
app.use(bodyParser.json());

router.get('/getUserData', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user ID is stored in the token
        const user = await User.findById(userId).select('-password'); // Exclude password from response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/updateUserData', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user ID is stored in the token
        const { name, email, address,phone } = req.body; // Extract fields to update

        const updatedUser = await User.findByIdAndUpdate(userId, { name, email,address,phone }, { new: true }).select('-password'); // Exclude password from response

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getLocation', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user ID is stored in the token
        const user = await User.findById(userId).select('location'); // Only select location field

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.location);
    } catch (error) {
        console.error('Error fetching user location:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
