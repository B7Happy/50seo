"use client"

import { CheckCircle, AlertTriangle, XCircle, MinusCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResultsSummaryProps {
  passed: number
  warnings: number
  critical: number
  notApplicable: number
  className?: string
}

export function ResultsSummary({
  passed,
  warnings,
  critical,
  notApplicable,
  className,
}: ResultsSummaryProps) {
  const stats = [
    {
      label: "Reussis",
      value: passed,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20",
    },
    {
      label: "Avertissements",
      value: warnings,
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/20",
    },
    {
      label: "Critiques",
      value: critical,
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/20",
    },
    {
      label: "Non applicable",
      value: notApplicable,
      icon: MinusCircle,
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
      borderColor: "border-muted",
    },
  ]

  const total = passed + warnings + critical

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "relative p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02]",
            stat.bgColor,
            stat.borderColor
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("p-2 rounded-lg", stat.bgColor)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
          </div>
          <div className={cn("text-3xl font-display font-bold tabular-nums", stat.color)}>
            {stat.value}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {stat.label}
          </div>
          {total > 0 && stat.label !== "Non applicable" && (
            <div className="absolute top-4 right-4 text-xs text-muted-foreground font-mono">
              {Math.round((stat.value / total) * 100)}%
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
