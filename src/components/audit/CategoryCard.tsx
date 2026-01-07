"use client"

import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { CheckItem } from "./CheckItem"
import type { AuditCategory, CheckStatus } from "@/types/audit"

interface CategoryCardProps {
  category: AuditCategory
  defaultOpen?: boolean
  filter?: CheckStatus | "all"
  className?: string
}

export function CategoryCard({
  category,
  defaultOpen = false,
  filter = "all",
  className,
}: CategoryCardProps) {
  // Filter checks based on current filter
  const filteredChecks = filter === "all"
    ? category.checks
    : category.checks.filter((check) => {
        if (filter === "fail") return check.status === "fail"
        if (filter === "warning") return check.status === "warning"
        if (filter === "pass") return check.status === "pass"
        return true
      })

  // Count statuses
  const statusCounts = {
    pass: category.checks.filter((c) => c.status === "pass").length,
    warning: category.checks.filter((c) => c.status === "warning").length,
    fail: category.checks.filter((c) => c.status === "fail").length,
  }

  // Calculate percentage for progress bar
  const percentage = category.maxScore > 0
    ? Math.round((category.score / category.maxScore) * 100)
    : 0

  // Determine progress color
  const getProgressColor = () => {
    if (percentage >= 80) return "bg-success"
    if (percentage >= 50) return "bg-warning"
    return "bg-destructive"
  }

  // Don't render if no checks match filter
  if (filteredChecks.length === 0) {
    return null
  }

  return (
    <div className={cn("rounded-xl border border-border bg-card/50", className)}>
      <Accordion type="single" collapsible defaultValue={defaultOpen ? category.id : undefined}>
        <AccordionItem value={category.id} className="border-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/30 rounded-t-xl transition-colors">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Icon */}
              <span className="text-2xl shrink-0">{category.icon}</span>

              {/* Title and progress */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h3 className="font-display font-semibold text-base truncate">
                    {category.name}
                  </h3>
                  <span className="text-sm font-mono text-muted-foreground shrink-0">
                    {category.score}/{category.maxScore}
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className="h-1.5"
                  indicatorClassName={getProgressColor()}
                />
              </div>

              {/* Status counts */}
              <div className="flex items-center gap-3 shrink-0 ml-4">
                {statusCounts.pass > 0 && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">{statusCounts.pass}</span>
                  </div>
                )}
                {statusCounts.warning > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium text-warning">{statusCounts.warning}</span>
                  </div>
                )}
                {statusCounts.fail > 0 && (
                  <div className="flex items-center gap-1">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">{statusCounts.fail}</span>
                  </div>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-3 pt-2">
              {filteredChecks.map((check) => (
                <CheckItem key={check.id} check={check} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
