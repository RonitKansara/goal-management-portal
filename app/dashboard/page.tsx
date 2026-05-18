"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import { createClient } from "@/lib/supabase/client"

import {
  Target,
  Trophy,
  ClipboardCheck,
  Activity,
} from "lucide-react"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import { Textarea } from "@/components/ui/textarea"

import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const supabase = createClient()

  const router = useRouter()

  const [user, setUser] = useState<any>(null)

  const [goals, setGoals] = useState<any[]>(
    []
  )

  const [thrustArea, setThrustArea] =
    useState("")

  const [goalTitle, setGoalTitle] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [uomType, setUomType] =
    useState("MIN")

  const [targetValue, setTargetValue] =
    useState("")

  const [weightage, setWeightage] =
    useState("")

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    setUser(user)

    const { data: profile } =
      await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()

    if (!profile) return

    if (profile.role === "manager") {
      router.replace("/manager")
      return
    }

    if (profile.role === "admin") {
      router.replace("/admin")
      return
    }

    fetchGoals(user.id)
  }

  async function fetchGoals(
    userId: string
  ) {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("employee_id", userId)

    if (!error && data) {
      setGoals(data)
    }
  }

  async function createGoal() {
    if (!user) return

    const totalWeightage =
      goals.reduce(
        (sum, goal) =>
          sum + Number(goal.weightage),
        0
      ) + Number(weightage)

    if (goals.length >= 8) {
      alert("Maximum 8 goals allowed")
      return
    }

    if (Number(weightage) < 10) {
      alert(
        "Minimum weightage is 10%"
      )
      return
    }

    if (totalWeightage > 100) {
      alert(
        "Total weightage cannot exceed 100%"
      )
      return
    }

    const { error } = await supabase
      .from("goals")
      .insert([
        {
          employee_id: user.id,
          thrust_area: thrustArea,
          goal_title: goalTitle,
          description,
          uom_type: uomType,
          target_value:
            Number(targetValue),
          weightage:
            Number(weightage),
          status: "draft",
        },
      ])

    if (error) {
      alert(error.message)
    } else {
      alert("Goal created")

      setThrustArea("")
      setGoalTitle("")
      setDescription("")
      setTargetValue("")
      setWeightage("")

      fetchGoals(user.id)
    }
  }

  async function submitGoals() {
    const totalWeightage =
      goals.reduce(
        (sum, goal) =>
          sum + Number(goal.weightage),
        0
      )

    if (totalWeightage !== 100) {
      alert(
        "Total weightage must equal 100%"
      )
      return
    }

    const ids = goals.map(
      (goal) => goal.id
    )

    const { error } = await supabase
      .from("goals")
      .update({
        status: "submitted",
        locked: true,
      })
      .in("id", ids)

    if (error) {
      alert(error.message)
    } else {
      alert("Goals submitted")

      fetchGoals(user.id)
    }
  }
  async function logout() {
  await supabase.auth.signOut()

  router.push("/login")
}

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 p-8">
          <p className="text-sm uppercase tracking-widest text-cyan-300">
            Enterprise Goal Management
          </p>

          <div className="flex items-center justify-between">
  <div>
    <h1 className="mt-3 text-5xl font-bold">
      Welcome back 👋
    </h1>

    <p className="mt-4 max-w-2xl text-slate-300">
      Manage performance goals and achievements.
    </p>
  </div>

  <Button
    onClick={logout}
    variant="destructive"
  >
    Logout
  </Button>
</div>

          <p className="mt-4 max-w-2xl text-slate-300">
            Manage performance goals and achievements.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900 text-white">
            <CardContent className="p-6">
              <Target className="mb-3 h-8 w-8 text-cyan-400" />

              <p>Total Goals</p>

              <h2 className="mt-3 text-4xl font-bold">
                {goals.length}
              </h2>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900 text-white">
            <CardContent className="p-6">
              <ClipboardCheck className="mb-3 h-8 w-8 text-green-400" />

              <p>Approved</p>

              <h2 className="mt-3 text-4xl font-bold">
                {
                  goals.filter(
                    (g) =>
                      g.status ===
                      "approved"
                  ).length
                }
              </h2>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900 text-white">
            <CardContent className="p-6">
              <Activity className="mb-3 h-8 w-8 text-yellow-400" />

              <p>Draft Goals</p>

              <h2 className="mt-3 text-4xl font-bold">
                {
                  goals.filter(
                    (g) =>
                      g.status === "draft"
                  ).length
                }
              </h2>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900 text-white">
            <CardContent className="p-6">
              <Trophy className="mb-3 h-8 w-8 text-pink-400" />

              <p>Weightage</p>

              <h2 className="mt-3 text-4xl font-bold">
                {goals.reduce(
                  (sum, goal) =>
                    sum +
                    Number(goal.weightage),
                  0
                )}
                %
              </h2>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">
              Create Goal
            </h2>

            <div className="mt-6 space-y-4">
              <Input
                placeholder="Thrust Area"
                value={thrustArea}
                onChange={(e) =>
                  setThrustArea(
                    e.target.value
                  )
                }
              />

              <Input
                placeholder="Goal Title"
                value={goalTitle}
                onChange={(e) =>
                  setGoalTitle(
                    e.target.value
                  )
                }
              />

              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
              />

              <select
                value={uomType}
                onChange={(e) =>
                  setUomType(
                    e.target.value
                  )
                }
                className="w-full rounded-md border border-slate-700 bg-slate-950 p-3 text-white"
              >
                <option value="MIN">
                  MIN
                </option>

                <option value="MAX">
                  MAX
                </option>

                <option value="TIMELINE">
                  TIMELINE
                </option>

                <option value="ZERO">
                  ZERO
                </option>
              </select>

              <Input
                type="number"
                placeholder="Target Value"
                value={targetValue}
                onChange={(e) =>
                  setTargetValue(
                    e.target.value
                  )
                }
              />

              <Input
                type="number"
                placeholder="Weightage %"
                value={weightage}
                onChange={(e) =>
                  setWeightage(
                    e.target.value
                  )
                }
              />

              <Button
                onClick={createGoal}
                className="w-full bg-cyan-500 text-black hover:bg-cyan-400"
              >
                Create Goal
              </Button>

              <Button
                onClick={submitGoals}
                className="w-full bg-green-500 text-black hover:bg-green-400"
              >
                Submit Goals
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}