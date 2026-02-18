import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import * as schema from './schema';

config({ path: '.env' });

// DE-002 §4.1: Use standard postgres driver (NOT @neondatabase/serverless)
// Persistent Node.js server = standard connection pooling
const sql = postgres(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
