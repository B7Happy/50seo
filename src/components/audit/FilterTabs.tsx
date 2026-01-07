"use client"

import { CheckCircle, AlertTriangle, XCircle, List } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CheckStatus } from "@/types/audit"

interface FilterTabsProps {
  value: CheckStatus | "all"
  onChange: (value: CheckStatus | "all") => void
  counts: {
    all: number
    pass: number
    warning: number
    fail: number
  }
  className?: string
}

export function FilterTabs({ value, onChange, counts, className }: FilterTabsProps) {
  const filters = [
    {
      value: "all" as const,
      label: "Tous",
      icon: List,
      count: counts.all,
      color: "text-foreground",
    },
    {
      value: "fail" as const,
      label: "Critiques",
      icon: XCircle,
      count: counts.fail,
      color: "text-destructive",
    },
    {
      value: "warning" as const,
      label: "Warnings",
      icon: AlertTriangle,
      count: counts.warning,
      color: "text-warning",
    },
    {
      value: "pass" as const,
      label: "Reussis",
      icon: CheckCircle,
      count: counts.pass,
      color: "text-success",
    },
  ]

  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as CheckStatus | "all")} className={className}>
      <TabsList className="h-auto p-1 bg-secondary/50">
        {filters.map((filter) => (
          <TabsTrigger
            key={filter.value}
            value={filter.value}
            className={cn(
              "gap-2 px-4 py-2 data-[state=active]:bg-background",
              value === filter.value && filter.color
            )}
          >
            <filter.icon className={cn("h-4 w-4", filter.color)} />
            <span className="hidden sm:inline">{filter.label}</span>
            <span className={cn(
              "text-xs font-mono px-1.5 py-0.5 rounded-md",
              value === filter.value ? "bg-secondary" : "bg-muted/50"
            )}>
              {filter.count}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
