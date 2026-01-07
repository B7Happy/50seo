"use client"

import { useEffect } from "react"
import { AlertCircle, RotateCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ResultsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Results page error:", error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-destructive/20">
        <CardContent className="pt-6 text-center">
          <div className="p-3 rounded-full bg-destructive/10 w-fit mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-xl font-display font-bold mb-2">
            Une erreur est survenue
          </h1>
          <p className="text-muted-foreground mb-6">
            Impossible de charger les resultats de l'audit. Veuillez reessayer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reessayer
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <a href="/">
                <Home className="w-4 h-4" />
                Accueil
              </a>
            </Button>
          </div>
          {error.digest && (
            <p className="mt-4 text-xs text-muted-foreground font-mono">
              Code erreur: {error.digest}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
