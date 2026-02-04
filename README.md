# Coink - Sistema de Gestão Financeira

Sistema de gestão financeira pessoal com categorização inteligente e insights valiosos.

## Stack

- **Monorepo**: Turborepo + pnpm
- **Frontend**: Next.js 16 + React 19 + TailwindCSS v4
- **Backend**: NestJS 11 + Prisma ORM
- **Database**: PostgreSQL 17
- **Cache**: Redis (latest)
- **Containerização**: Docker + Docker Compose

## Quick Start

### Usando Docker (Recomendado)

1. **Configure o ambiente**:
```bash
cp .env.example .env
# Edite .env e ajuste as variáveis
```

2. **Suba os containers**:
```bash
docker compose up -d --build
```

3. **Acesse**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

📖 Para mais detalhes sobre Docker, veja [DOCKER.md](./DOCKER.md)

### Desenvolvimento Local

1. **Instale dependências**:
```bash
pnpm install
```

2. **Configure o ambiente**:
```bash
# Backend
cd apps/api
cp .env.example .env
# Edite .env com suas configurações locais

# Frontend
cd apps/web
cp .env.example .env
# Edite .env com suas configurações locais
```

3. **Suba PostgreSQL e Redis** (via Docker):
```bash
docker compose up -d postgres redis
```

4. **Execute migrations**:
```bash
cd apps/api
pnpm run db:migrate
pnpm run db:seed  # (opcional) popular com dados de exemplo
```

5. **Inicie o desenvolvimento**:
```bash
# Na raiz do projeto
pnpm dev
```

## Estrutura do Projeto

This Turborepo includes the following packages/apps:

### Apps and Packages

- `apps/web`: Frontend Next.js 16 com React 19
- `apps/api`: Backend NestJS 11 com Prisma
- `packages/ui`: Biblioteca de componentes React compartilhados
- `packages/eslint-config`: Configurações ESLint compartilhadas
- `packages/typescript-config`: Configurações TypeScript compartilhadas

Cada package/app é 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

Build todos os apps e packages:

```bash
pnpm build
```

Build de um app específico:

```bash
pnpm build --filter=web   # Frontend
pnpm build --filter=api   # Backend
```

### Desenvolvimento

Desenvolver todos os apps:

```bash
pnpm dev
```

Desenvolver um app específico:

```bash
pnpm dev --filter=web   # Frontend (porta 3000)
pnpm dev --filter=api   # Backend (porta 5000)
```

## Comandos Úteis

### Backend (NestJS + Prisma)

```bash
cd apps/api

# Prisma
pnpm run db:generate    # Gerar Prisma Client
pnpm run db:push        # Sincronizar schema (dev)
pnpm run db:migrate     # Criar/executar migrations
pnpm run db:studio      # Abrir Prisma Studio
pnpm run db:seed        # Popular banco com dados

# Testes
pnpm test               # Testes unitários
pnpm test:e2e           # Testes E2E
pnpm test:cov           # Cobertura de testes

# Build e produção
pnpm build              # Build para produção
pnpm start:prod         # Executar em produção
```

### Frontend (Next.js)

```bash
cd apps/web

# Build e produção
pnpm build              # Build para produção
pnpm start              # Executar build de produção

# Testes
pnpm test               # Testes com Jest
pnpm test:watch         # Watch mode
```

## Variáveis de Ambiente

O projeto usa um único arquivo `.env` na raiz para Docker. Para desenvolvimento local, cada app tem seu próprio `.env`:

- **Raiz** (`/.env`): Usado pelo Docker Compose
- **Backend** (`/apps/api/.env`): Desenvolvimento local do backend
- **Frontend** (`/apps/web/.env`): Desenvolvimento local do frontend

### Variáveis necessárias

#### Backend
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/coink
REDIS_URL=redis://localhost:6379
JWT_SECRET=seu-secret-aqui
PORT=5000
```

#### Frontend
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-nextauth-secret
```

## Docker

Para executar a aplicação completa com Docker:

```bash
# Configurar ambiente
cp .env.example .env

# Subir containers
docker compose up -d --build

# Ver logs
docker compose logs -f

# Parar containers
docker compose down
```

📖 **Guia completo**: [DOCKER.md](./DOCKER.md)

## Arquitetura

```
┌─────────────────┐
│   coink-web     │  Next.js 16 Frontend
│   (Port 3000)   │  React 19 + TailwindCSS v4
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   coink-api     │  NestJS 11 Backend
│   (Port 5000)   │  Prisma ORM + Redis Cache
└────┬─────┬──────┘
     │     │
     ▼     ▼
┌─────────┐ ┌─────────┐
│PostgreSQL│ │  Redis  │
│   :5432  │ │  :6379  │
└─────────┘ └─────────┘
```

### Volumes

- `postgres_data`: Persistência do PostgreSQL
- `redis_data`: Persistência do Redis
- `coink_files`: Arquivos da aplicação (uploads, etc.)

## Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## Links Úteis

### Documentação

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Turborepo Documentation](https://turborepo.com/docs)

### Projeto

- [Guia Docker](./DOCKER.md)
- [Diagramas de Arquitetura](./docs/diagrams/)

## Licença

[Adicionar licença aqui]
