import Link from "next/link"
import { Search, ArrowUpRight } from "lucide-react"
import { siteConfig } from "@/config/site"

const footerLinks = {
  product: [
    { label: 'Les 50 points', href: '/checklist' },
    { label: 'Lancer un audit', href: '/#hero' },
    { label: 'FAQ', href: '/#faq' },
  ],
  legal: [
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'Confidentialité', href: '/confidentialite' },
    { label: 'CGU', href: '/cgu' },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-card/30">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container relative py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                <Search className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight">
                50<span className="text-primary">SEO</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Auditez votre SEO technique en 2 minutes. 50 points vérifiés.
              100% gratuit, sans inscription.
            </p>

            {/* SearchXLab CTA */}
            <a
              href={siteConfig.searchXLabUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 hover:border-primary/30 transition-all"
            >
              <span className="text-sm">
                Découvrir l'audit <span className="font-semibold text-primary">GEO</span>
              </span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Produit</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} 50SEO.fr. Tous droits réservés.
            </p>
            <p className="text-sm text-muted-foreground">
              Propulsé par{' '}
              <a
                href={siteConfig.searchXLabUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                SearchXLab
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
