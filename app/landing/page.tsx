{/* Import From Other Pages */}
import Hero from "./hero";
import Navbar from "./landing-navbar";
import Pricing from "./pricing";
import Features from "./features";

export default function LoginPage() {  
  return (
    <div className="min-h-screen">

      {/* Navigation Bar */}
      <Navbar/>

      {/* Hero */}
      <Hero />

      {/* Features */}
      <Features />

      {/* Pricing */}
      <Pricing />

    </div>
  );
}
