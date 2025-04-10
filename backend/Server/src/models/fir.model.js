import mongoose from "mongoose";

const firSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fir:[{type:String,required:true}],
});

export const FIR = mongoose.model("FIR", firSchema);
