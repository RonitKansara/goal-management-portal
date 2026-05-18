import { NextResponse } from "next/server"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data: goals } =
    await supabase
      .from("goals")
      .select("*")

  const { data: achievements } =
    await supabase
      .from("achievements")
      .select("*")

  const rows = goals?.map((goal) => {
    const achievement =
      achievements?.find(
        (a) => a.goal_id === goal.id
      )

    return {
      Goal: goal.goal_title,
      ThrustArea:
        goal.thrust_area,
      Target:
        goal.target_value,
      Weightage:
        goal.weightage,
      Status: goal.status,
      Actual:
        achievement?.actual_value || "",
      Quarter:
        achievement?.quarter || "",
      Progress:
        achievement?.progress_score ||
        "",
    }
  })

  const csv = [
    Object.keys(rows?.[0] || {}).join(","),
    ...(rows || []).map((row) =>
      Object.values(row).join(",")
    ),
  ].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type":
        "text/csv",
      "Content-Disposition":
        'attachment; filename="report.csv"',
    },
  })
}