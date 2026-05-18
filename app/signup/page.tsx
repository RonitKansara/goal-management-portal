"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { createClient } from "@/lib/supabase/client"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

import { Card, CardContent } from "@/components/ui/card"

export default function SignupPage() {
  const supabase = createClient()

  const router = useRouter()

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  async function signup() {
    setLoading(true)

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      })

    if (error) {
      alert(error.message)

      setLoading(false)

      return
    }

    await supabase.from("users").insert([
      {
        id: data.user?.id,
        email,
        role: "employee",
      },
    ])

    alert(
      "Signup successful. Please login."
    )

    router.push("/login")

    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-6 text-white">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-white">
        <CardContent className="space-y-6 p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-cyan-400">
              GoalFlow
            </h1>

            <p className="mt-3 text-slate-400">
              Create your account
            </p>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <Button
              onClick={signup}
              disabled={loading}
              className="w-full bg-cyan-500 text-black hover:bg-cyan-400"
            >
              {loading
                ? "Creating..."
                : "Signup"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}