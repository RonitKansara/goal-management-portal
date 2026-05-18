"use client"

import Link from "next/link"

import { usePathname } from "next/navigation"

import {
  LayoutDashboard,
  Target,
  Trophy,
  Users,
  Settings,
} from "lucide-react"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Goals",
    url: "/dashboard",
    icon: Target,
  },
  {
    title: "Achievements",
    url: "/dashboard",
    icon: Trophy,
  },
  {
    title: "Manager",
    url: "/manager",
    icon: Users,
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-800 bg-slate-950 lg:flex lg:flex-col">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-2xl font-bold text-white">
          GoalFlow
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Enterprise Performance Portal
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {items.map((item) => {
          const Icon = item.icon

          const active =
            pathname === item.url

          return (
            <Link
              key={item.title}
              href={item.url}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                active
                  ? "bg-cyan-500 text-black"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />

              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}