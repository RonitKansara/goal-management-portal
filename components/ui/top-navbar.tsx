"use client"

import {
  Bell,
  Search,
  LogOut,
} from "lucide-react"

import { Input } from "@/components/ui/input"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

          <Input
            placeholder="Search goals..."
            className="border-slate-700 bg-slate-900 pl-10 text-white"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-300 hover:text-white">
            <Bell className="h-5 w-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback>
                  RK
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="border-slate-700 bg-slate-900 text-white">
              <DropdownMenuItem>
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}