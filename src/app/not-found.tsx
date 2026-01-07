import Link from "next/link"
import { FileQuestion, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FileQuestion className="w-16 h-16 text-primary" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-6xl font-display font-bold text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-display font-semibold mb-4">Page introuvable</h2>
        <p className="text-muted-foreground mb-8">
          La page que vous recherchez n'existe pas ou a ete deplacee.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Retour a l'accueil
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/#hero">
              <Search className="w-4 h-4" />
              Lancer un audit
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
