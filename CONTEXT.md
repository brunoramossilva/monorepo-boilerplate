# 🤖 CONTEXT: monorepo-boilerplate

> **Para IAs:** Leia este arquivo inteiro antes de sugerir qualquer código. Ele descreve toda a arquitetura, convenções e decisões técnicas do projeto. Com este contexto, você consegue sugerir código preciso e consistente sem explorar cada arquivo individualmente.

---

## O Projeto

**monorepo-boilerplate** é um monorepo TypeScript com três aplicações e packages compartilhados, gerenciado com pnpm workspaces e Turborepo.

### Apps

| App | Pasta | Tecnologia | Onde roda | Porta |
|---|---|---|---|---|
| Front-end web | `apps/web` | Next.js 15 + React 19 + Tailwind CSS 4 | Local | `3000` |
| API / Back-end | `apps/server` | Node.js 20 + Fastify 5 + Prisma 6 | Docker | `3001` |
| App mobile | `apps/mobile` | React Native + Expo SDK 51 + Expo Router | Local | |

### Infraestrutura

| Serviço | Onde roda | Porta |
|---|---|---|
| PostgreSQL 16 | Docker | `5432` |
| Adminer (GUI banco) | Docker | `8080` |

### Packages internos (nunca publicados no npm)

| Package | Pasta | O que contém |
|---|---|---|
| `@repo/types` | `packages/types/src/index.ts` | Interfaces e tipos TypeScript compartilhados |
| `@repo/utils` | `packages/utils/src/index.ts` | Funções utilitárias reutilizáveis |
| `@repo/config` | `packages/config/` | TSConfig base e ESLint base |

---

## Fluxo de Dados

```
apps/web (Next.js)   ──┐
                       ├── HTTP → apps/server (Fastify :3001) → Prisma → PostgreSQL (:5432)
apps/mobile (Expo)   ──┘
```

- Web e mobile se comunicam com o server via HTTP em `http://localhost:3001`
- O server está no Docker; web e mobile estão na máquina local
- O Prisma usa `DATABASE_URL` (`@postgres:5432`) em runtime dentro do Docker
- O Prisma CLI usa `DATABASE_DIRECT_URL` (`@localhost:5432`) localmente para migrations

---

## Convenções de Código

### TypeScript

- Sem `any`: use `unknown` + type narrowing ou generics
- Sem `!` (non-null assertion): trate o null explicitamente
- Tipos sempre em `@repo/types` quando compartilhados entre apps
- Tipos locais de um só app ficam no próprio app

### Imports

```typescript
// Arquivos locais do app, alias @/
import { Button } from '@/components/Button'
import { useAuth } from '@/hooks/useAuth'

// Packages internos
import type { User, ApiResponse } from '@repo/types'
import { formatDate, sleep } from '@repo/utils'
```

### Nomenclatura

```
camelCase     → variáveis, funções, hooks          (getUserById, useModal)
PascalCase    → tipos, interfaces, componentes     (UserProfile, UserCard)
UPPER_SNAKE   → constantes                         (MAX_RETRIES, API_URL)
kebab-case    → pastas de rotas Next.js/Expo       (user-profile/)
```

### Estrutura do server

```
src/routes/      → Declara as rotas (URLs + métodos HTTP)
src/controllers/ → Recebe request, chama service, retorna response
src/services/    → Lógica de negócio + acesso ao Prisma
src/middlewares/ → Autenticação, logging, validação global
```

---

## Tipos Compartilhados (`@repo/types`)

```typescript
// Resposta padrão da API. SEMPRE use este formato.
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

// Respostas paginadas
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// Entidades do banco, espelham os models do Prisma
export interface User {
  id: string
  email: string
  name?: string | null
  createdAt: string    // ISO string (não Date, pois JSON não suporta Date)
  updatedAt: string
}
```

> **Regra:** Ao criar um novo model no Prisma, crie a interface correspondente em `@repo/types`. Datas do Prisma (`DateTime`) viram `string` no tipo compartilhado porque JSON serializa datas como string.

---

## Prisma

**Schema:** `apps/server/prisma/schema.prisma`
**Migrations:** `apps/server/prisma/migrations/`

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")        // runtime (Docker interno)
  directUrl = env("DATABASE_DIRECT_URL") // CLI local (migrations)
}
```

**Por que dois campos de URL?** O server roda dentro do Docker e usa `@postgres:5432` (nome do serviço Docker). O Prisma CLI roda na máquina local e precisa de `@localhost:5432` (porta exposta pelo Docker).

### Comandos Prisma

```bash
pnpm db:push      # Sincroniza banco com schema (dev, sem histórico)
pnpm db:migrate   # Cria migration nomeada (produção, com histórico)
pnpm db:studio    # GUI do banco em localhost:5555
pnpm db:generate  # Regenera o Prisma Client após mudanças no schema
```

---

## Variáveis de Ambiente

### `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> `NEXT_PUBLIC_` é obrigatório para variáveis acessadas no browser (client components).

### `apps/server/.env`

```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/projectdb"
DATABASE_DIRECT_URL="postgresql://postgres:postgres@localhost:5432/projectdb"
PORT=3001
WEB_URL=http://localhost:3000
```

### `apps/mobile/.env`

