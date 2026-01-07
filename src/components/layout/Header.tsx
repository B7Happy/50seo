"use client"

import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border/50" />

      <div className="container relative">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 glow-sm group-hover:glow-md transition-all duration-300">
              <Search className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">
              50<span className="text-primary">SEO</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/checklist"
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-secondary/50"
            >
              Les 50 points
            </Link>
            <Link
              href="/#faq"
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-secondary/50"
            >
              FAQ
            </Link>
            <div className="w-px h-6 bg-border mx-2" />
            <Button size="sm" className="ml-2 glow-sm hover:glow-md transition-all" asChild>
              <Link href="/#hero">Lancer un audit</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 p-4">
            <nav className="flex flex-col gap-2">
              <Link
                href="/checklist"
                className="px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-secondary/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Les 50 points
              </Link>
              <Link
                href="/#faq"
                className="px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-secondary/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="h-px bg-border my-2" />
              <Button className="w-full" onClick={() => setMobileMenuOpen(false)} asChild>
                <Link href="/#hero">Lancer un audit</Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
