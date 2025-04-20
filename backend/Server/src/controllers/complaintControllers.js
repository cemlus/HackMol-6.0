import cloudinary from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cron from "node-cron"
import { promptTemplate } from "../langchain/priority.js";
import { llmWithStructuredOutput } from "../langchain/priority.js";
import { followUpPrompt } from "../langchain/recommendation.js";
import { llmFollowUp } from "../langchain/recommendation.js";
import { User } from '../models/user.model.js';
import {ethers} from 'ethers';
import {upload, uploadToPinata} from '../utils/pinata.js'
import { FIR } from '../models/fir.model.js';
import { ipcPrompt, llmIPC } from "../langchain/ipcCharges.js";
// import { User } from "../models/user.model.js";
// const provider = new ethers.JsonRpcApiProvider("https://eth-sepolia.g.alchemy.com/v2/bMJ0G0Bh3Lc746InmC6RuQPf3HNLIkQ5",{
//     name: "sepolia",
//     chainId: 11155111,
// })
const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER);

// Get block by number
const blockNumber = "latest";
const block = await provider.getBlock(blockNumber);

// console.log(block);
const wallet = new ethers.Wallet(process.env.WALLET, provider)
// import contractABI from '../../data/FIRSystem.json' assert {type: 'json'};
const contractABI = JSON.parse(fs.readFileSync('./Server/data/FIRSystem.json', 'utf8'));
const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new ethers.Contract(contractAddress, contractABI.abi, wallet);

const createMulterLikeFile = (filePath) => {
    return {
        buffer: fs.readFileSync(filePath),
        originalname: path.basename(filePath),
    };
};

const LOW_DAYS = 1;
const MODERATE_DAYS = 0.5;
const HIGH_DAYS = 0.01; // ~15 minutes for test

const MS_IN_DAY = 24 * 60 * 60 * 1000;

cron.schedule("*/30 * * * * *", async () => {
  const now = Date.now(); // current time in ms
  const complaints = await contract.getAllComplaints();

  complaints.forEach(async (complaint) => {
    if (complaint.processedTimestamp === 0n) {
      const recordedTime = Number(complaint.recordedTimestamp) * 1000; // convert to ms
      const diffMs = now - recordedTime;
      if(complaint.status === 0n){
        if (complaint.severity === "low") {
            if (diffMs >= LOW_DAYS * MS_IN_DAY) {
                try{
                    const tx = await contract.escalateComplaint(complaint.id);
                    const receipt = await tx.wait();
                }catch(err){
                    console.log(err);
                }
              console.log("Complaint escalated (low):", complaint);
            }
          } else if (complaint.severity === "moderate") {
            if (diffMs >= MODERATE_DAYS * MS_IN_DAY) {
                try{
                    const tx = await contract.escalateComplaint(complaint.id);
                    const receipt = await tx.wait();
                }catch(err){
                    console.log(err);
                }
              console.log("Complaint escalated (moderate):", complaint);
            }
          } else if (complaint.severity === "high") {
            if (diffMs >= HIGH_DAYS * MS_IN_DAY) {
                console.log(complaint);
                try{
                    const tx = await contract.escalateComplaint(complaint.id);
                    const receipt = await tx.wait();
                }catch(err){
                    console.log(err);
                }
    
              console.log("Complaint escalated (high):", complaint);
            }
          }
      }
      
    }
  });
});


cloudinary.v2.config({
    cloud_name: "dicsxtvo5",
    api_key: "695662827553358", 
    api_secret: "N7eChks-_HscnXxM7xANnjaNR6A",
    timeout: 120000  // Increase timeout limit
});

