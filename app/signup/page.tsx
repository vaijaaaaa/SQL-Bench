"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap } from "lucide-react"


if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = 'nav { display: none !important; }';
  document.head.appendChild(style);
}

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
        setLoading(false)
        return
      }

      router.push("/signin?registered=true")
    } catch (error) {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 relative">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C6FE1E]/5 rounded-full blur-[120px]" />
      
      <div className="relative z-10 w-full max-w-md">

        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-[#C6FE1E] flex items-center justify-center text-black transition-transform group-hover:scale-110">
              <Zap size={24} fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">SQL-Bench</span>
          </Link>
        </div>

        <div className="p-8 bg-[#0A0A0A] border border-[#262626]/50 rounded-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-[#71717A] text-sm">
              Start your SQL learning journey today
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#A1A1AA] text-sm font-semibold">Name</Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="h-12 bg-[#111] border-[#262626] text-white placeholder:text-[#52525B] focus:border-[#C6FE1E]/30 focus-visible:ring-[#C6FE1E]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#A1A1AA] text-sm font-semibold">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="h-12 bg-[#111] border-[#262626] text-white placeholder:text-[#52525B] focus:border-[#C6FE1E]/30 focus-visible:ring-[#C6FE1E]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#A1A1AA] text-sm font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="h-12 bg-[#111] border-[#262626] text-white placeholder:text-[#52525B] focus:border-[#C6FE1E]/30 focus-visible:ring-[#C6FE1E]/20"
              />
              <p className="text-xs text-[#71717A]">
                At least 6 characters
              </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 bg-[#C6FE1E] hover:bg-[#b5ed0d] text-black font-bold rounded-lg transition-all disabled:opacity-50">
              {loading ? "Creating account..." : "Sign up"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#262626]"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0A0A0A] px-3 text-[#71717A] font-semibold">or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="w-full h-12 bg-[#111] border-[#262626] hover:bg-[#1A1A1A] text-white font-semibold"
              onClick={handleGoogleSignUp}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>

            <p className="text-center text-sm text-[#71717A]">
              Already have an account?{" "}
              <Link href="/signin" className="font-medium text-[#C6FE1E] hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}