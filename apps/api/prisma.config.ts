import path from 'node:path';
import { config } from 'dotenv';

// Carrega .env da raiz do monorepo quando o CLI é executado em apps/api
config({ path: path.resolve(process.cwd(), '../../.env') });
config({ path: path.resolve(process.cwd(), '.env') });
config(); // fallback padrão

import type { PrismaConfig } from 'prisma';

// Fallback para Docker/CI: prisma generate não conecta ao DB, só gera o client
const databaseUrl =
  process.env.DATABASE_URL ?? 'postgresql://build:build@localhost:5432/build';

const prismaConfig: PrismaConfig = {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node prisma/seed.ts',
  },
  datasource: {
    url: databaseUrl,
  },
};

export default prismaConfig;
