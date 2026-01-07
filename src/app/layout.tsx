import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Audit SEO Technique Gratuit en 2 Minutes`,
    template: `%s | ${siteConfig.name}`,
  },
  description: "Analysez votre site sur 50 points SEO techniques en 2 minutes. Score detaille, recommandations personnalisees. 100% gratuit, sans inscription.",
  keywords: [
    ...siteConfig.keywords,
    "50seo",
    "audit seo en ligne",
    "test seo gratuit",
    "analyse technique site web",
    "score seo",
  ],
  authors: [{ name: "SearchXLab", url: siteConfig.searchXLabUrl }],
  creator: "SearchXLab",
  publisher: "50SEO.fr",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    title: `${siteConfig.name} - Audit SEO Technique Gratuit en 2 Minutes`,
    description: "Analysez votre site sur 50 points SEO techniques. Score detaille et recommandations personnalisees. Gratuit.",
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "50SEO - Audit SEO Technique Gratuit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Audit SEO Technique Gratuit`,
    description: "Analysez votre site sur 50 points SEO techniques en 2 minutes. Gratuit.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add when available
    // google: "xxx",
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

// Structured Data for the whole site
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${siteConfig.url}/#webapp`,
      name: "50SEO",
      url: siteConfig.url,
      description: "Outil d'audit SEO technique gratuit analysant 50 points essentiels",
      applicationCategory: "SEO Tool",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      featureList: [
        "Analyse de 50 points SEO techniques",
        "Score detaille de 0 a 100",
        "Recommandations personnalisees",
        "Rapport PDF telechargeables",
        "Resultats en moins de 2 minutes",
      ],
    },
    {
      "@type": "Organization",
      "@id": `${siteConfig.searchXLabUrl}/#organization`,
      name: "SearchXLab",
      url: siteConfig.searchXLabUrl,
      logo: `${siteConfig.url}/logo.png`,
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: "50SEO",
      description: "Audit SEO Technique Gratuit",
      publisher: {
        "@id": `${siteConfig.searchXLabUrl}/#organization`,
      },
      inLanguage: "fr-FR",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
