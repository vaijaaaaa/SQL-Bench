"use client";
import Link from "next/link";
import { useState } from "react";
import {Zap,Menu,X,User} from "lucide-react";

export default function Navbar(){
    const [mobileMenuOpen,setMobileMenuOpen] = useState(false)

    const navLinks = [ 
        {name : "SQL 50",href : "/sql50"},
        {name : "SQL 75",href : "/sql75"},
        {name : "Dashboard",href : "/dashboard"},
        {name : "Problems",href : "/problems"},

    ];

    return (
        <nav className="sticky top-0 z-50 h-16 border-b border-[#262626] bg-[#050505] backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

                <Link href = "/" className="flex items-center gap-3 group">
                <div  className="w-9 h-9 rounded-xl bg-[#C6FE1E] flex items-center justify-center text-black transition-transform group-hover:scale-110">
                     <Zap size={20} fill="currentColor" />
                </div>
                    <span className="text-xl font-bold tracking-tight">SQL-Bench</span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link)=>(
                        <Link key = {link.name}
                        href={link.href}
                        className="px-4 py-2 text-sm font-semibold text-[#52525B] hover:text-white hover:bg-[#0A0A0A] rounded-xl transition-all">
                            {link.name}
                        </Link>
                    ))}
                </div>


                {/* user profile */}
                <div className="hidden md:flex items-center gap-4">
          <div className="px-4 py-1.5 bg-[#111] border border-[#262626] rounded-xl text-xs font-bold text-[#C6FE1E]">
            1,250 XP
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C6FE1E] to-[#00E0FF] p-[1.5px] cursor-pointer">
            <div className="w-full h-full rounded-[14px] bg-[#050505] flex items-center justify-center text-xs font-bold">
              JD
            </div>
          </div>
        </div>
                    <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#52525B] hover:text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
                    
            </div>

         {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#262626] bg-[#0A0A0A] animate-in slide-in-from-top-2 duration-200">
          <div className="px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-[#52525B] hover:text-white hover:bg-[#111] rounded-xl transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
    )
}