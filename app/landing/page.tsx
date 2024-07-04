{/* Import From Other Pages */}
import Hero from "./hero";
import Navbar from "./landing-navbar";
import Pricing from "./pricing";
import Features from "./features";
import FreeTrial from "./freetrial";
import Testimonials from "./testimonials";

export default function LoginPage() {  
  return (
    <div className="min-h-screen">

      {/* Navigation Bar */}
      <Navbar/>

      {/* Hero */}
      <Hero />

      {/* Features */}
      <Features />

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing */}
      <Pricing />

      {/* Free Trial */}
      <FreeTrial />


    </div>
  );
}