```env
EXPO_PUBLIC_API_URL=http://localhost:3001
```

> `EXPO_PUBLIC_` é obrigatório para variáveis acessadas no código JavaScript do Expo.

---

## Comandos do Projeto

```bash
# Instalar tudo (raiz, instala todos os apps e packages)
pnpm install

# Docker
pnpm docker:up        # Sobe server + PostgreSQL
pnpm docker:down      # Para os containers
pnpm docker:logs      # Logs do server em tempo real
pnpm docker:rebuild   # Rebuilda imagem do server e reinicia

# Desenvolvimento local
pnpm dev              # web + mobile em paralelo
pnpm dev:web          # Só Next.js (:3000)
pnpm dev:mobile       # Só Expo

# Banco
pnpm db:push          # Sincroniza schema (dev)
pnpm db:migrate       # Gera migration (prod)
pnpm db:studio        # GUI do banco (:5555)

# Qualidade
pnpm build            # Compila todos os apps
pnpm lint             # ESLint em tudo
pnpm format           # Prettier em tudo
```

---

## Estrutura Completa de Arquivos

```
monorepo-boilerplate/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/            # App Router, page.tsx, layout.tsx
│   │   │   ├── components/     # Componentes React (.tsx)
│   │   │   ├── hooks/          # Custom hooks (use*.ts)
│   │   │   ├── lib/            # Helpers e config do cliente
│   │   │   └── styles/         # globals.css
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json       # extends ../../packages/config/typescript/base.json
│   │   └── package.json        # name: "web"
│   │
│   ├── server/
│   │   ├── src/
│   │   │   ├── routes/         # Registra rotas no Fastify
│   │   │   ├── controllers/    # Handlers HTTP
│   │   │   ├── services/       # Lógica de negócio + Prisma
│   │   │   ├── middlewares/    # Auth, logging
│   │   │   └── index.ts        # Entry point, cria app Fastify
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── Dockerfile          # Multi-stage: deps → builder → runner
│   │   ├── .env
│   │   ├── tsconfig.json       # extends ../../packages/config/typescript/base.json
│   │   └── package.json        # name: "server"
│   │
│   └── mobile/
│       ├── src/
│       │   ├── app/            # Expo Router, telas
│       │   ├── components/     # Componentes React Native
│       │   ├── hooks/          # Custom hooks
│       │   └── lib/            # Helpers
│       ├── assets/
│       ├── app.json
│       ├── tsconfig.json
│       └── package.json        # name: "mobile", main: "expo-router/entry"
│
├── packages/
│   ├── types/src/index.ts      # @repo/types
│   ├── utils/src/index.ts      # @repo/utils
│   └── config/
│       ├── typescript/base.json
│       └── eslint/index.js
│
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
├── package.json                # Scripts raiz, chama turbo
├── .env.example
├── CONTEXT.md                  # Este arquivo
└── README.md
```

---

## Decisões Técnicas

| Decisão | Motivo |
|---|---|
| pnpm em vez de npm/yarn | Workspaces nativos, eficiente em disco, estrito com dependências |
| Turborepo | Paraleliza tasks, cache inteligente, garante ordem de build (packages antes dos apps) |
| Fastify em vez de Express | 2-3x mais rápido, TypeScript nativo, melhor DX com plugins |
| Prisma v6 com `directUrl` | Configuração moderna que evita warnings; necessária para connection pooling em produção |
| Docker só para server + banco | Web e mobile precisam de hot-reload imediato; Docker adicionaria latência |
| `@postgres:5432` no Docker | Containers se comunicam pelo nome do serviço, não por `localhost` |
| Tailwind CSS v4 | Sem arquivo de configuração de tema obrigatório, performance melhor no build |
| Expo Router | Mesma API mental do Next.js App Router, facilita codar os dois em paralelo |
| `NEXT_PUBLIC_` e `EXPO_PUBLIC_` | Prefixos obrigatórios para expor variáveis ao bundle do client (browser/app) |

---

## Padrões de Resposta da API

**Sempre use `ApiResponse<T>` de `@repo/types`:**

```typescript
// Resposta de sucesso
return { data: user }

// Resposta com mensagem
return { data: user, message: 'Usuário criado com sucesso' }

// Resposta de erro (use reply.status())
return reply.status(404).send({ error: 'Usuário não encontrado' })

// Resposta paginada
return {
  data: users,
  total: 42,
  page: 1,
  pageSize: 10
}
```

---

## O que NÃO fazer

```typescript
// Não use any
function process(data: any) { }

// Não defina tipos de entidades fora de @repo/types
// (a menos que seja estritamente local a um único arquivo)
interface User { ... }  // coloque em packages/types/

// Não acesse o Prisma diretamente nos controllers.
// Controllers chamam services; services usam Prisma.
app.get('/users', async () => {
  return await prisma.user.findMany()  // mova para um service
})

// Não commite arquivos .env
// .gitignore já os ignora, mas nunca force o add

// Não use localhost como host do banco dentro do Docker
DATABASE_URL="...@localhost:5432/..."  // use @postgres:5432
```

---

*Atualizado junto com o projeto. Sempre que adicionar um novo app, package, porta ou convenção importante, atualize este arquivo.*