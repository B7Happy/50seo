import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Configure for serverless environment with Supabase
const client = postgres(connectionString, {
  prepare: false, // Required for Supabase Transaction pooler
  max: 1, // Limit connections in serverless
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 30, // Connection timeout in seconds (increased for cold starts)
  fetch_types: false, // Disable type fetching for better compatibility
  ssl: 'require', // Ensure SSL connection
});

export const db = drizzle(client, { schema });

export * from './schema';
