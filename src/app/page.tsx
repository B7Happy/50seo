import { getAuditStats } from "@/lib/actions/stats"
import { V2PageClient } from "./v2/client"

// Force dynamic rendering for fresh stats
export const dynamic = "force-dynamic"

export default async function Home() {
  const stats = await getAuditStats()

  return <V2PageClient stats={stats} />
}