export const fileComplaint = async (req, res) => {
    try {
        const formData = req.body;
        const evidenceFiles = req.files;
        let initialProofsURIs = [];

        console.log("Received Complaint Data:", formData);
        console.log("Received Evidence Files:", evidenceFiles);

        // Fetch user from database
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            console.warn(`User not found: ${req.user.email}`);
            return res.status(404).json({ error: "User not found" });
        }

        // Upload evidence files to Pinata
        if (evidenceFiles && evidenceFiles.length > 0) {
            try {
                initialProofsURIs = await Promise.all(
                    evidenceFiles.map((file) => uploadToPinata(file,user.phone))  // ✅ ONLY pass the file path
                );
                console.log("Evidence uploaded to Pinata:", initialProofsURIs);
            } catch (uploadErr) {
                console.error("Error uploading evidence to Pinata:", uploadErr);
                return res.status(500).json({ error: "Failed to upload evidence files." });
            }
        }

        // Log initial formData
        console.log("Received Complaint Data:", formData);

        // Classify complaint using LLM
        try {
            const prompt = await promptTemplate.invoke({ input: formData.description });
            const result = await llmWithStructuredOutput.invoke(prompt);
            formData.priority = result.priority;

            console.log("Complaint classified with priority:", formData.priority);
        } catch (classificationError) {
            console.error("Error classifying complaint:", classificationError);
            return res.status(500).json({ error: "Failed to classify complaint description." });
        }

        // File complaint on the blockchain
        try {
            const tx = await contract.fileComplaint(
                formData.complaintType,
                formData.description,
                initialProofsURIs,
                user.signatureUrl,
                formData.priority,
                formData.location,
                user.phone
            );

            const receipt = await tx.wait();
            console.log("Transaction successful. Receipt:", receipt);
            console.log('Transaction receipt:', receipt);
            const iface = new ethers.Interface(contractABI.abi);
            // console.log(iface);
            const log = receipt.logs.find(
                (log) => log.topics[0] === iface.getEvent("ComplaintFiled").topicHash
            )
            if(!log){
                return res.status(500).json({ message: 'ComplaintFiled event not found' });
            }
            console.log("this is the log: ",log);
            const parsed = iface.parseLog(log);
            const complaintId = parsed.args.complaintId; // Assuming complaintId is the first arg in the event
            console.log("Parsed complaintId:", complaintId);
    
            const firRecord = await FIR.findOne({ user: user._id });

            if (!firRecord) {
                console.error("FIR record not found for the user.");
                return res.status(404).json({ error: "FIR record not found for the user." });
            }
        
            // Step 2: Push the complaintId into the FIR's fir array
            firRecord.fir.push(complaintId.toString());
            await firRecord.save(); 


            return res.status(200).json({
                message: "Complaint filed successfully",
                complaintId: complaintId,
            });
        } catch (blockchainError) {
            console.error("Error filing complaint on blockchain:", blockchainError);
            return res.status(500).json({ error: "Failed to file complaint on the blockchain." });
        }

    } catch (err) {
        console.error("Unexpected server error in fileComplaint:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const callComplaint = async (req, res) => {
    try {
        console.log(req.body)
        let formData = req.body;

        try {

            // Fetch user from database
            const user = await User.findOne({ email: req.user.email });
            if (!user) {
                console.warn(`User not found: ${req.user.email}`);
                return res.status(404).json({ error: "User not found" });
            }

            const prompt = await promptTemplate.invoke({ input: formData.description });
            const result = await llmWithStructuredOutput.invoke(prompt);
            console.log(result);
            formData.complaintType =  result.category;
            formData.priority = result.priority;
            console.log("Updated Complaint Object:", formData);
            console.log("User:", user);
            // res.json({ success: true, message: "Files uploaded successfully", data: formData });

            // File complaint on the blockchain
            try {
                const tx = await contract.fileComplaint(
                    formData.complaintType,
                    formData.description,
                    [],
                    user.signatureUrl,
                    formData.priority,
                    "",
                    user.phone
                );

                const receipt = await tx.wait();
                console.log("Transaction successful. Receipt:", receipt);
                const iface = new ethers.Interface(contractABI.abi);
            // console.log(iface);
            const log = receipt.logs.find(
                (log) => log.topics[0] === iface.getEvent("ComplaintFiled").topicHash
            )
            if(!log){
                return res.status(500).json({ message: 'ComplaintFiled event not found' });
            }
            console.log("this is the log: ",log);
            const parsed = iface.parseLog(log);
            const complaintId = parsed.args.complaintId; // Assuming complaintId is the first arg in the event
    
            const firRecord = await FIR.findOne({ user: user._id });

            if (!firRecord) {
                console.error("FIR record not found for the user.");
                return res.status(404).json({ error: "FIR record not found for the user." });
            }
        
            // Step 2: Push the complaintId into the FIR's fir array
            firRecord.fir.push(complaintId.toString());
            await firRecord.save(); 

            return res.status(200).json({
                message: "Complaint filed successfully",
                transactionHash: receipt.transactionHash
            });
            } catch (blockchainError) {
                console.error("Error filing complaint on blockchain:", blockchainError);
                return res.status(500).json({ error: "Failed to file complaint on the blockchain." });
            }
        } catch (error) {
            console.error("Classification error:", error);
            res.status(500).json({ error: "Failed to classify the complaint." });
        }


    } catch (error) {
        console.error("Error uploading evidence:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const addEvidence = async (req, res) => {
    try {
        const formData = req.body;
        const evidenceFiles = req.files;
        let newEvidences = [];

        console.log("Received Complaint Data:", formData);
        console.log("Received Evidence Files:", evidenceFiles);

        // Fetch user from database
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            console.warn(`User not found: ${req.user.email}`);
            return res.status(404).json({ error: "User not found" });
        }
        const fir = await FIR.findOne({ user: user._id });

        if(!fir.fir.includes(formData.complaintId)){
            console.warn(`User ${user.email} does not have access to complaint ID: ${formData.complaintId}`);
            return res.status(403).json({ error: "User does not have access to this complaint." });
        }

        // Upload evidence files to Pinata
        if (evidenceFiles && evidenceFiles.length > 0) {
            try {
                newEvidences = await Promise.all(
                    evidenceFiles.map((file) => uploadToPinata(file,user.phone))  // ✅ ONLY pass the file path
                );
                console.log("Evidence uploaded to Pinata:", newEvidences);
            } catch (uploadErr) {
                console.error("Error uploading evidence to Pinata:", uploadErr);
                return res.status(500).json({ error: "Failed to upload evidence files." });
            }
        }

        // Log initial formData
        console.log("Received Complaint Data:", formData);
    
        try{
            const tx = await contract.addEvidences(formData.complaintId, newEvidences); // Call the smart contract function to add evidence
            const receipt = await tx.wait(); // Wait for the transaction to be mined
    
            res.status(200).json({ message: 'Evidence added successfully', transactionHash: receipt.transactionHash });
        }
        catch(err){
            console.error('Error adding evidence:', err);
            res.status(500).json({ message: 'Error adding evidence', error: err.message });
        }
    } catch (err) {
        console.error("Unexpected server error in fileComplaint:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const recommendation = async (req, res) => {
    try {
        // console.log("Request Body:", req.body);
        const { complaintType, description, location, evidenceDescription } = req.body;
        // console.log("Form Data:", req.body);
        
        const prompt = await followUpPrompt.invoke({
            complaintType,
            description,
            // location,
            // evidenceDescription: evidenceDescription || "",
        });

        const result = await llmFollowUp.invoke(prompt);
        // console.log("Recommendation Result:", result);

        // Assuming result.questions is an array of strings
        res.json({ questions: result.questions });
    } catch (error) {
        console.error("Error generating recommendation:", error);
        res.status(500).json({ error: "Failed to generate recommendation." });
    }
};

export const getIPCCharges = async (req, res) => {
    try {
      const { complaintType, description } = req.body;
  
      const prompt = await ipcPrompt.invoke({
        complaintType,
        description,
      });
  
      const result = await llmIPC.invoke(prompt);
  
      res.json({ charges: result.charges });
    } catch (error) {
      console.error("Error generating IPC charges:", error);
      res.status(500).json({ error: "Failed to generate IPC charges." });
    }
  };

export const getUserComplaints = async (req, res) => {
    try{
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const firs = await FIR.findOne({ user: user._id });
        if (!firs) {
            return res.status(404).json({ error: "FIR record not found for the user" });
        }
        const complaints = await contract.getAllComplaints();

        const formattedComplaints = complaints.map(complaint => ({
            id: complaint.complaintId,
            complainant: complaint.complainant,
            complaintType: complaint.complaintType,
            description: complaint.description,
            location: complaint.location? complaint.location : user.address,
            proofURIs: complaint.proofURIs,
            victimSignatureURI: complaint.victimSignatureURI,
            // severity: complaint.severity,
            status: complaint.status.toString(),
            rejectionReason: complaint.rejectionReason,
            recordedTimestamp: new Date(Number(complaint.recordedTimestamp) * 1000).toISOString(),
            lastUpdatedTimestamp: new Date(Number(complaint.lastUpdatedTimestamp) * 1000).toISOString(),
            processedTimestamp: complaint.processedTimestamp > 0 
                ? new Date(Number(complaint.processedTimestamp) * 1000).toISOString() 
                : null
        }));
        // console.log(formattedComplaints);
        const userComplaints = formattedComplaints.filter((complaint) =>
            firs.fir.includes(complaint.id)
        );        // badme make this to show all complaints whose complaintIds are in the user's firs array
        res.status(200).json({ complaints: userComplaints });
    }
    catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ message: 'Error fetching complaints', error: error.message });
    }
}

export const getComplaintById = async (req, res) => {
    try{
        console.log(req.body);
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const complaint = await contract.getComplaintById(req.body.complaintId);
        
        // Format the response to be more user-friendly
        const formattedComplaint = {
            complaintId: complaint.complaintId,
            complainant: complaint.complainant,
            complaintType: complaint.complaintType,
            description: complaint.description,
            proofURIs: complaint.proofURIs,
            location: complaint.location,
            contactNumber: complaint.contactNumber.toString(),
            victimSignatureURI: complaint.victimSignatureURI,
            severity: complaint.severity,
            policeStation: complaint.policeStation,
            policeSignatureURI: complaint.policeSignatureURI,
            status: ['Pending', 'Accepted', 'Rejected'][complaint.status],
            rejectionReason: complaint.rejectionReason,
            recordedTimestamp: new Date(Number(complaint.recordedTimestamp) * 1000).toISOString(),
            lastUpdatedTimestamp: new Date(Number(complaint.lastUpdatedTimestamp) * 1000).toISOString(),
            processedTimestamp: complaint.processedTimestamp > 0 
                ? new Date(Number(complaint.processedTimestamp) * 1000).toISOString() 
                : null
        };
        
        // let userComplaints = formattedComplaints.filter(complaint => complaint.victimSignatureURI === user.signatureUrl);
        // badme make this to show all complaints whose complaintIds are in the user's firs array
        res.status(200).json({ complaint: formattedComplaint });
    }
    catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ message: 'Error fetching complaints', error: error.message });
    }
}

