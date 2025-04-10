import { Smartphone, Map, Lock } from "lucide-react"

export function HowItWorks(){
    return (
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#2A3B7D]">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Three simple steps to report and track emergencies
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
              <div className="flex flex-col items-center w-[100%] text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-[#2A3B7D] flex items-center justify-center text-white text-2xl font-bold">
                    1
                  </div>
                  <div className="hidden md:block absolute top-8 left-full w-[20vw] h-0.5 bg-[#2A3B7D]"></div>
                </div>
                <h3 className="text-xl font-bold">Report</h3>
                <p className="text-gray-500">
                  Submit your emergency report via SMS, WhatsApp, or web form with location and details.
                </p>
                <div className="w-full max-w-[200px] aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-12 w-12 text-[#2A3B7D]" />
                </div>
              </div>
              <div className="flex flex-col items-center text-center w-[100%] space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-[#2A3B7D] flex items-center justify-center text-white text-2xl font-bold">
                    2
                  </div>
                  <div className="hidden md:block absolute top-8 left-full w-[20vw] h-0.5 bg-[#2A3B7D]"></div>
                </div>
                <h3 className="text-xl font-bold">Track</h3>
                <p className="text-gray-500">
                  Access your live dashboard showing the assigned officer's location and SLA timer for transparency.
                </p>
                <div className="w-full max-w-[200px] aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <Map className="h-12 w-12 text-[#2A3B7D]" />
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div>
                  <div className="w-16 h-16 rounded-full bg-[#2A3B7D] flex items-center justify-center text-white text-2xl font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold">Resolve</h3>
                <p className="text-gray-500">
                  Your FIR is stored on blockchain and evidence secured on IPFS for permanent record.
                </p>
                <div className="w-full max-w-[200px] aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <Lock className="h-12 w-12 text-[#2A3B7D]" />
                </div>
              </div>
            </div>
          </div>
        </section>
    )
}