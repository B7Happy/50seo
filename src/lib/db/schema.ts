import { pgTable, uuid, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const audits = pgTable('audits', {
  id: uuid('id').defaultRandom().primaryKey(),
  url: text('url').notNull(),
  domain: text('domain').notNull(),
  score: integer('score'),
  status: text('status', { enum: ['pending', 'running', 'completed', 'failed'] }).notNull().default('pending'),
  results: jsonb('results'),
  email: text('email'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

export type Audit = typeof audits.$inferSelect;
export type NewAudit = typeof audits.$inferInsert;
