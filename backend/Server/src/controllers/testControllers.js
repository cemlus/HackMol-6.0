import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

import {ethers} from 'ethers';
import {upload, uploadToPinata} from '../utils/pinata.js'

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);

// Get block by number
const blockNumber = "latest";
const block = await provider.getBlock(blockNumber);

// console.log(block);
const wallet = new ethers.Wallet(process.env.WALLET, provider)
import contractABI from '../../data/FIRSystem.json' assert {type: 'json'};

const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new ethers.Contract(contractAddress, contractABI.abi, wallet);

const createMulterLikeFile = (filePath) => {
    return {
        buffer: fs.readFileSync(filePath),
        originalname: path.basename(filePath),
    };
};

export const fileComplaint = async (req, res) => {
    let complaintType = "hihih"
    let contactNumber = 1234567890
    let location = "india"
    let description = "Theft of a bicycle"; 
    let victimSignatureURI = "https://example.com/victim_signature.jpg";
    let severity = "low";
    try {
        // const proofFiles = req.files["proofs"] || [];
        const proofsFiles = req.files?.proofs || [];
        const initalProofsURIs = await Promise.all(
            proofsFiles.map((file) => uploadToPinata(file))
        ) //actually used in the code

        const tx = await contract.fileComplaint(complaintType,description,initalProofsURIs,victimSignatureURI,severity,location,contactNumber); // Call the smart contract function
        const receipt = await tx.wait(); 
        console.log('Transaction receipt:', receipt);
        const iface = new ethers.Interface(contractABI.abi);
        // console.log(iface);
        const log = receipt.logs.find(
            (log) => log.topics[0] === iface.getEvent("ComplaintFiled").topicHash
        )
        if(!log){
            return res.status(500).json({ message: 'ComplaintFiled event not found' });
        }
        const parsed = iface.parseLog(log);
        const complaintId = parsed.args.complaintId; // Assuming complaintId is the first arg in the event

        console.log('Complaint ID:', complaintId);

        res.status(200).json({ message: 'Complaint filed successfully', transactionHash: receipt.transactionHash });
    } catch (error) {
        console.error('Error filing complaint:', error);
        res.status(500).json({ message: 'Error filing complaint', error: error.message });
    }
}

export const getAllComplaints = async (req, res) => {
    try{
        const complaints = await contract.getAllComplaints();

        const formattedComplaints = complaints.map(complaint => ({
            id: complaint.complaintId,
            complainant: complaint.complainant,
            description: complaint.description,
            proofURIs: complaint.proofURIs,
            victimSignatureURI: complaint.victimSignatureURI,
            severity: complaint.severity,
            status: complaint.status.toString(),
        }));
        // console.log(formattedComplaints);
        res.status(200).json({ complaints: formattedComplaints });
    }
    catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ message: 'Error fetching complaints', error: error.message });
    }
}

export const addEvidence = async (req, res) => {

    const proofPaths = [
        path.join('uploads', '1743617292079.jpg'),
        path.join('uploads', '1743617759235.jpg')
    ];

    const proofsFiles = proofPaths.map(createMulterLikeFile);

    try{
        // let newEvidences = ["https://example.com/new_proof1.jpg", "https://example.com/new_proof2.jpg"]; // Example new evidence URIs
        let complaintId = "COMP-1743801124"; // Example complaint ID

        const newEvidences = await Promise.all(
                proofsFiles.map((file) => uploadToPinata(file)))

        const tx = await contract.addEvidences(complaintId, newEvidences); // Call the smart contract function to add evidence
        const receipt = await tx.wait(); // Wait for the transaction to be mined

        res.status(200).json({ message: 'Evidence added successfully', transactionHash: receipt.transactionHash });
    }
    catch(err){
        console.error('Error adding evidence:', err);
        res.status(500).json({ message: 'Error adding evidence', error: err.message });
    }
}

export const acceptComplaint = async (req, res) => {
    let {complaintId} = req.body; 
    let policeSignatureURI = "https://example.com/police_signature.jpg";
    try{

        const tx = await contract.acceptComplaint(complaintId, policeSignatureURI); 
        const receipt = await tx.wait(); 

        res.status(200).json({ message: 'Complaint accepted successfully', transactionHash: receipt.transactionHash });

    }
    catch(err){
        console.error('Error accepting complaint:', err);
        res.status(500).json({ message: 'Error accepting complaint', error: err.message });
    }
}

export const rejectComplaint = async (req, res) => {
    let complaintId = "COMP-1743774637"
    let policeSignatureURI = "https://example.com/police_signature.jpg";
    let rejectionReason = "Insufficient evidence"; 
    try{

        const tx = await contract.rejectComplaint(complaintId, rejectionReason, policeSignatureURI); 
        const receipt = await tx.wait(); 

        res.status(200).json({ message: 'Complaint rejected successfully', transactionHash: receipt.transactionHash });
    }
    catch(err){
        console.error('Error rejecting complaint:', err);
        res.status(500).json({ message: 'Error rejecting complaint', error: err.message});
    }
}

export const getComplaintById = async (req, res) => {
    let {complaintId} = req.body;

    try {
        const complaint = await contract.getComplaintById(complaintId);
        
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
        
        res.status(200).json({ complaint: formattedComplaint });
    } catch (error) {
        console.error('Error getting complaint:', error);
        res.status(500).json({ 
            message: 'Error getting complaint', 
            error: error.message 
        });
    }
};

export const getComplaintsByVictim = async (req, res) => {
    const { victimAddress } = req.params;

    try {
        const complaints = await contract.getComplaintsByVictim(victimAddress);
        
        // Format all complaints
        const formattedComplaints = complaints.map(complaint => ({
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
        }));
        
        res.status(200).json({ complaints: formattedComplaints });
    } catch (error) {
        console.error('Error getting victim complaints:', error);
        res.status(500).json({ 
            message: 'Error getting victim complaints', 
            error: error.message 
        });
    }
};

export const isPoliceStation = async (req, res) => {
    const { stationAddress } = req.params;

    try {
        const isPolice = await contract.isPoliceStation(stationAddress);
        
        res.status(200).json({ isPoliceStation: isPolice });
    } catch (error) {
        console.error('Error checking police station status:', error);
        res.status(500).json({ 
            message: 'Error checking police station status', 
            error: error.message 
        });
    }
};

export const addPoliceStation = async (req, res) => {
    const { stationAddress } = req.body;

    try {
        const tx = await contract.addPoliceStation(stationAddress);
        const receipt = await tx.wait();
        
        res.status(200).json({ 
            message: 'Police station added successfully', 
            transactionHash: receipt.transactionHash 
        });
    } catch (error) {
        console.error('Error adding police station:', error);
        res.status(500).json({ 
            message: 'Error adding police station', 
            error: error.message 
        });
    }
};

// Remove a police station (owner only)
export const removePoliceStation = async (req, res) => {
    const { stationAddress } = req.body;

    try {
        const tx = await contract.removePolice(stationAddress);
        const receipt = await tx.wait();
        
        res.status(200).json({ 
            message: 'Police station removed successfully', 
            transactionHash: receipt.transactionHash 
        });
    } catch (error) {
        console.error('Error removing police station:', error);
        res.status(500).json({ 
            message: 'Error removing police station', 
            error: error.message 
        });
    }
};