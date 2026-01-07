"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Globe, Search, FileCode, Zap, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface AuditLoadingProps {
  domain: string
  status: "pending" | "running"
  className?: string
}

const steps = [
  { icon: Globe, label: "Connexion au site", duration: 2000 },
  { icon: FileCode, label: "Analyse du code HTML", duration: 3000 },
  { icon: Search, label: "Verification des balises SEO", duration: 4000 },
  { icon: Zap, label: "Test de performance", duration: 3000 },
  { icon: Shield, label: "Verification de securite", duration: 2000 },
]

export function AuditLoading({ domain, status, className }: AuditLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (status !== "running") return

    // Simulate progress through steps
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0)
    let elapsed = 0

    const interval = setInterval(() => {
      elapsed += 100
      const newProgress = Math.min((elapsed / totalDuration) * 100, 95)
      setProgress(newProgress)

      // Calculate current step
      let stepElapsed = 0
      for (let i = 0; i < steps.length; i++) {
        stepElapsed += steps[i].duration
        if (elapsed < stepElapsed) {
          setCurrentStep(i)
          break
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [status])

  return (
    <div className={cn("min-h-[60vh] flex items-center justify-center", className)}>
      <div className="max-w-md w-full mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Animated loader */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-secondary" />
            <div
              className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
              style={{ animationDuration: "1.5s" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-display font-bold mb-2">
            Analyse en cours...
          </h1>
          <p className="text-muted-foreground mb-6">
            <span className="font-mono text-primary">{domain}</span>
          </p>

          {/* Progress bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground font-mono">
              {Math.round(progress)}%
            </p>
          </div>

          {/* Current step */}
          <div className="space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isComplete = index < currentStep

              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isActive || isComplete ? 1 : 0.4,
                    x: 0,
                  }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-colors",
                    isActive && "bg-primary/10 border border-primary/20",
                    isComplete && "text-success"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive && "text-primary animate-pulse",
                    isComplete && "text-success"
                  )} />
                  <span className={cn(
                    "text-sm",
                    isActive && "font-medium text-foreground",
                    !isActive && !isComplete && "text-muted-foreground"
                  )}>
                    {step.label}
                  </span>
                  {isActive && (
                    <Loader2 className="w-4 h-4 ml-auto text-primary animate-spin" />
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Estimated time */}
          <p className="mt-8 text-sm text-muted-foreground">
            Temps estime : ~2 minutes
          </p>
        </motion.div>
      </div>
    </div>
  )
}
