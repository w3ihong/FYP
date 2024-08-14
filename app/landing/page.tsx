{/* Import From Other Pages */}
import Hero from "./hero";
import Navbar from "./landing-navbar";
import Pricing from "./pricing";
import Features from "./features";
import FAQs from "./FAQs";
import FreeTrial from "./freetrial";
import Testimonials from "./testimonials";
import chatbot from '@/components/chatbot';



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

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQs />

      {/* Free Trial */}
      <FreeTrial />

     
      


    </div>
  );
}
