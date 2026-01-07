import { getAuditStats } from "@/lib/actions/stats"
import { V2PageClient } from "./client"

// Revalidate every 5 minutes to show fresh stats
export const revalidate = 300

export default async function V2Page() {
  const stats = await getAuditStats()

  return <V2PageClient stats={stats} />
}
