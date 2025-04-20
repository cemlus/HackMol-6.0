import { Shield } from "lucide-react"

export function Footer () {
    return (
        <footer className="bg-[#2A3B7D] w-full text-white py-12">
        <div className="w-full px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6" />
                <span className="text-xl font-bold">CivicSentinel</span>
              </div>
              <p className="text-sm text-white/70">
                Empowering Emergencies with AI & Blockchain – Transparent, Fast, Trusted.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>info@CivicSentinel.com</li>
                <li>+1 (555) 000-0000</li>
                <li>123 Blockchain Avenue, Digital City</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/70">GDPR Compliant</span>
              <span className="text-sm text-white/70">|</span>
              <span className="text-sm text-white/70">ISO 27001 Certified</span>
            </div>
            <div className="text-sm text-white/70">© 2025 CivicSentinel. All rights reserved.</div>
          </div>
        </div>
      </footer>
    )
}