"use client"

import { useState } from "react"
import {signIn} from "next-auth/react"
import { useRouter,useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/components/ui/card"
import {Alert,AlertDescription} from "@/components/ui/alert"

export default function signInPage(){
    const router=  useRouter()
    const searchParams = useSearchParams()
    const registered = searchParams.get("registered")

    const [formData,setFormData] = useState({
        email : "",
        password : "",
    })

    const[error,setError] = useState("");
    const[loading,setLoading] = useState(false)

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const result = await signIn("credentials",{
                email : formData.email,
                password : formData.password,
                redirect:false,
            })

            if(result?.error){
                setError("Invaild email or password")
                setLoading(false)
                return
            }
            router.push("/")
            router.refresh()



        } catch (error) {
            setError("Something went wronf")
            setLoading(false)
        }
    }

    const handleGoogleSignIn = () => {
        signIn("google",{callbackUrl: "/"})
    }

    return (
        <div  className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Sign in to your account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Continue your SQL learning journey
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {registered && (
                        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                            <AlertDescription>
                                Account created successfullt! Please sign in.
                            </AlertDescription>
                        </Alert>
                    )}
                     <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input 
                                id = "email"
                                type ="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData,email : e.target.value})}
                                placeholder="you@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                            id = "password"
                            type ="password"
                            required
                            value = {formData.password}
                            onChange={(e) => setFormData({...formData,password:e.target.value})}
                            placeholder="********"
                            />
                            </div>

                            <Button type="submit" className="w-full" disabled = {loading} >
                            {loading ? "Signing in..." : "Sign in "}
                            </Button>

                             <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>


           <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
              Sign in with Google
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
                    </form>
                </CardContent>

            </Card>
        </div>
    )
}