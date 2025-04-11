import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Paperclip, CheckCircle, Clock, AlertCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "../components/hooks/UseIsMobile";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogHeader, DialogContent } from "../components/ui/dialog";
import {generateFIRPDF} from "../utils/pdfGenerator.js";

export interface formattedComplaint {
    id: string;
    complaintType: string;
    description: string;
    proofURIs: string[];
    status: string;
    rejectionReason?: string;
    processedTimestamp?: string | Date | number;
    recordedTimestamp?: string | Date;
    lastUpdatedTimestamp?: string | Date;
    location?: string;
  }
  

const MyComplaints: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [complaints, setComplaints] = useState<formattedComplaint[]>([]);
  const [complaintsNumber, setComplaintsNumber] = useState(0);

  const isMobile = useIsMobile();
  const navigate = useNavigate();

   const [selectedComplaint, setSelectedComplaint] = useState<formattedComplaint | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleCardClick = (complaint: formattedComplaint) => {
      setSelectedComplaint(complaint);
      setModalOpen(true);
    };

    
    

    const ComplaintDetailsModal = () => (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#2A3B7D]">
                Complaint Details #{selectedComplaint?.id}
              </DialogTitle>
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => setModalOpen(false)}
              >
              </Button>
            </DialogHeader>
    
            {selectedComplaint && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="text-sm text-gray-900">{selectedComplaint.complaintType}</p>
                  </div>
    
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs",
                        getStatusColor(getStatusText(selectedComplaint.status)),
                      )}
                    >
                      {getStatusIcon(getStatusText(selectedComplaint.status))}
                      {getStatusText(selectedComplaint.status)}
                    </span>
                  </div>
    
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-sm text-gray-900">{selectedComplaint.location}</p>
                  </div>
    
                  <div>
                    <p className="text-sm font-medium text-gray-500">Recorded Time</p>
                    <p className="text-sm text-gray-900"> {selectedComplaint.recordedTimestamp
                    ? new Date(selectedComplaint.recordedTimestamp).toLocaleString()
                    : "N/A"}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-sm text-gray-900">{selectedComplaint.lastUpdatedTimestamp
                    ? new Date(selectedComplaint.lastUpdatedTimestamp).toLocaleString()
                    : "N/A"}</p>
                  </div>
                      

                  <div>
                    <p className="text-sm font-medium text-gray-500">Processed Time</p>
                    <p className="text-sm text-gray-900">
                    {selectedComplaint.processedTimestamp
                    ? new Date(selectedComplaint.processedTimestamp).toLocaleString()
                    : "Unknown, No steps taken"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Attachments</p>

                    <div className="flex flex-wrap gap-2">
                      {selectedComplaint.proofURIs.map((url, index) => (
                        <div key={index} className="w-24 h-24 border rounded overflow-hidden">
                          <img
                            src={url}
                            alt={`proof-${index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
    
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-sm text-gray-900">{selectedComplaint.description}</p>
                </div>
    
                {selectedComplaint.rejectionReason && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-red-600">Rejection Reason</p>
                    <p className="text-sm text-red-500">{selectedComplaint.rejectionReason}</p>
                  </div>
                )}
    
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/fileComplaint")}
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Add Evidence
                  </Button>
                  <Button className="flex-1 bg-[#2A3B7D] hover:bg-[#1e2a5a]"  onClick={() => {
    const data = getComplaintData(selectedComplaint);
    if (data) generateFIRPDF(data);
    else console.error("No complaint selected!");
  }} >
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      );


  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get("https://backend.topishukla.xyz/checkAuth", {
          withCredentials: true,
        });
        console.log(response.data)
        if (
          response.status === 200 &&
          response.data.authenticated &&
          response.data.role === "user"
        ) {
          const complaintsRes = await axios.get("https://backend.topishukla.xyz/userComplaints", {
            withCredentials: true,
          });
          console.log(complaintsRes.data.complaints.length)
          setComplaints(complaintsRes.data.complaints);
          console.log(complaints)
        } else {
          navigate("/signin/useer");
        }
      } catch (error) {
        console.error("Authentication check failed", error);
        navigate("/signin/user");
      }
    };

    checkAuthentication();
    setComplaintsNumber(complaints.length)
  }, [complaints.length, navigate]);

  const getStatusText = (status: any) => {
    switch (status) {
      case "0":
        return "Pending";
      case "1":
        return "Accepted";
      case "2":
        return "Rejected";
      case "3":
        return "Escalated";
      default:
        return "Unknown";
    }
  };

  // Filter complaints based on search query and filters
  const filteredComplaints = complaints.filter((complaint: formattedComplaint) => {
    const matchesSearch =
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getStatusText(complaint.status).toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter ? complaint.complaintType === typeFilter : true;

    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Escalated":
        return "bg-red-100 text-red-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "Investigating":
        return <Clock className="h-4 w-4" />;
      case "Escalated":
        return <AlertCircle className="h-4 w-4" />;
      case "Rejected":
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getComplaintData = (selectedComplaint: any) => {
    if (!selectedComplaint) return null;
  
    return {
      complaintId: selectedComplaint.id,
      complaintType: selectedComplaint.complaintType,
      description: selectedComplaint.description,
      proofURIs: selectedComplaint.proofURIs,
      location: selectedComplaint.location,
      status: getStatusText(selectedComplaint.status),
      rejectionReason: selectedComplaint?.rejectionReason,
      recordedTimestamp: new Date(selectedComplaint.recordedTimestamp).toLocaleString(),
      lastUpdatedTimestamp: selectedComplaint.lastUpdatedTimestamp
        ? new Date(selectedComplaint.lastUpdatedTimestamp).toLocaleString()
        : "N/A",
      processedTimestamp: selectedComplaint.processedTimestamp
        ? new Date(selectedComplaint.processedTimestamp).toLocaleString()
        : "Unknown, No steps taken",
    };
  };

  

  return (
    <div className="space-y-6 px-4 py-4">
      <ComplaintDetailsModal />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export to PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search by case ID, type,..."
            className="pl-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "text-xs",
                  statusFilter && "bg-blue-50 border-blue-200 text-blue-700"
                )}
              >
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Resolved")}>
                Resolved
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("Investigating")}
              >
                Investigating
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Escalated")}>
                Escalated
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "text-xs",
                  typeFilter && "bg-blue-50 border-blue-200 text-blue-700"
                )}
              >
                Type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTypeFilter(null)}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("Theft")}>
                Theft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("Assault")}>
                Assault
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("Medical")}>
                Medical
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("Fire")}>
                Fire
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("Harassment")}>
                Harassment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Complaints Card View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredComplaints.map((complaint: formattedComplaint) => (
            
          <Card
                      key={complaint.id}
                      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleCardClick(complaint)}
                    >
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-[#2A3B7D]">
                      {complaint.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {complaint.complaintType}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs",
                      complaint.status === "Rejected"
                        ? "font-bold"
                        : "font-medium",
                      getStatusColor(getStatusText(complaint.status))
                    )}
                  >
                    {getStatusIcon(getStatusText(complaint.status))}
                    {getStatusText(complaint.status)}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {complaint.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                  <div>
                    <p className="font-medium">Location</p>
                    <p>{complaint.location}</p>
                  </div>
                  {complaint.rejectionReason && (
                    <div>
                      <p className="font-medium"
                      >Reason for Rejection</p>
                      <p>{complaint.rejectionReason}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Updated At:{" "} {complaint.lastUpdatedTimestamp
                      ? new Date(complaint.lastUpdatedTimestamp).toLocaleString()
                      : "N/A"}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Paperclip className="h-3 w-3 mr-1" />
                    {complaint.proofURIs.length} files
                  </span>
                </div>
              </div>

              <div className="border-t grid grid-cols-1 divide-x">
                <Button
                  variant="ghost"
                  size="sm"
                  className="py-2 rounded-none text-xs"
                  onClick={() => navigate('/fileComplaint') }
                >
                  <Paperclip className="h-3.5 w-3.5 mr-1" />
                  Add Evidence
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyComplaints;