// import { Team } from "../models/team.model.js";
// import questions from "../questions/questions.js";
// /**
//  * Assigns a team to a question set and starts the game
//  */
// export const createTeam = async (req, res) => {
//     try {
//         const { teamName } = req.user; // Extract from JWT

//         const existingTeams = await Team.countDocuments();
//         const assignedSet = (existingTeams % 3) + 1; // Distribute across 5 sets

//         const newTeam = new Team({
//             teamName,
//             questionSet: assignedSet,
//             questions: questions[`set${assignedSet}`] // Correct way to access question set
//         });

//         await newTeam.save();

//         res.json({ message: "Game started", questionSet: assignedSet, currentLocationId: 1 });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// export const getActiveLocation = async (req, res) => {
//     try {
//         const { teamName } = req.user;
//         const team = await Team.findOne({ teamName });

//         if (!team) return res.status(404).json({ message: "Team not found" });

//         // Find the first question with riddleStatus "pending"
//         const activeQuestion = team.questions.find(q => q.riddleStatus === "pending");

//         if (!activeQuestion) return res.status(404).json({ message: "No pending questions" });

//         res.json({ location: activeQuestion.location });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };


// export const getRiddle = async(req,res)=>{
//     try{
//         // const { teamName } = req.user;
//         const teamName=req.user.teamName;
//         // console.log(req.user);
//         const {location}= req.body;
//         const team = await Team.findOne({ teamName });
//         // Find the first question with quextion completed "false"
//         const pendingRiddle = team.questions.find(q => q.questionCompleted === false);
//         if(!pendingRiddle){
//             console.log("here");
//             res.json({"message":"game completed"});
//         }
//         if(!location===pendingRiddle.location){
//             console.log("here1");
//             res.json({"message":"question locked"});
//         }
//         if(pendingRiddle.riddleStatus==="pending"){
//             console.log("here2");
//             res.json({"riddle":pendingRiddle.riddle});
//         }
//         // agli location ke liye pointer rakh
//         if(pendingRiddle.riddleStatus==="completed" && offlineTaskStatus === "pending"){
//             const secondPendingRiddle = team.questions
//             .filter(q => q.questionCompleted === false)
//             .at(1); 
//             console.log("here3");
//             res.json({offlineTask:pendingRiddle.offlineTask,nextLocation:secondPendingRiddle.location})}
//         else if(pendingRiddle.riddleStatus==="completed" && offlineTaskStatus==="completed"){
//             // update in db
//             pendingRiddle.questionCompleted=true;
//             await team.save();
//             console.log("here5");
//             // const updatedScore = await Team.updateOne({teamName},{questionCompleted: true});
//             // pendingRiddle.questionCompleted= true;
//             res.json({"message":"question completed"});
//         }
//     }catch(err){
//         console.log(err);
//                 res.status(500).json({ message: "Server error", error: err.message });
//     }
// }

// /**
//  * Submits an answer, verifies it, and assigns the next location & offline task
//  */
// export const submitAnswer = async (req, res) => {
//     const teamName  = req.user.teamName;
//     const { answer,location } = req.body;
//     console.log(req.body);

//     const team = await Team.findOne({ teamName:teamName})
//     if (!team){
//         console.log('here')
//           res.status(404).json({ message: "Team not found" });
//     }

//     const pendingRiddle = team.questions.find(q => q.questionCompleted === false);
//     if(!pendingRiddle){
//         console.log('here1')
//         res.json({"message":"incorrect"})

//     if(!location===pendingRiddle.location){
//         console.log('here2')
//       res.json({"message":"incorrect"})
// ;
//     }
//     if(pendingRiddle.riddleStatus==="pending"){
//         if(answer.trim().toLowerCase()===pendingRiddle.answer){
//             pendingRiddle.riddleStatus="completed";
//             await team.save();
//             console.log('here4')
//             // const updatedRiddleStatus = await Team.updateOne({teamName},{riddleStatus: "completed"});
//             const secondPendingRiddle = team.questions
//             .filter(q => q.questionCompleted === false)
//             .at(1); 
//             res.json({' offlineTask':pendingRiddle.offlineTask,'nextLocation':secondPendingRiddle.location});

