import { useState } from "react";
import { Button } from "../ui/button";
import { Paperclip, Upload } from "lucide-react";
import axios from "axios";

export function AddEvidence() {
  const [complaintId, setComplaintId] = useState(""); // Renamed from caseId
  const [evidenceDescription, setEvidenceDescription] = useState(""); // Renamed from description
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files)); // Convert FileList to an array
    }
  };

  const handleSubmit = async () => {
    if (!complaintId || !evidenceDescription || files.length === 0) {
      alert("Please fill in all fields and upload at least one file.");
      return;
    }

    const formData = new FormData();
    formData.append("complaintId", complaintId); // Updated key
    formData.append("evidenceDescription", evidenceDescription); // Updated key
    files.forEach((file) => {
      formData.append("evidence", file);
    });

    try {
      const response = await axios.post("http://localhost:8000/addEvidence", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        alert("Evidence uploaded successfully!");
        setComplaintId(""); // Reset complaintId
        setEvidenceDescription(""); // Reset evidenceDescription
        setFiles([]); // Reset files
      } else {
        alert("Failed to upload evidence. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading evidence:", error);
      alert("An error occurred while uploading evidence.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Paperclip className="h-12 w-12 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Add to Existing Case
        </h2>
        <p className="text-gray-600 text-center">
          Upload additional evidence to your existing complaint.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="complaintId"
            className="block text-sm font-medium text-gray-700"
          >
            Complaint ID
          </label>
          <input
            id="complaintId"
            type="text"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A3B7D]"
            placeholder="Enter your complaint ID (e.g., XZ9B)"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="evidenceDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Evidence Description
          </label>
          <textarea
            id="evidenceDescription"
            value={evidenceDescription}
            onChange={(e) => setEvidenceDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A3B7D]"
            placeholder="Describe the evidence"
          />
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50">
          <input
            id="evidence"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
          <label htmlFor="evidence" className="cursor-pointer">
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-700">Click to upload evidence</p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, PDF, MP4 (Max 10 files)
            </p>
          </label>
        </div>
        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Selected Files:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        <Button
          className="w-full bg-gray-700 hover:bg-gray-800 text-white"
          onClick={handleSubmit}
        >
          Submit Evidence
        </Button>
      </div>
    </div>
  );
}