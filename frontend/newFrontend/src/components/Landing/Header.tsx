import { Shield } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-[#2A3B7D]" />
          <span className="text-xl font-bold text-[#2A3B7D]">CivicSentinel</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <a
            href="#features"
            className="text-sm font-medium text-black hover:text-[#1e2a5a] hover:bg-gray-50 p-4"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium hover:text-[#1e2a5a] hover:bg-gray-50 p-4"
          >
            How It Works
          </a>
          <a
            href="#about"
            className="text-sm font-medium hover:text-[#1e2a5a] hover:bg-gray-50 p-4"
          >
            About Us
          </a>
          <a
            href="#faq"
            className="text-sm font-medium hover:text-[#1e2a5a] hover:bg-gray-50 p-4"
          >
            FAQs
          </a>
        </nav>
        <div className="flex gap-2">
          <Button
            className="hidden sm:block text-[#1e2a5a] hover:bg-[#2A3B7D] bg-[white] border hover:text-[white] transition-all ease-in"
            onClick={() => {
              navigate("/signup/user");
            }}
          >
            Citizens
          </Button>
          <Button
            className="hidden sm:block text-[#1e2a5a] hover:bg-[#2A3B7D] bg-[white] border hover:text-[white] cursor-pointer  transition-all ease-in"
            onClick={() => {
              navigate("/signup/police");
            }}
          >
            Officers
          </Button>
        </div>
      </div>
    </header>
  );
}