//             //update riddleStatus in db and give location of next and offlineTaskCode
//         }
//     }


// export const hasCompletedRiddleOfThisTask = async (req, res) => {
//     const { teamName,location } = req.body;

//     const team = await Team.findOne({ teamName });
//     if (!team ) return res.status(400).json({ message: "Invalid team not found" });

//     const pendingRiddle = team.questions.find(q => q.questionCompleted === false);
//     if(!pendingRiddle){
//         return{"message":"incorrect"};
//     }
//     if(!location===pendingRiddle.location){
//         return{"message":"incorrect"};
//     }
//     if(pendingRiddle.riddleStatus==="pending"){
//         return{"message":"haven't finished riddle"};
//     }else if(pendingRiddle.offlineTaskStatus!==false){
//         return{"message":"task already completed"};
//     }else{
//         return{"message":"valid"};
//     }
// };
// /**
//  * Marks an offline task as completed, allowing online progress
//  */
// export const completeOfflineTask = async (req, res) => {
//     // const { teamName } = req.user;
//     const { teamName,location } = req.body;

//     const team = await Team.findOne({ teamName });
//     if (!team ) return res.status(400).json({ message: "Invalid team not found" });

//     const pendingRiddle = team.questions.find(q => q.questionCompleted === false);
//     if(!pendingRiddle){
//         return{"message":"incorrect"};
//     }
//     if(!location===pendingRiddle.location){
//         return{"message":"incorrect"};
//     }
//     if(pendingRiddle.riddleStatus==="pending"){
//         return{"message":"haven't finished riddle"};
//     }else if(pendingRiddle.offlineTaskStatus!==false){
//         return{"message":"task already completed"};
//     }else{
//         pendingRiddle.questionCompleted=true;
//         team.currentScore=team.currentScore++;
//         await team.save();
//         // const updatedRiddleStatus = await Team.updateOne({teamName},{offlineTaskStatus: "completed",questionCompleted:true});
//         return{"message":"updated"};
//     }    // if (!team || team.taskCode !== taskCode) return res.status(400).json({ message: "Invalid task code" });

//     // if (team.offlineTaskStatus !== "in_progress") return res.status(400).json({ message: "Task not in progress" });

//     // team.offlineTaskStatus = "completed";
//     // team.currentLocationId += 1;
//     // await team.save();

//     res.json({ message: "Offline task completed! The next riddle is now unlocked." });
// };

// /**
//  * Fetches the team's progress in the game
//  */
// // export const getProgress = async (req, res) => {
// //     const { teamName } = req.user;

// //     const team = await Team.findOne({ teamName });
// //     if (!team) return res.status(404).json({ message: "Team not found" });

// //     res.json({
// //         currentLocationId: team.currentLocationId,
// //         offlineTaskStatus: team.offlineTaskStatus,
// //         questionSet: team.questionSet,
// //     });
// // };
import { Team } from "../models/team.model.js";
import questions from "../questions/questions.js";

/**
 * Assigns a team to a question set and starts the game
 */
