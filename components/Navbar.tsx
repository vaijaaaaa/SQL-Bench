"use client";
import Link from "next/link";
import { useState } from "react";
import { Zap, Menu, X, LogOut, User, ChevronRight } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/compiler") || pathname === "/signin" || pathname === "/signup") {
    return null;
  }

  const navLinks = [
    { name: "SQL 50", href: "/sql50" },
    { name: "SQL 75", href: "/sql75" },
    { name: "Joins", href: "/joins" },
    { name: "Self Query", href: "/selfquery" },
    { name: "Leaderboard", href: "/leaderboard" },
  ];

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="h-14 px-4 flex items-center justify-between bg-background/60 backdrop-blur-lg border border-border/40 rounded-full shadow-sm dark:shadow-2xl dark:bg-black/50 dark:border-white/10 transition-all duration-300">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 pl-2 group">
            <div className="text-primary transition-transform group-hover:scale-110 group-hover:rotate-3">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground">SQL-Bench</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth / Mobile Toggle */}
          <div className="flex items-center gap-2 pr-1">
            <ModeToggle />
            
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session?.user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-border/50">
                <Link href="/profile" className="hidden md:block">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border border-border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border text-muted-foreground">
                      <User size={14} />
                    </div>
                  )}
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => signOut()}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-full w-8 h-8"
                >
                  <LogOut size={14} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-border/50">
                <Link href="/signin">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-transparent text-xs h-8">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold h-8 rounded-full px-4 shadow-[0_0_10px_rgba(198,254,30,0.2)] dark:shadow-[0_0_20px_rgba(198,254,30,0.3)] transition-shadow">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 md:hidden animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-4 rounded-xl bg-accent/50 border border-border/50 text-foreground hover:bg-accent transition-all"
              >
                <span className="font-medium">{link.name}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Link>
            ))}
            {!session && (
               <div className="grid grid-cols-2 gap-4 mt-4">
                 <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                   <Button variant="outline" className="w-full border-border bg-transparent text-foreground hover:bg-accent">
                     Sign In
                   </Button>
                 </Link>
                 <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                   <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                     Get Started
                   </Button>
                 </Link>
               </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}