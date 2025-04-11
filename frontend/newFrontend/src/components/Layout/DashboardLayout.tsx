import type React from "react"
import { useState } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { Shield, FileText, MapPin, Settings, User, LogOut, Menu, X, Plus, ChevronFirstIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useIsMobile } from "../hooks/UseIsMobile"

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebarIfMobile = () => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const handleFileComplaint = () => {
    navigate("/fileComplaint")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={cn(
          "bg-white border-r border-gray-200 w-64 fixed inset-y-0 left-0 z-30 transition-transform duration-300 transform",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b">
            <div className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate('/')} >
              <Shield className="h-6 w-6 text-[#2A3B7D]" />
              <span className="text-xl font-bold text-[#2A3B7D]">CivicShield</span>
            </div>
            {isMobile && (
              <Button variant="ghost" size="sm" className="ml-auto" onClick={toggleSidebar}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-4 space-y-1">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-[#2A3B7D] border-l-4 border-[#2A3B7D] pl-2"
                    : "text-gray-700 hover:bg-gray-100",
                )
              }
              onClick={closeSidebarIfMobile}
            >
              <FileText className="h-5 w-5" />
              Dashboard
            </NavLink>
            <NavLink
              to="/dashboard/myComplaints"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-[#2A3B7D] border-l-4 border-[#2A3B7D] pl-2"
                    : "text-gray-700 hover:bg-gray-100",
                )
              }
              onClick={closeSidebarIfMobile}
            >
              <FileText className="h-5 w-5" />
              My Complaints
            </NavLink>
            <NavLink
              to="/dashboard/nearestPoliceStations"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-[#2A3B7D] border-l-4 border-[#2A3B7D] pl-2"
                    : "text-gray-700 hover:bg-gray-100",
                )
              }
              onClick={closeSidebarIfMobile}
            >
              <MapPin className="h-5 w-5" />
              Nearest Stations
            </NavLink>
            <NavLink
              to="/dashboard/profileSettings"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-[#2A3B7D] border-l-4 border-[#2A3B7D] pl-2"
                    : "text-gray-700 hover:bg-gray-100",
                )
              }
              onClick={closeSidebarIfMobile}
            >
              <Settings className="h-5 w-5" />
              Profile Settings
            </NavLink>
            
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="bg-blue-50 rounded-md p-3">
              <div className="flex items-center gap-2 text-[#2A3B7D]">
                <Shield className="h-5 w-5" />
                <div className="text-xs">
                  <p className="font-medium">Protected by EduChain</p>
                  <p>All records are secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn("flex-1 flex flex-col min-h-screen transition-all duration-300", isMobile ? "ml-0" : "ml-64")}>
        {/* Top Bar */}
        <header className="h-16 border-b border-gray-200 flex items-center px-4 sticky top-0 bg-white z-20">
          {isMobile && (
            <Button variant="ghost" size="sm" className="mr-2" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
          )}




          <div className="flex-1 flex items-center justify-end gap-4">
          <div>
            <Button
                variant={"outline"}
                className="border-[#000] text-[#000000] hover:bg-gray-100"
                onClick={() => {
                    navigate("/");
                }}
            >
                <ChevronFirstIcon/>
                Back to Home
            </Button>
          </div>
            

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 border rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">John Doe</p>
                    <p className="w-[200px] truncate text-xs text-gray-500">john.doe@example.com</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard/profile-settings")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Floating Action Button */}
      <div className="fixed right-6 bottom-6 z-20">
        <Button
          onClick={handleFileComplaint}
          className="h-14 w-14 rounded-full bg-[#2A3B7D] hover:bg-[#1e2a5a] shadow-lg"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">File Complaint</span>
        </Button>
      </div>
    </div>
  )
}

export default DashboardLayout