export const createTeam = async (req, res) => {
    try {
        const { teamName } = req.user; // Extract from JWT

        const existingTeams = await Team.countDocuments();
        const assignedSet = (existingTeams % 3) + 1; // Distribute across 5 sets

        const newTeam = new Team({
            teamName,
            questionSet: assignedSet,
            questions: questions[`set${assignedSet}`], // Correct way to access question set
        });

        await newTeam.save();

        res.json({ message: "Game started", questionSet: assignedSet, currentLocationId: 1 });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getActiveLocation = async (req, res) => {
    try {
        const { teamName } = req.user;
        const team = await Team.findOne({ teamName });

        if (!team) return res.status(404).json({ message: "Team not found" });

        const activeQuestion = team.questions.find(q => q.riddleStatus === "pending");

        if (!activeQuestion) return res.status(404).json({ message: "No pending questions" });

        res.json({ location: activeQuestion.location });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getRiddle = async (req, res) => {
    try {
        const teamName = req.user.teamName;
        console.log(teamName);
        const { location } = req.body;
        // console.log(req.body);
        const team = await Team.findOne({ teamName });
        const pendingRiddle = team.questions.find(q => q.questionCompleted === false);
        console.log(pendingRiddle);
        if (!pendingRiddle) {
            console.log("here");
            return res.json({ message: "game completed" });
        }

        if (location !== pendingRiddle.location) {
            console.log("here1");
            return res.json({ message: "question locked" });
        }

        if (pendingRiddle.riddleStatus === "pending") {
            console.log("here2");
            return res.json({ riddle: pendingRiddle.riddle });
        }

        if (pendingRiddle.riddleStatus === "completed" && pendingRiddle.offlineTaskStatus === "pending") {
            const secondPendingRiddle = team.questions
                .filter(q => q.questionCompleted === false)
                .at(1);
            console.log("here3");
            return res.json({message:` offlineTask: ${pendingRiddle.offlineTask}, nextLocation: ${secondPendingRiddle?.location}` });
        } else if (pendingRiddle.riddleStatus === "completed" && pendingRiddle.offlineTaskStatus === "completed") {
            pendingRiddle.questionCompleted = true;
            await team.save();
            console.log("here5");
            return res.json({ message: "question completed" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const submitAnswer = async (req, res) => {
    try {
        const teamName = req.user.teamName;
        const { answer, location } = req.body;
        console.log(req.body);

        const team = await Team.findOne({ teamName });

        if (!team) {
            console.log("here");
            return res.status(404).json({ message: "Team not found" });
        }

        const pendingRiddle = team.questions.find(q => q.questionCompleted === false);
        if (!pendingRiddle) {
            console.log("here1");
            return res.json({ message: "incorrect" });
        }
        console.log(location,pendingRiddle.location)
        if (location !== pendingRiddle.location) {
            console.log("here2");
            return res.json({ message: "incorrect" });
        }

        if (pendingRiddle.riddleStatus === "pending") {
            console.log("here4");
            if (answer.trim().toLowercase()=== pendingRiddle.riddleAnswer.toLowerCase()) {
                pendingRiddle.riddleStatus = "completed";
                await team.save();

                const secondPendingRiddle = team.questions
                    .filter(q => q.questionCompleted === false)
                    .at(1);
                
                return res.json({message:` offlineTask: ${pendingRiddle.offlineTask}, nextLocation: ${secondPendingRiddle?.location}` });
            }else{
                return res.json({ message:'incorrect' });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const hasCompletedRiddleOfThisTask = async (req, res) => {
    try {
        console.log(req.body,req.user.teamName);
        const { teamName, location } = req.body;

        const team = await Team.findOne({ teamName });
        if (!team) return res.status(400).json({ message: "Invalid team not found" });

        const pendingRiddle = team.questions.find(q => q.questionCompleted === false);
        if (!pendingRiddle) return res.json({ message: "incorrect" });

        if (location !== pendingRiddle.location) return res.json({ message: "incorrect" });

        if (pendingRiddle.riddleStatus === "pending") return res.json({ message: "haven't finished riddle" });

        if (pendingRiddle.offlineTaskStatus !== 'pending') return res.json({ message: "task already completed" });

        return res.json({ message: "valid" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const completeOfflineTask = async (req, res) => {
    try {
        const { teamName, location } = req.body;

        const team = await Team.findOne({ teamName });
        if (!team) return res.status(400).json({ message: "Invalid team not found" });

        const pendingRiddle = team.questions.find(q => q.questionCompleted === false);
        if (!pendingRiddle) return res.json({ message: "incorrect" });

        if (location !== pendingRiddle.location) return res.json({ message: "incorrect" });

        if (pendingRiddle.riddleStatus === "pending") return res.json({ message: "haven't finished riddle" });

        if (pendingRiddle.offlineTaskStatus !== 'pending') return res.json({ message: "task already completed" });
        pendingRiddle.offlineTaskStatus = "completed";
        pendingRiddle.questionCompleted = true;
        team.currentScore += 100;
        await team.save();

        return res.json({ message: "updated" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const teams = await Team.find()
            .sort({ currentScore: -1 }) // Sort teams by score in descending order
            .select("teamName currentScore"); // Select only relevant fields

        res.json({ leaderboard: teams });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
