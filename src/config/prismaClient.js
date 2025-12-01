// IMPORTANT: Load environment variables FIRST, before anything else
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

console.log('📂 ENV file path:', envPath);
console.log('📂 ENV file exists:', existsSync(envPath));

// Load from the specific .env file path
dotenv.config({ path: envPath });

console.log('✓ Environment variables loaded from:', envPath);

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

console.log('🔌 Initializing Prisma client...');
console.log('DATABASE_URL defined:', !!process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not defined!');
  console.error('Checked path:', envPath);
  const relevantEnvVars = Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('NEON'));
  if (relevantEnvVars.length === 0) {
    console.error('No DATABASE or NEON related environment variables found');
  } else {
    console.error('Found:', relevantEnvVars);
  }
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log('✅ Pool created with connectionString');

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ['info', 'warn', 'error'],
});

console.log('✅ Prisma client initialized');

export default prisma;
