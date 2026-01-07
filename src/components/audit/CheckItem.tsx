"use client"

import { useState } from "react"
import { CheckCircle, AlertTriangle, XCircle, MinusCircle, HelpCircle, ChevronDown, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { CheckResult, CheckStatus } from "@/types/audit"

interface CheckItemProps {
  check: CheckResult
  className?: string
}

const statusConfig: Record<CheckStatus, {
  icon: typeof CheckCircle
  color: string
  bgColor: string
  borderColor: string
  label: string
}> = {
  pass: {
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
    label: "Reussi",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
    label: "Attention",
  },
  fail: {
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    label: "Echec",
  },
  na: {
    icon: MinusCircle,
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    borderColor: "border-muted",
    label: "N/A",
  },
  manual: {
    icon: HelpCircle,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    label: "Manuel",
  },
}

export function CheckItem({ check, className }: CheckItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const config = statusConfig[check.status]
  const Icon = config.icon

  const hasDetails = check.details || check.recommendation || check.learnMoreUrl

  return (
    <div
      className={cn(
        "rounded-lg border transition-all duration-200",
        config.borderColor,
        hasDetails && "cursor-pointer hover:border-border",
        className
      )}
      onClick={() => hasDetails && setIsExpanded(!isExpanded)}
    >
      {/* Main row */}
      <div className="flex items-center gap-4 p-4">
        {/* Status icon */}
        <div className={cn("p-2 rounded-lg shrink-0", config.bgColor)}>
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>

        {/* Check info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">
              #{check.id}
            </span>
            <span className="text-foreground">
              {check.name}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
            {check.message}
          </p>
        </div>

        {/* Status badge */}
        <Badge
          variant="outline"
          className={cn(
            "shrink-0",
            config.color,
            config.borderColor
          )}
        >
          {config.label}
        </Badge>

        {/* Expand icon */}
        {hasDetails && (
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        )}
      </div>

      {/* Expanded details */}
      {isExpanded && hasDetails && (
        <div className="px-4 pb-4 pt-0 border-t border-border/50 mt-0">
          <div className="pt-4 space-y-3">
            {check.details && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Details
                </h4>
                <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                  {check.details}
                </p>
              </div>
            )}

            {check.recommendation && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Recommandation
                </h4>
                <p className="text-sm text-foreground/80">
                  {check.recommendation}
                </p>
              </div>
            )}

            {check.learnMoreUrl && (
              <a
                href={check.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                En savoir plus
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
