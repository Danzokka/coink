# Guia Docker - Coink

Este guia descreve como executar a aplicação Coink usando Docker e Docker Compose.

## Pré-requisitos

- Docker (20.10 ou superior)
- Docker Compose (2.0 ou superior)

## Arquitetura

A aplicação é composta por 4 serviços:

- **postgres**: PostgreSQL 17 (banco de dados)
- **redis**: Redis latest (cache)
- **coink-api**: Backend NestJS
- **coink-web**: Frontend Next.js 16

## Configuração

### 1. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e ajuste as variáveis conforme necessário:

```bash
# PostgreSQL
POSTGRES_USER=coink
POSTGRES_PASSWORD=coink_secret  # ALTERAR EM PRODUÇÃO
POSTGRES_DB=coink

# Backend
DATABASE_URL=postgresql://coink:coink_secret@postgres:5432/coink
REDIS_URL=redis://redis:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production  # ALTERAR
PORT=5000
NODE_ENV=production
STORAGE_PATH=/app/storage

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-generate-a-strong-random-string  # ALTERAR
```

**⚠️ IMPORTANTE**: Em produção, altere todos os valores de secrets/passwords!

### 2. Subir os containers

```bash
# Build e subir todos os serviços
docker compose up -d --build

# Verificar status dos containers
docker compose ps

# Ver logs
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f coink-api
docker compose logs -f coink-web
```

### 3. Acessar a aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Comandos úteis

### Gerenciar containers

```bash
# Parar todos os serviços
docker compose stop

# Reiniciar todos os serviços
docker compose restart

# Parar e remover containers
docker compose down

# Parar e remover containers + volumes (APAGA DADOS!)
docker compose down -v
```

### Migrations do Prisma

As migrations são executadas automaticamente na inicialização do container `coink-api`.

Para executar manualmente:

```bash
# Acessar o container da API
docker compose exec coink-api sh

# Executar migrations
pnpm exec prisma migrate deploy

# Gerar Prisma Client
pnpm exec prisma generate

# Abrir Prisma Studio (não funciona no container, use localmente)
```

### Seed do banco de dados

```bash
# Executar seed
docker compose exec coink-api pnpm run db:seed
```

### Rebuild de um serviço específico

```bash
# Rebuild apenas o backend
docker compose up -d --build coink-api

# Rebuild apenas o frontend
docker compose up -d --build coink-web
```

### Acessar shell dos containers

```bash
# Backend
docker compose exec coink-api sh

# Frontend
docker compose exec coink-web sh

# PostgreSQL
docker compose exec postgres psql -U coink -d coink

# Redis
docker compose exec redis redis-cli
```

## Volumes

A aplicação usa 3 volumes nomeados para persistência:

- **postgres_data**: Dados do PostgreSQL
- **redis_data**: Dados do Redis
- **coink_files**: Arquivos da aplicação (uploads, etc)

### Backup de volumes

```bash
# Backup do PostgreSQL
docker compose exec postgres pg_dump -U coink coink > backup.sql

# Restaurar backup
cat backup.sql | docker compose exec -T postgres psql -U coink -d coink
```

### Limpar volumes (ATENÇÃO: apaga todos os dados!)

```bash
docker compose down -v
```

## Troubleshooting

### Container não inicia

1. Verifique os logs:
```bash
docker compose logs coink-api
docker compose logs coink-web
```

2. Verifique se as portas não estão em uso:
```bash
# Linux/Mac
lsof -i :3000
lsof -i :5000
lsof -i :5432
lsof -i :6379

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000
```

### Erro de conexão com PostgreSQL

1. Verifique se o container do PostgreSQL está healthy:
```bash
docker compose ps postgres
```

2. Teste a conexão manualmente:
```bash
docker compose exec postgres psql -U coink -d coink -c "SELECT 1;"
```

### Erro de conexão com Redis

```bash
docker compose exec redis redis-cli ping
# Deve retornar: PONG
```

### Migrations não executam

```bash
# Acesse o container
docker compose exec coink-api sh

# Execute manualmente
pnpm exec prisma migrate deploy

# Verifique o status
pnpm exec prisma migrate status
```

### Rebuild completo (fresh start)

```bash
# Parar tudo e remover volumes
docker compose down -v

# Remover imagens antigas
docker compose rm -f
docker rmi coink-coink-api coink-coink-web

# Rebuild e subir
docker compose up -d --build
```

## Desenvolvimento

Para desenvolvimento, recomenda-se executar os serviços localmente com hot-reload:

```bash
# Em terminais separados:
pnpm dev  # Roda todos os apps com Turbo

# Ou individualmente:
cd apps/api && pnpm dev
cd apps/web && pnpm dev
```

E manter apenas PostgreSQL e Redis no Docker:

```bash
docker compose up -d postgres redis
```

Ajuste o `.env` local para apontar para os serviços Docker:

```bash
DATABASE_URL=postgresql://coink:coink_secret@localhost:5432/coink
REDIS_URL=redis://localhost:6379
```

## Produção

Para produção, considere:

1. Usar secrets do Docker/Kubernetes ao invés de `.env`
2. Configurar SSL/TLS para PostgreSQL
3. Configurar Redis com senha
4. Usar um registry privado para as imagens
5. Implementar health checks e monitoring
6. Configurar backups automáticos
7. Usar volumes externos ou storage em nuvem

## Referências

- [Docker Compose documentation](https://docs.docker.com/compose/)
- [Next.js Docker deployment](https://nextjs.org/docs/deployment)
- [NestJS Docker](https://docs.nestjs.com/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Redis Docker](https://hub.docker.com/_/redis)
