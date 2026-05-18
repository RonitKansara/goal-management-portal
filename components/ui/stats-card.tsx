import { Card, CardContent } from "@/components/ui/card"

export function StatsCard({
  title,
  value,
  icon,
}: any) {
  return (
    <Card className="border-slate-800 bg-slate-900/60 text-white transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <div className="rounded-2xl bg-cyan-500/10 p-4 text-cyan-400">
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}