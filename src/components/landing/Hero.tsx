"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, Zap, Shield, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Hero() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    let validUrl = url.trim()
    if (!validUrl) {
      setError("Veuillez entrer une URL")
      return
    }

    if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
      validUrl = "https://" + validUrl
    }

    try {
      new URL(validUrl)
    } catch {
      setError("URL invalide")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: validUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'analyse")
      }

      router.push(`/resultats/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'analyse")
      setIsLoading(false)
    }
  }

  return (
    <section id="hero" className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise-texture pointer-events-none" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-48 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />

      {/* Floating geometric shapes */}
      <div className="absolute top-24 right-[12%] w-32 h-32 border border-primary/15 rounded-3xl rotate-12 animate-float opacity-50" />
      <div className="absolute bottom-36 left-[8%] w-20 h-20 border border-accent/15 rounded-2xl -rotate-12 animate-float opacity-40" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-[6%] w-10 h-10 bg-primary/10 rounded-xl rotate-45 animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-1/4 right-[18%] w-6 h-6 bg-success/20 rounded-lg animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-[5%] w-4 h-4 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />

      {/* Main content */}
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-center mb-8 reveal stagger-1">
            <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight mb-3">
              Analysez votre site
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight">
              en <span className="text-gradient">50 points</span> SEO
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-center text-lg md:text-xl text-muted-foreground mb-14 max-w-2xl mx-auto reveal stagger-2 leading-relaxed">
            Score detaille. Recommandations personnalisees. Resultats en 2 minutes.
            <span className="block mt-3 text-foreground font-semibold">100% gratuit, sans inscription.</span>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-14 reveal stagger-3">
            <div className="relative group">
              {/* Gradient border with animation */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary opacity-50 blur-sm group-hover:opacity-70 transition-opacity duration-500" />
              <div className="relative p-1 rounded-2xl bg-gradient-to-r from-primary/60 via-accent/40 to-primary/60">
                <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-xl bg-background/98 backdrop-blur-xl">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="https://votresite.fr"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={isLoading}
                      className="h-14 px-5 text-lg bg-secondary/40 border-0 rounded-xl placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-primary/50 font-medium"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="lg"
                    className="h-14 px-10 text-base font-semibold rounded-xl glow-sm hover:glow-md transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Analyse...
                      </>
                    ) : (
                      <>
                        Lancer l'audit
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            {error && (
              <p className="mt-4 text-center text-sm text-destructive font-medium">{error}</p>
            )}
          </form>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 reveal stagger-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary/30 border border-border/50">
              <div className="p-2 rounded-lg bg-success/10">
                <Zap className="h-4 w-4 text-success" />
              </div>
              <span className="text-sm font-medium">Resultats en 2 min</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary/30 border border-border/50">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">50 points analyses</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary/30 border border-border/50">
              <div className="p-2 rounded-lg bg-accent/10">
                <Shield className="h-4 w-4 text-accent" />
              </div>
              <span className="text-sm font-medium">100% gratuit</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  )
}
