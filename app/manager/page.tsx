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

export default function ManagerPage() {
  const supabase = createClient()

  const router = useRouter()

  const [goals, setGoals] = useState<any[]>(
    []
  )

  useEffect(() => {
    checkManager()
  }, [])

  async function checkManager() {
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

    if (profile.role === "admin") {
      router.replace("/admin")
      return
    }

    fetchGoals()
  }

  async function fetchGoals() {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("status", "submitted")

    if (!error && data) {
      setGoals(data)
    }
  }

  async function approveGoal(id: string) {
    const { error } = await supabase
      .from("goals")
      .update({
        status: "approved",
      })
      .eq("id", id)

    if (error) {
      alert(error.message)
    } else {
      alert("Goal approved")

      fetchGoals()
    }
  }

  async function returnGoal(id: string) {
    const { error } = await supabase
      .from("goals")
      .update({
        status: "rework",
        locked: false,
      })
      .eq("id", id)

    if (error) {
      alert(error.message)
    } else {
      alert("Returned for rework")

      fetchGoals()
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold">
            Manager Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Review submitted employee goals
          </p>
        </div>

        {goals.length === 0 && (
          <Card className="border-slate-700 bg-slate-900 text-white">
            <CardContent className="p-10 text-center text-slate-400">
              No submitted goals
            </CardContent>
          </Card>
        )}

        <div className="space-y-5">
          {goals.map((goal) => (
            <Card
              key={goal.id}
              className="border-slate-700 bg-slate-900 text-white"
            >
              <CardHeader>
                <CardTitle>
                  {goal.goal_title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p>
                  <strong>
                    Thrust Area:
                  </strong>{" "}
                  {goal.thrust_area}
                </p>

                <p>
                  <strong>
                    Description:
                  </strong>{" "}
                  {goal.description}
                </p>

                <p>
                  <strong>UOM:</strong>{" "}
                  {goal.uom_type}
                </p>

                <p>
                  <strong>
                    Weightage:
                  </strong>{" "}
                  {goal.weightage}%
                </p>

                <p>
                  <strong>
                    Target:
                  </strong>{" "}
                  {goal.target_value}
                </p>

                <div className="flex gap-3">
                  <Button
                    onClick={() =>
                      approveGoal(goal.id)
                    }
                    className="bg-green-500 text-black hover:bg-green-400"
                  >
                    Approve
                  </Button>

                  <Button
                    onClick={() =>
                      returnGoal(goal.id)
                    }
                    variant="destructive"
                  >
                    Return for Rework
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}