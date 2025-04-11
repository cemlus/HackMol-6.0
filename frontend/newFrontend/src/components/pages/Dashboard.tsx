import type React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  CheckCircle,
  Clock,
  HardDrive,
  Shield,
  ChevronRight,
  AlertTriangle,
  CheckCheck,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { formattedComplaint } from "@/DashboardComponents/MyComplaints";

const Dashboard: React.FC = () => {
  const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
  const [complaintsNumber, setComplaintsNumber] = useState(0);
    const navigate = useNavigate()
    
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
            navigate("/signin");
          }
        } catch (error) {
          console.error("Authentication check failed", error);
          navigate("/signin");
        }
      };
  
      checkAuthentication();
      setComplaintsNumber(complaints.length)
    }, [complaints.length, navigate]);

    const complaintsUpto5 = complaints.slice(0, 5);

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


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1> 
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Complaints
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaintsNumber}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Cases Resolved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{ width: "68%" }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Avg. Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1h 15m</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              30min faster than target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Evidence Submitted
            </CardTitle>
            <HardDrive className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8 GB</div>
            <p className="text-xs text-gray-500 mt-1">Across 42 files</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Activity Feed</CardTitle>
              <Button 
                variant="ghost" size="sm" className="text-xs"
                onClick={() => navigate('/dashboard/myComplaints')}
                >
                View All
              </Button>
            </div>
            <CardDescription>Recent updates to your cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complaintsUpto5.map((activity: formattedComplaint) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      getStatusText(activity.status) === "Rejected"
                        ? "bg-red-100"
                        : getStatusText(activity.status) === "Unknown"
                        ? "bg-blue-100"
                        : getStatusText(activity.status) === "Pending"
                        ? "bg-yellow-100"
                        : getStatusText(activity.status) === "Accepted"
                        ? "bg-green-100"
                        : "bg-green-100"
                    )}
                  >
                    {getStatusText(activity.status) === "Rejected" ? (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    ) : getStatusText(activity.status) === "Unknown" ? (
                      <FileText className="h-4 w-4 text-blue-600" />
                    ) : getStatusText(activity.status) === "Pending" ? (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    ) : getStatusText(activity.status) === "Accepted" ? (
                      // <Shield className="h-4 w-4 text-purple-600" />
                      <CheckCheck className="h-4 w-4 text-green-600" />
                    ) : (
                      <CheckCheck className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {activity.id} {getStatusText(activity.status)}
                      </p>
                      <span className="text-xs text-gray-500">
                        {activity.lastUpdatedTimestamp ? new Date(activity.lastUpdatedTimestamp).toLocaleString() : "Not Available"}
                      </span>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs text-[#2A3B7D]"
                    >
                      View details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Verification */}
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Verification</CardTitle>
            <CardDescription>Security status of your records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
              <Shield className="h-10 w-10 text-[#2A3B7D]" />
              <div>
                <p className="text-sm font-medium text-[#2A3B7D]">
                  All records secured on IPFS
                </p>
                <p className="text-xs text-gray-600">
                  Last verified: 5 minutes ago
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Network Status</span>
                <span className="text-xs font-medium text-green-600 flex items-center">
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Active Nodes</span>
                <span className="text-xs font-medium">247</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Your Transactions</span>
                <span className="text-xs font-medium">36</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data Integrity</span>
                <span className="text-xs font-medium text-green-600">100%</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full text-xs">
              View Blockchain Explorer
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;