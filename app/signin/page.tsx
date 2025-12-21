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
    }
}