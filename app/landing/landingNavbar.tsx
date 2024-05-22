"use client"

import React from 'react'
import Image from "next/image";
import logo from "@/public/ESLogoWithText.png"
import Link from 'next/link';

export default function Navbar() {
    return (
        <div className="w-full bg-accent h-14 sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 h-full">  
                {/* Left Side */}
                <div className="flex items-center gap-4 pl-8">
                    {/* Logo */}
                    <a href="#login">
                        <Image src={logo} alt="EchoSphere Logo" width={250} />
                    </a>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-20 font-mono">
                    <a href="#features" className="text-white font-semibold hover:text-secondary">Our Features</a>
                    <a href="#pricing" className="text-white font-semibold hover:text-secondary">Pricing</a>
                    <a href="#about" className="text-white font-semibold hover:text-secondary">About Us</a>
                    <Link href='/landing/register' className="bg-secondary font-bold text-black px-6 py-1 rounded-md hover:bg-opacity-75 mr-14">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    )
}
