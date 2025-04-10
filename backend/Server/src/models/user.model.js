import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    signatureUrl: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "police", "admin"],
        default: "user",
        required: true
    },
    policeStationAddress: {
        type: String,
        required: function () {
            return this.role === "police";
        }
    },
    district: {
        type: String,
        required: function () {
            return this.role === "police";
        }
    },
    // firs: [{ type: mongoose.Schema.Types.ObjectId, ref: "FIR" }]
});


export const User = mongoose.model("User", userSchema);