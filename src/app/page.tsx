import { Hero } from "@/components/landing/Hero"
import { Stats } from "@/components/landing/Stats"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { ChecklistPreview } from "@/components/landing/ChecklistPreview"
import { FAQ } from "@/components/landing/FAQ"
import { CTASearchXLab } from "@/components/landing/CTASearchXLab"

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <HowItWorks />
      <ChecklistPreview />
      <FAQ />
      <CTASearchXLab />
    </>
  )
}
