"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, Mail, Terminal, ArrowRight, Loader2 } from "lucide-react"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { motion } from "motion/react"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")

  const [formData, setFormData] = useState({
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
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        setLoading(false)
        return
      }
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="min-h-screen w-full flex">
      
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
              alt="Background" 
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>

          <div className="relative z-10 p-12 w-full h-full flex flex-col justify-between text-white">
              <div className="flex items-center gap-2">
                  <div className="h-[1px] w-8 bg-white/50"></div>
                  <span className="text-xs font-medium tracking-widest uppercase text-white/80">Query of the Day</span>
              </div>

              <div className="font-mono">
                  <h1 className="text-5xl font-bold mb-4 leading-tight">
                      <span className="text-blue-400">SELECT</span> * <br/>
                      <span className="text-purple-400">FROM</span> <br/>
                      SUCCESS
                  </h1>
                  <p className="text-white/60 text-sm max-w-xs">
                      <span className="text-pink-400">WHERE</span> <br/>
                      effort = <span className="text-green-400">'MAXIMUM'</span> <br/>
                      <span className="text-yellow-400">AND</span> consistency = <span className="text-blue-400">TRUE</span>;
                  </p>
              </div>
          </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-white text-black flex flex-col items-center justify-center p-12 relative">
          {/* Logo */}
            <div className="absolute top-8 left-8 flex items-center gap-2">
              <Zap size={20} className="text-black" fill="currentColor" />
              <span className="font-bold text-lg">SQL-Bench</span>
            </div>

            <div className="w-full max-w-sm space-y-6">
              <div className="text-center mb-8">
                  <h2 className="text-3xl font-serif mb-2">Welcome Back</h2>
                  <p className="text-gray-500 text-sm">Enter your email and password to access your account</p>
              </div>

              {registered && (
                  <Alert className="bg-green-50 text-green-600 border-green-200 mb-4">
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                      Account created successfully! Please sign in.
                  </AlertDescription>
                  </Alert>
              )}

              {error && (
                  <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                  </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-medium text-gray-700">Email</Label>
                      <Input 
                          id="email" 
                          type="email" 
                          placeholder="Enter your email"
                          className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-all h-10 rounded-lg text-sm text-black"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                      />
                  </div>
                  
                  <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-xs font-medium text-gray-700">Password</Label>
                      <div className="relative">
                          <Input 
                              id="password" 
                              type="password" 
                              placeholder="Enter your password"
                              className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-all h-10 rounded-lg text-sm pr-10 text-black"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              required
                          />
                      </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 cursor-pointer text-gray-500 select-none">
                          <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                          Remember me
                      </label>
                      <Link href="/forgot-password" className="text-black font-medium hover:underline">
                          Forgot Password
                      </Link>
                  </div>

                  <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 h-10 rounded-lg font-medium mt-2" disabled={loading}>
                      {loading ? (
                          <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                          </>
                      ) : (
                          "Sign In"
                      )}
                  </Button>

                  <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-gray-200 text-black hover:bg-gray-50 h-10 rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                  >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                      Sign In with Google
                  </Button>
              </form>

              <p className="text-center text-xs text-gray-500 mt-8">
                  Don't have an account? <Link href="/signup" className="text-black font-bold hover:underline">Sign Up</Link>
              </p>
            </div>
      </div>
    </div>
  )
}