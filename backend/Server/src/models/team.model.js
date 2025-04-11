import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    teamName: { type: String, required: true, unique: true },
    currentScore:{type:Number,required:true,default:0},
    questionSet: { type: Number, required: true },
    questions :[{
        location: {type:String,required:true},
        riddle: {type:String,required:true},
        riddleAnswer: {type:String,required:true},
        riddleStatus:{ type: String, enum: ["pending", "completed"], default: "pending" } ,
        offlineTask: {type:String,required:true},
        offlineTaskCode:{type:String,required:true}, 
        offlineTaskStatus: { type: String, enum: ["pending", "completed"], default: "pending" },
        questionCompleted:{type:Boolean,default:false},
    }]
});

export const Team = mongoose.model("Team", teamSchema);
