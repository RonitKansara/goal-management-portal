"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import { createClient } from "@/lib/supabase/client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

export default function AdminPage() {
  const supabase = createClient()

  const router = useRouter()

  const [users, setUsers] = useState<any[]>(
    []
  )

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    const { data: profile } =
      await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()

    if (!profile) return

    if (profile.role === "employee") {
      router.replace("/dashboard")
      return
    }

    if (profile.role === "manager") {
      router.replace("/manager")
      return
    }

    fetchUsers()
  }

  async function fetchUsers() {
    const { data, error } =
      await supabase
        .from("users")
        .select("*")

    if (!error && data) {
      setUsers(data)
    }
  }

  async function makeManager(
    id: string
  ) {
    const { error } = await supabase
      .from("users")
      .update({
        role: "manager",
      })
      .eq("id", id)

    if (error) {
      alert(error.message)
    } else {
      alert("User promoted")

      fetchUsers()
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Manage users and roles
          </p>
        </div>

        <div className="grid gap-5">
          {users.map((user) => (
            <Card
              key={user.id}
              className="bg-slate-900 text-white"
            >
              <CardHeader>
                <CardTitle>
                  {user.email}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex items-center justify-between">
                <div>
                  <p>
                    Role:
                    {" "}
                    <strong>
                      {user.role}
                    </strong>
                  </p>
                </div>

                {user.role ===
                  "employee" && (
                  <Button
                    onClick={() =>
                      makeManager(
                        user.id
                      )
                    }
                    className="bg-cyan-500 text-black hover:bg-cyan-400"
                  >
                    Make Manager
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}