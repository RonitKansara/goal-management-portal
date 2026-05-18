"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import Link from "next/link"

import { createClient } from "@/lib/supabase/client"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

export default function LoginPage() {
  const supabase = createClient()

  const router = useRouter()

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [errorMessage, setErrorMessage] =
    useState("")

  async function login() {
    try {
      setLoading(true)

      setErrorMessage("")

      if (!email || !password) {
        setErrorMessage(
          "Please enter email and password"
        )

        setLoading(false)

        return
      }

      const { data, error } =
        await supabase.auth.signInWithPassword(
          {
            email,
            password,
          }
        )

      if (error) {
        setErrorMessage(
          error.message
        )

        setLoading(false)

        return
      }

      if (!data.user) {
        setErrorMessage(
          "Login failed"
        )

        setLoading(false)

        return
      }

      const { data: profile } =
        await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle()

      if (!profile) {
        router.push("/dashboard")

        return
      }

      if (
        profile.role ===
        "employee"
      ) {
        router.push("/dashboard")
      }

      else if (
        profile.role ===
        "manager"
      ) {
        router.push("/manager")
      }

      else if (
        profile.role === "admin"
      ) {
        router.push("/admin")
      }

      else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      setErrorMessage(
        "Something went wrong"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-6 text-white">
      <Card className="w-full max-w-md border border-slate-800 bg-slate-900 text-white shadow-2xl shadow-cyan-500/10">
        <CardContent className="space-y-6 p-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-cyan-400">
              GoalFlow
            </h1>

            <p className="mt-3 text-slate-400">
              Enterprise Goal Tracking
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
              className="border-slate-700 bg-slate-950 text-white"
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
              className="border-slate-700 bg-slate-950 text-white"
            />

            {errorMessage && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {errorMessage}
              </div>
            )}

            <Button
              onClick={login}
              disabled={loading}
              className="w-full bg-cyan-500 text-black hover:bg-cyan-400"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </Button>

            <p className="text-center text-sm text-slate-400">
              Don&apos;t have an
              account?{" "}
              <Link
                href="/signup"
                className="text-cyan-400 hover:underline"
              >
                Signup
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}