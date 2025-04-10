import { AboutUs } from "../Landing/AboutUs";
import { FAQ } from "../Landing/Faq";
import { Features } from "../Landing/Features";
import { Footer } from "../Landing/Footer";
import { Header } from "../Landing/Header";
import { Hero } from "../Landing/Hero";
import { Stats } from "../Landing/Stats";
import "../../App.css"
import "../../global.css"
import "../../index.css"

export function LandingPage() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <AboutUs />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