export const getComplaintsByPoliceStation = async (req, res) => {
    try{
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const complaints = await contract.getAllComplaints();

        const formattedComplaints = complaints.map(complaint => ({
            id: complaint.complaintId,
            complainant: complaint.complainant,
            description: complaint.description,
            proofURIs: complaint.proofURIs,
            victimSignatureURI: complaint.victimSignatureURI,
            severity: complaint.severity,
            status: complaint.status.toString(),
            location: complaint.location,
            recordedTimestamp: new Date(Number(complaint.recordedTimestamp) * 1000).toISOString(),
            lastUpdatedTimestamp: new Date(Number(complaint.lastUpdatedTimestamp) * 1000).toISOString(),
            processedTimestamp: complaint.processedTimestamp > 0 
                ? new Date(Number(complaint.processedTimestamp) * 1000).toISOString() 
                : null
        }));
        // console.log(formattedComplaints);
        let userComplaints = formattedComplaints.filter(complaint => complaint.location.includes(user.district));
        res.status(200).json({ complaints: userComplaints });
    }
    catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ message: 'Error fetching complaints', error: error.message });
    }
}

export const acceptComplaint = async (req, res) => {
    try{
        const user = await User.findOne({ email: req.user.email,role: "police" });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        let {complaintId} = req.body; 
        try{

            const tx = await contract.acceptComplaint(complaintId, user.signatureUrl); 
            const receipt = await tx.wait(); 

            res.status(200).json({ message: 'Complaint accepted successfully', transactionHash: receipt.transactionHash });

        }
        catch(err){
            console.error('Error accepting complaint:', err);
            res.status(500).json({ message: 'Error accepting complaint', error: err.message });
        }
    }
    catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ message: 'Error fetching complaints', error: error.message });
    }
}

export const rejectComplaint = async (req, res) => {
    try{
        const user = await User.findOne({ email: req.user.email,role: "police" });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        let {complaintId,reason} = req.body; 
        try{
            console.log(req.body)
            const tx = await contract.rejectComplaint(complaintId, reason,user.signatureUrl); 
            const receipt = await tx.wait(); 
    
            res.status(200).json({ message: 'Complaint rejected successfully', transactionHash: receipt.transactionHash });
    
        }
        catch(err){
            console.error('Error rejecting complaint:', err);
            res.status(500).json({ message: 'Error rejecting complaint', error: err.message });
        }
    }
    catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ message: 'Error fetching complaints', error: error.message });
    }
}
