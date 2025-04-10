import { Shield, Lock, Zap } from "lucide-react"
import { Button } from "../ui/button"
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Hero() {

    const navigate = useNavigate();
    useEffect(() => {
        const checkAuthentication = async () => {
          try {
            const response = await axios.get("http://localhost:8000/checkAuth", {
              withCredentials: true,
            });
            if (!(response.status === 200 && response.data.authenticated && response.data.role === "user")) {
              navigate("/signin/user");
            }
          } catch (error) {
            console.error("Authentication check failed", error);
            navigate("/signin/user");
          }
        };
    
        // checkAuthentication();
      }, [navigate]);

    return (
        <section className="py-20 md:py-24 bg-gradient-to-b from-white to-gray-50 w-full">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-[#2A3B7D]">
                Report Emergencies. Track Justice. No Tampering. No Delays.
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A secure, AI-driven platform to file and monitor FIRs and Complaints online – trusted by 4 college students.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="bg-[#FF4D4D] hover:bg-[#e63e3e] text-white cursor-pointer" >Get Started in 30 Seconds</Button>
            </div>
              </div>
              <div className="flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-square">
              <div className="animate-pulse absolute inset-0 rounded-full bg-blue-100 opacity-70"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-3/4 h-3/4">
                  <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="h-32 w-32 text-[#2A3B7D] animate-bounce" />
                  </div>
                  <div className="absolute top-1/4 right-1/4 animate-ping">
                <Lock className="h-10 w-10 text-[#FF4D4D]" />
                  </div>
                  <div className="absolute bottom-1/4 left-1/4 animate-pulse">
                <Zap className="h-10 w-10 text-[#FF4D4D]" />
                  </div>
                </div>
              </div>
            </div>
              </div>
            </div>
          </div>
        </section>
    )
}