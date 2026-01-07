"use client"

import { useState } from "react"
import { FileText, Loader2, Mail, CheckCircle, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface EmailCaptureProps {
  auditId: string
  className?: string
}

export function EmailCapture({ auditId, className }: EmailCaptureProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError("Veuillez entrer votre email")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setError("Email invalide")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/email/${auditId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi")
      }

      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi. Veuillez reessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    // Direct PDF download
    window.open(`/api/pdf/${auditId}`, "_blank")
  }

  if (isSuccess) {
    return (
      <Card className={cn("border-success/30 bg-success/5", className)}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-success/10 mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">
              Rapport envoye !
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Vous recevrez votre rapport PDF a l'adresse {email}
            </p>
            <Button
              variant="outline"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Telecharger maintenant
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("border-primary/20 bg-primary/5", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="font-display text-lg">
            Recevez votre rapport PDF
          </CardTitle>
        </div>
        <CardDescription>
          Obtenez un rapport complet avec toutes les recommandations par email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="votre@email.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Envoyer
                </>
              )}
            </Button>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <p className="text-xs text-muted-foreground">
            En soumettant votre email, vous acceptez de recevoir le rapport et des conseils SEO de notre part. Vous pouvez vous desabonner a tout moment.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
