
import Image from "next/image";
import landingpagegraphics from "@/public/LandingPageGraphic.png";

import Navbar from "@/app/landing/landingNavbar";
import Pricing from "./pricing";
import Features from "./features";


export default function LoginPage() {

  
  return (
    <div className="min-h-screen">

      {/* Navigation Bar */}
      <Navbar/>
      
      {/* Login Section */}
      <section id="login" className="flex flex-col md:flex-row">

        {/* Left Side: Graphics */}
        <div className="md:w-1/2 pl-8">
          <Image
            className="hidden h-auto max-w-300px md:block"
            src={landingpagegraphics}
            alt="graphics"
          />
        </div>

        {/* Right Side: Log in Form */}
        <div className="md:w-1/2 flex justify-center items-center bg-background">
          <div className="w-2/3">

            <h1 className="text-3xl font-mono font-bold mb-10 text-accent text-shadow-custom">Log in</h1>

            <div className="mb-8">
              <label htmlFor="email" className="block font-semibold text-accent mb-1">Email Address</label>
              <input type="email" id="email" className="border border-accent rounded px-3 py-2 w-full shadow-md" placeholder="Email Address" />
            </div>

            <div className="mb-20">
              <label htmlFor="password" className="block font-semibold text-accent mb-1">Password</label>
              <input type="password" id="password" className="border border-accent rounded px-3 py-2 w-full shadow-md" placeholder="Password" />
            </div>
            
            <div className="mb-3">
              <button className="bg-accent font-mono text-white px-4 py-2 rounded hover:bg-blue-800 w-full shadow-md">Log in</button>
            </div>

            <div className="text-center">
              <a href="#" className="text-accent font-semibold underline">Forgot Your Password?</a>
            </div>

          </div>
        </div>
      </section>

      <div className="mb-20"></div>

      <Features />

      <Pricing />

      <div className="mb-20"></div>

    </div>
  );
}
