"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-destructive/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-display font-bold mb-4">
          Oups ! Une erreur est survenue
        </h1>
        <p className="text-muted-foreground mb-8">
          Nous sommes desoles, quelque chose s'est mal passe. Veuillez reessayer ou retourner a l'accueil.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reessayer
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <a href="/">
              <Home className="w-4 h-4" />
              Retour a l'accueil
            </a>
          </Button>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-muted-foreground font-mono">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
