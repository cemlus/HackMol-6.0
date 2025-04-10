import { Shield } from "lucide-react";

export function FooterSmall() {
  return (
    <footer className="bg-[#2A3B7D] text-white py-6 flex items-center justify-center">
      <div className="px-4 md:px-6 w-[100%] ">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-bold">CivicShield</span>
          </div>
          <div className="text-sm text-white/70">
            © 2025 CivicShield. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
