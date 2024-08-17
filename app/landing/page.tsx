{/* Import From Other Pages */}
import Hero from "./hero";
import Navbar from "./landing-navbar";
import Pricing from "./pricing";
import Features from "./features";
import FAQs from "./FAQs";

import Testimonials from "./testimonials";
import VoiceflowChat from '@/components/chatbot'; 



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

      {/* Chatbot */}
      <VoiceflowChat /> 


     
      


    </div>
  );
}
