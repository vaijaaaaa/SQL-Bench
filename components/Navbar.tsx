"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {Zap,Menu,X,LogOut} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar(){
    const { data: session, status } = useSession();
    const [mobileMenuOpen,setMobileMenuOpen] = useState(false)

    const navLinks = [ 
        {name : "Dashboard",href : "/dashboard"},
        {name : "SQL 50",href : "/sql50"},
        {name : "SQL 75",href : "/sql75"},
        {name : "Joins",href : "/joins"},
        {name : "Self Query",href : "/selfquery"},
    ];

    return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="h-16 px-6 flex items-center justify-between bg-[#0A0A0A]/40 backdrop-blur-xl border border-[#262626]/50 rounded-2xl shadow-lg">
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


              
                <div className="hidden md:flex items-center gap-4">
          {status === "loading" ? (
            <div className="w-10 h-10 rounded-2xl bg-[#111] animate-pulse" />
          ) : session?.user ? (
            <>
              
              <div className="relative group">
                <Link href="/profile" className="block">
                  {session.user.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || "User"}
                      className="w-10 h-10 rounded-2xl hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C6FE1E] to-[#00E0FF] p-[1.5px] hover:scale-105 transition-transform">
                      <div className="w-full h-full rounded-[14px] bg-[#050505] flex items-center justify-center text-xs font-bold">
                        {session.user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </div>
                    </div>
                  )}
                </Link>
              
                <div className="absolute right-0 top-12 w-48 bg-[#0A0A0A] border border-[#262626] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-3 border-b border-[#262626]">
                    <p className="text-sm font-semibold text-white truncate">{session.user.name}</p>
                    <p className="text-xs text-[#71717A] truncate">{session.user.email}</p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/signin' })}
                    className="w-full px-3 py-2 text-left text-sm text-[#EF4444] hover:bg-[#111] rounded-b-xl transition-colors flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link href="/signin" className="px-4 py-2 bg-[#C6FE1E] hover:bg-[#b5ed0d] text-black font-semibold text-sm rounded-xl transition-all">
              Sign In
            </Link>
          )}
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