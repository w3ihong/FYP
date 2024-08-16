import React from 'react';
import Image from "next/image";
import Link from "next/link";  // Import the Link component
import logo from "@/public/ESLogoWithText.png";

const Footer = () => {
  return (
    <footer className="bg-accent text-gray-600 body-font py-8 px-24">
      <div className="container px-5 mx-auto flex items-center justify-center md:flex-row md:flex-nowrap flex-wrap flex-col">
        <div className="mx-auto text-center md:text-left mb-24">
          <Image src={logo} alt="Logo" width={170} height={170} />
        </div>
        <div className="flex-grow flex flex-wrap md:pl-20 md:mt-0 mt-10 md:text-left text-center">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-mono font-bold text-white tracking-widest text-sm mb-3">SUPPORT</h2>
            <nav className="list-none mb-10">
              <li>
              <Link href="/landing/privacyPolicy" className="text-white hover:text-secondary">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/landing/contact" className="text-white hover:text-secondary">
                  Contact Us
                </Link>
              </li>
            </nav>
          </div>
        </div>
      </div>
      <div className="bg-accent">
        <div className="container mx-auto py-2 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-gray-500 text-sm text-center sm:text-left">© 2024 EchoSphere — All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
