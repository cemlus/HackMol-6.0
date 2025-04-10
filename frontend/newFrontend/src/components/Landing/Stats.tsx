export function Stats() {
    return (
        <section className="py-12 bg-[#2A3B7D] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-center">
              <div>
                <h3 className="text-3xl font-bold">4x</h3>
                <p>faster reporting</p>
              </div>
              <div className="hidden md:block h-12 w-px bg-white/20"></div>
              <div>
                <h3 className="text-3xl font-bold">0%</h3>
                <p>FIR tampering</p>
              </div>
              <div className="hidden md:block h-12 w-px bg-white/20"></div>
              <div>
                <h3 className="text-3xl font-bold">95%</h3>
                <p>accessibility</p>
              </div>
            </div>
          </div>
        </section>
    )
}