import React from 'react';
import Image from 'next/image';
import logo from "@/public/ESLogoWithText.png";
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="text-white bg-accent body-font font-bold font-raleway sticky top-0 z-10">
      <div className="w-full mx-auto flex flex-wrap p-4 flex-col md:flex-row items-center">

        {/* Logo */}
        <a href="#">
          <Image src={logo} alt="EchoSphere Logo" width={200} height={200} />
        </a>

        {/* Links to respective sections */}
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <a href="#features" className="mr-10 hover:text-secondary">Our Features</a>
          <a href="#testimonials" className="mr-10 hover:text-secondary">Testimonials</a>
          <a href="#pricing" className="mr-10 hover:text-secondary">Pricing</a>
          <a href="#freetrial" className="mr-10 hover:text-secondary">Free Trial</a>
        </nav>

        {/* Button */}
        <Link href='/landing/register'>
          <button className="inline-flex items-center bg-secondary border-0 py-1 px-6 font-bold focus:outline-none hover:bg-gray-200 rounded text-black text-base mt-4 md:mt-0">
            Register Now
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
