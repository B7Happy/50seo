"use server"

import { db, audits } from "@/lib/db"
import { sql, gte, and, eq } from "drizzle-orm"

export async function getAuditStats() {
  try {
    // Get count from the last 7 days
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const weeklyResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(audits)
      .where(
        and(
          gte(audits.createdAt, oneWeekAgo),
          eq(audits.status, 'completed')
        )
      )

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(audits)
      .where(eq(audits.status, 'completed'))

    return {
      weeklyCount: Number(weeklyResult[0]?.count) || 0,
      totalCount: Number(totalResult[0]?.count) || 0
    }
  } catch (error) {
    console.error("Error fetching audit stats:", error)
    return {
      weeklyCount: 0,
      totalCount: 0
    }
  }
}
