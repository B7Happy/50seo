"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ExternalLink, Share2, RotateCcw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScoreCircle } from "@/components/audit/ScoreCircle"
import { ResultsSummary } from "@/components/audit/ResultsSummary"
import { CategoryCard } from "@/components/audit/CategoryCard"
import { FilterTabs } from "@/components/audit/FilterTabs"
import { EmailCapture } from "@/components/audit/EmailCapture"
import { CTASearchXLab } from "@/components/audit/CTASearchXLab"
import { AuditLoading } from "@/components/audit/AuditLoading"
import type { AuditCategory, CheckStatus } from "@/types/audit"

interface AuditResponse {
  id: string
  url: string
  domain: string
  status: "pending" | "running" | "completed" | "failed"
  score: number | null
  createdAt: string
  completedAt?: string
  results?: {
    summary: {
      passed: number
      warnings: number
      critical: number
      notApplicable: number
    }
    categories: AuditCategory[]
  }
  error?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function ResultsPage() {
  const params = useParams()
  const id = params.id as string

  const [audit, setAudit] = useState<AuditResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<CheckStatus | "all">("all")

  const fetchAudit = useCallback(async () => {
    try {
      const response = await fetch(`/api/audit/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement")
      }

      setAudit(data)
      setError(null)

      // Continue polling if still processing
      if (data.status === "pending" || data.status === "running") {
        return true // Should continue polling
      }
      return false // Stop polling
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null

    const startPolling = async () => {
      const shouldContinue = await fetchAudit()

      if (shouldContinue) {
        pollInterval = setInterval(async () => {
          const shouldContinuePolling = await fetchAudit()
          if (!shouldContinuePolling && pollInterval) {
            clearInterval(pollInterval)
          }
        }, 3000) // Poll every 3 seconds
      }
    }

    startPolling()

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  }, [fetchAudit])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Audit SEO - ${audit?.domain}`,
          text: `Score SEO: ${audit?.score}/100`,
          url,
        })
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url)
      // TODO: Show toast notification
    }
  }

  const handleNewAudit = () => {
    window.location.href = "/"
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  // Error state
  if (error || !audit) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-display font-bold mb-2">
              Erreur
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || "Audit non trouve"}
            </p>
            <Button onClick={handleNewAudit} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Nouvel audit
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Processing state
  if (audit.status === "pending" || audit.status === "running") {
    return (
      <AuditLoading
        domain={audit.domain}
        status={audit.status}
      />
    )
  }

  // Failed state
  if (audit.status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-display font-bold mb-2">
              Analyse echouee
            </h1>
            <p className="text-muted-foreground mb-2">
              {audit.error || "Une erreur est survenue lors de l'analyse"}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {audit.domain}
            </p>
            <Button onClick={handleNewAudit} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Completed state - show results
  const { results } = audit
  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Aucun resultat disponible</p>
      </div>
    )
  }

  // Calculate filter counts
  const filterCounts = {
    all: results.categories.reduce((acc, cat) => acc + cat.checks.length, 0),
    pass: results.summary.passed,
    warning: results.summary.warnings,
    fail: results.summary.critical,
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero section with score */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[150px]" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container relative"
        >
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Resultat de votre audit
              </h1>
              <a
                href={audit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <span className="font-mono">{audit.domain}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Score circle */}
            <motion.div variants={itemVariants} className="flex justify-center mb-10">
              <ScoreCircle score={audit.score || 0} size={220} />
            </motion.div>

            {/* Summary */}
            <motion.div variants={itemVariants}>
              <ResultsSummary
                passed={results.summary.passed}
                warnings={results.summary.warnings}
                critical={results.summary.critical}
                notApplicable={results.summary.notApplicable}
              />
            </motion.div>

            {/* Actions */}
            <motion.div variants={itemVariants} className="flex justify-center gap-4 mt-8">
              <Button variant="outline" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Partager
              </Button>
              <Button variant="outline" onClick={handleNewAudit} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Nouvel audit
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Results section */}
      <section className="container">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Filter tabs */}
            <motion.div variants={itemVariants} className="mb-6">
              <FilterTabs
                value={filter}
                onChange={setFilter}
                counts={filterCounts}
              />
            </motion.div>

            {/* Category cards */}
            <motion.div variants={itemVariants} className="space-y-4 mb-12">
              {results.categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  defaultOpen={index === 0}
                  filter={filter}
                />
              ))}
            </motion.div>

            {/* Email capture */}
            <motion.div variants={itemVariants} className="mb-8">
              <EmailCapture auditId={audit.id} />
            </motion.div>

            {/* CTA SearchXLab */}
            <motion.div variants={itemVariants}>
              <CTASearchXLab />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
