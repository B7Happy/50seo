"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ScoreCircleProps {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ScoreCircle({
  score,
  size = 200,
  strokeWidth = 12,
  className,
}: ScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [mounted, setMounted] = useState(false)

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedScore / 100) * circumference

  // Determine color based on score
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-success"
    if (s >= 50) return "text-warning"
    return "text-destructive"
  }

  const getGradientId = (s: number) => {
    if (s >= 80) return "gradient-success"
    if (s >= 50) return "gradient-warning"
    return "gradient-destructive"
  }

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent"
    if (s >= 60) return "Bon"
    if (s >= 40) return "A ameliorer"
    return "Critique"
  }

  useEffect(() => {
    setMounted(true)
    // Animate score from 0 to target
    const duration = 1500
    const start = Date.now()
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(score * eased))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [score])

  if (!mounted) {
    return (
      <div
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
      >
        <div className="text-6xl font-display font-bold text-muted">--</div>
      </div>
    )
  }

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* SVG Circle */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="gradient-success" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.75 0.22 155)" />
            <stop offset="100%" stopColor="oklch(0.65 0.18 170)" />
          </linearGradient>
          <linearGradient id="gradient-warning" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.85 0.2 75)" />
            <stop offset="100%" stopColor="oklch(0.75 0.18 60)" />
          </linearGradient>
          <linearGradient id="gradient-destructive" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.25 25)" />
            <stop offset="100%" stopColor="oklch(0.6 0.22 15)" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${getGradientId(score)})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter="url(#glow)"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-6xl font-display font-bold tabular-nums", getScoreColor(score))}>
          {animatedScore}
        </span>
        <span className="text-sm text-muted-foreground font-medium mt-1">sur 100</span>
        <span className={cn("text-sm font-semibold mt-2", getScoreColor(score))}>
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  )
}
