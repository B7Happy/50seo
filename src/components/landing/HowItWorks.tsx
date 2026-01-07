"use client"

import { Link2, Scan, FileCheck, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Link2,
    step: "01",
    title: "Entrez votre URL",
    description: "Collez l'adresse de votre site. Aucun compte requis, aucune inscription necessaire.",
    accent: "primary",
  },
  {
    icon: Scan,
    step: "02",
    title: "Analyse automatique",
    description: "Notre scanner intelligent verifie 50 points SEO critiques en temps reel.",
    accent: "accent",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Obtenez votre score",
    description: "Recevez un rapport detaille avec des recommandations actionnables.",
    accent: "success",
  },
]

export function HowItWorks() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="container relative">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-primary/20 bg-primary/5 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Processus simple</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Comment ca <span className="text-gradient">marche</span> ?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Un audit SEO complet en 3 etapes simples
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          {/* Desktop timeline connector */}
          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 w-[60%] h-px">
            <div className="w-full h-full bg-gradient-to-r from-primary/30 via-accent/30 to-success/30" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, index) => (
              <div key={step.step} className="relative group">
                {/* Card */}
                <div className="relative h-full p-8 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-500 hover:border-border hover:bg-card/70 overflow-hidden">
                  {/* Step number - large background */}
                  <div className="absolute -top-6 -right-6 font-display font-bold text-[120px] leading-none opacity-[0.03] pointer-events-none">
                    {step.step}
                  </div>

                  {/* Step badge */}
                  <div className="inline-flex mb-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono font-bold ${
                      step.accent === 'primary' ? 'bg-primary/10 text-primary border border-primary/20' :
                      step.accent === 'accent' ? 'bg-accent/10 text-accent border border-accent/20' :
                      'bg-success/10 text-success border border-success/20'
                    }`}>
                      Etape {step.step}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${
                    step.accent === 'primary' ? 'bg-gradient-to-br from-primary/20 to-primary/5' :
                    step.accent === 'accent' ? 'bg-gradient-to-br from-accent/20 to-accent/5' :
                    'bg-gradient-to-br from-success/20 to-success/5'
                  }`}>
                    <step.icon className={`w-8 h-8 ${
                      step.accent === 'primary' ? 'text-primary' :
                      step.accent === 'accent' ? 'text-accent' :
                      'text-success'
                    }`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-display font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>

                  {/* Bottom gradient line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    step.accent === 'primary' ? 'bg-gradient-to-r from-transparent via-primary to-transparent' :
                    step.accent === 'accent' ? 'bg-gradient-to-r from-transparent via-accent to-transparent' :
                    'bg-gradient-to-r from-transparent via-success to-transparent'
                  }`} />
                </div>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <>
                    {/* Desktop arrow */}
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>
                    {/* Mobile arrow */}
                    <div className="flex md:hidden justify-center my-6">
                      <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center rotate-90">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
