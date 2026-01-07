"use client"

import { useEffect, useState, useRef } from "react"
import { TrendingUp, Clock, Sparkles } from "lucide-react"

const stats = [
  {
    value: 50,
    suffix: "",
    label: "Points SEO",
    description: "Analyse technique complete",
    color: "primary",
    icon: TrendingUp,
  },
  {
    value: 2,
    suffix: "min",
    label: "D'analyse",
    description: "Resultats instantanes",
    color: "success",
    icon: Clock,
  },
  {
    value: 100,
    suffix: "%",
    label: "Gratuit",
    description: "Sans carte bancaire",
    color: "accent",
    icon: Sparkles,
  },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const duration = 1800
          const steps = 50
          const increment = value / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, hasAnimated])

  return (
    <div ref={ref} className="font-mono text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter tabular-nums">
      {count}
      <span className="text-3xl md:text-4xl lg:text-5xl ml-1">{suffix}</span>
    </div>
  )
}

export function Stats() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Subtle orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />

      <div className="container relative">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="group relative"
              >
                {/* Card */}
                <div className="relative p-6 lg:p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-500 hover:border-border hover:bg-card/50">
                  {/* Icon */}
                  <div className={`inline-flex p-2.5 rounded-xl mb-5 ${
                    stat.color === 'primary' ? 'bg-primary/10' :
                    stat.color === 'success' ? 'bg-success/10' :
                    stat.color === 'accent' ? 'bg-accent/10' :
                    'bg-warning/10'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      stat.color === 'primary' ? 'text-primary' :
                      stat.color === 'success' ? 'text-success' :
                      stat.color === 'accent' ? 'text-accent' :
                      'text-warning'
                    }`} />
                  </div>

                  {/* Number */}
                  <div className={`mb-3 ${
                    stat.color === 'primary' ? 'text-primary' :
                    stat.color === 'success' ? 'text-success' :
                    stat.color === 'accent' ? 'text-accent' :
                    'text-warning'
                  }`}>
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <div className="text-lg font-display font-semibold mb-1">{stat.label}</div>

                  {/* Description */}
                  <div className="text-sm text-muted-foreground">{stat.description}</div>

                  {/* Decorative corner */}
                  <div className={`absolute bottom-0 right-0 w-20 h-20 rounded-tl-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${
                    stat.color === 'primary' ? 'bg-primary' :
                    stat.color === 'success' ? 'bg-success' :
                    stat.color === 'accent' ? 'bg-accent' :
                    'bg-warning'
                  }`} />
                </div>

                {/* Connector line between cards */}
                {index < stats.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-border to-transparent" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
