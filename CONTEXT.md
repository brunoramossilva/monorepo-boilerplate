# 🤖 CONTEXT: monorepo-boilerplate

> **Para IAs:** Leia este arquivo inteiro antes de sugerir qualquer código. Ele descreve toda a arquitetura, convenções e decisões técnicas do projeto. Com este contexto, você consegue sugerir código preciso e consistente sem explorar cada arquivo individualmente.

---

## O Projeto

**monorepo-boilerplate** é um monorepo TypeScript com três aplicações e packages compartilhados, gerenciado com pnpm workspaces e Turborepo.

### Apps

| App            | Pasta         | Tecnologia                               | Onde roda | Porta  |
| -------------- | ------------- | ---------------------------------------- | --------- | ------ |
| Front-end web  | `apps/web`    | Next.js 15 + React 19 + Tailwind CSS 3   | Local     | `3000` |
| API / Back-end | `apps/server` | Node.js 22 + Express 4 + Prisma 7        | Docker    | `3001` |
| App mobile     | `apps/mobile` | React Native + Expo SDK 52 + Expo Router | Local     |        |

### Infraestrutura

| Serviço             | Onde roda | Porta  |
| ------------------- | --------- | ------ |
| PostgreSQL 16       | Docker    | `5432` |
| Adminer (GUI banco) | Docker    | `8080` |

### Packages internos (nunca publicados no npm)

| Package        | Pasta                         | O que contém                                 |
| -------------- | ----------------------------- | -------------------------------------------- |
| `@repo/types`  | `packages/types/src/index.ts` | Interfaces e tipos TypeScript compartilhados |
| `@repo/utils`  | `packages/utils/src/index.ts` | Funções utilitárias reutilizáveis            |
| `@repo/config` | `packages/config/`            | TSConfig base e ESLint base                  |

---

## Fluxo de Dados

```
apps/web (Next.js)   ──┐
                       ├── HTTP → apps/server (Express :3001) → Prisma → PostgreSQL (:5432)
apps/mobile (Expo)   ──┘
```

- Web e mobile se comunicam com o server via HTTP em `http://localhost:3001`
- O server está no Docker; web e mobile estão na máquina local
- O Prisma 7 lê a URL do banco do `prisma.config.ts` (que aponta para `process.env.DATABASE_URL`)
- Em runtime, o server instancia `PrismaClient` com o adapter `@prisma/adapter-pg`

### Mensagens ao subir o Docker

Após `docker compose up` (ou `pnpm docker:up`), o server imprime no log:

```
🚀 Server ready at http://localhost:3001
📦 Successfully connected with database
```

A primeira linha confirma que o Express está escutando na porta 3001. A segunda confirma que o `PrismaClient.$connect()` validou a conexão com o PostgreSQL antes de aceitar requisições. Use `pnpm docker:logs` para acompanhar.

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
import { Button } from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";

// Packages internos
import type { User, ApiResponse } from "@repo/types";
import { formatDate, sleep } from "@repo/utils";
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
src/routes/      → Declara as rotas Express (URLs + métodos HTTP)
src/controllers/ → Recebe request, chama service, retorna response
src/services/    → Lógica de negócio + acesso ao Prisma
src/middlewares/ → Autenticação, logging, validação global
```

---

## Tipos Compartilhados (`@repo/types`)

```typescript
// Resposta padrão da API. SEMPRE use este formato.
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Respostas paginadas
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Entidades do banco, espelham os models do Prisma
export interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt: string; // ISO string (não Date, pois JSON não suporta Date)
  updatedAt: string;
}
```

> **Regra:** Ao criar um novo model no Prisma, crie a interface correspondente em `@repo/types`. Datas do Prisma (`DateTime`) viram `string` no tipo compartilhado porque JSON serializa datas como string.

---

## Prisma

**Schema:** `apps/server/prisma/schema.prisma`
**Config:** `apps/server/prisma.config.ts`
**Migrations:** `apps/server/prisma/migrations/`

A partir do Prisma 7, a URL do banco **não fica mais no `schema.prisma`** — fica em `prisma.config.ts`, e em runtime o `PrismaClient` recebe um driver adapter (`@prisma/adapter-pg`).

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}
```

```typescript
// prisma.config.ts
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: process.env.DATABASE_URL ?? "" },
  migrations: { path: "prisma/migrations" },
});
```

```typescript
// src/index.ts (runtime)
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

### Comandos Prisma

```bash
pnpm db:push      # Sincroniza banco com schema (dev, sem histórico)
pnpm db:migrate   # Cria migration nomeada (produção, com histórico)
pnpm db:studio    # GUI do banco em localhost:5555
pnpm db:generate  # Regenera o Prisma Client após mudanças no schema
```

---

## Variáveis de Ambiente

### Por que o projeto roda sem `.env` em dev (e por que isso muda em produção)

Em desenvolvimento, dá pra subir back, front, mobile e banco sem criar nenhum `.env`. Isso acontece por **dois mecanismos distintos**:

1. **Server e PostgreSQL** rodam no Docker e recebem as variáveis pelo bloco `environment:` do `docker-compose.yml` (`DATABASE_URL`, `PORT`, `WEB_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`). Os processos não leem nenhum `.env` — o Docker injeta tudo direto no container.
2. **Web e Mobile** rodam localmente e não dependem do Docker. Funcionam sem `.env` porque o código tem fallback hardcoded em `apps/web/src/lib/api.ts` e `apps/mobile/src/lib/api.ts`: `process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"` (e `EXPO_PUBLIC_API_URL` no mobile). O fallback bate com a porta que o Docker expõe, então o client acha o server sem configuração extra.

**Em produção isso muda:** as credenciais do banco no `docker-compose.yml` estão em texto puro, o que é aceitável só pra dev. No deploy, troca-se o bloco `environment:` do compose por `env_file:` apontando para um `.env` fora do Git, ou usa-se secrets manager (Vault, AWS Secrets, Doppler). Os fallbacks `?? "http://localhost:3001"` no client também perdem sentido — o build do Next/Expo precisa receber a URL real via variável de ambiente no momento do build.

### `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> `NEXT_PUBLIC_` é obrigatório para variáveis acessadas no browser (client components).

### `apps/server/.env`

```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/projectdb?schema=public"
PORT=3001
WEB_URL=http://localhost:3000
```

> Para rodar comandos do Prisma CLI fora do Docker (ex: `prisma db push` local), exporte `DATABASE_URL` apontando para `localhost:5432` no shell antes do comando.

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
│   │   │   ├── routes/         # Registra rotas no Express
│   │   │   ├── controllers/    # Handlers HTTP
│   │   │   ├── services/       # Lógica de negócio + Prisma
│   │   │   ├── middlewares/    # Auth, logging
│   │   │   └── index.ts        # Entry point, cria app Express
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── prisma.config.ts    # Prisma 7 config (URL do banco fica aqui)
│   │   ├── Dockerfile
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

| Decisão                         | Motivo                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------- |
| pnpm em vez de npm/yarn         | Workspaces nativos, eficiente em disco, estrito com dependências                            |
| Turborepo                       | Paraleliza tasks, cache inteligente, garante ordem de build (packages antes dos apps)       |
| Express em vez de Fastify       | API minimalista e familiar para a maioria dos times, com ecossistema de middlewares maduro  |
| Prisma v7 com driver adapter    | URL fica no `prisma.config.ts`, runtime usa `@prisma/adapter-pg` — alinhado ao Prisma atual |
| Docker só para server + banco   | Web e mobile precisam de hot-reload imediato; Docker adicionaria latência                   |
| `@postgres:5432` no Docker      | Containers se comunicam pelo nome do serviço, não por `localhost`                           |
| Tailwind CSS v3                 | Versão estável e madura, com PostCSS pipeline tradicional                                   |
| Expo Router                     | Mesma API mental do Next.js App Router, facilita codar os dois em paralelo                  |
| `NEXT_PUBLIC_` e `EXPO_PUBLIC_` | Prefixos obrigatórios para expor variáveis ao bundle do client (browser/app)                |

---

## Template de Integração (já implementado)

O boilerplate inclui uma integração ponta-a-ponta de exemplo: `GET /users` no server, consumido pelo web e pelo mobile. **Use como referência ao criar novos recursos.**

### Server

```
src/services/users.service.ts      → listUsers(): Promise<User[]> (mock; troque por prisma.user.findMany())
src/controllers/users.controller.ts → getUsers(req, res): retorna { data: users }
src/routes/users.route.ts           → usersRouter com GET "/"
src/index.ts                        → app.use("/users", usersRouter)
```

### Cliente HTTP compartilhado em forma

Tanto `apps/web/src/lib/api.ts` quanto `apps/mobile/src/lib/api.ts` exportam:

```typescript
export type ApiResult<T> = { data: T; isMocked: boolean };

export async function apiGet<T>(path: string, fallback: T): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_URL}${path}`);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    const json = (await response.json()) as ApiResponse<T>;
    return { data: json.data, isMocked: false };
  } catch {
    return { data: fallback, isMocked: true };
  }
}
```

Diferenças por app: `API_URL` vem de `NEXT_PUBLIC_API_URL` (web) ou `EXPO_PUBLIC_API_URL` (mobile). O helper desempacota `ApiResponse<T>` e sempre retorna `{ data, isMocked }`.

### Fallback offline

O `fallback` é **obrigatório** e é usado automaticamente quando o fetch falha (server fora do ar, sem rede, URL errada, status non-2xx). Cada app mantém seus mocks em `src/lib/mocks.ts`. Quando `isMocked === true`, a UI deve mostrar um aviso explícito de que está sem comunicação com o servidor (banner amarelo nas telas atuais). Isso permite rodar `pnpm dev:web` / `pnpm dev:mobile` sem precisar subir o Docker.

### Web

`apps/web/src/app/page.tsx` é um **Server Component** que faz `await apiGet<User[]>("/users", mockUsers)` no render e renderiza o banner condicional quando `isMocked`. Use `cache: "no-store"` se precisar de dados sempre frescos (já está no helper).

### Mobile

`apps/mobile/src/app/index.tsx` é client-side: `useEffect` chama `apiGet<User[]>("/users", mockUsers)` e popula `useState` com `data` e `isMocked`. Renderiza com `FlatList` e mostra o banner offline quando `isMocked`.

### Para adicionar uma nova entidade (`<nome>`)

1. **Tipo:** adicione interface em `packages/types/src/index.ts`
2. **Server:** crie `services/<nome>.service.ts`, `controllers/<nome>.controller.ts`, `routes/<nome>.route.ts`
3. **Mount:** em `apps/server/src/index.ts`, `app.use("/<nome>", <nome>Router)`
4. **Client:** adicione mocks em `lib/mocks.ts` e chame `apiGet<Tipo>("/<nome>", mockTipo)` — trate `isMocked` na UI

Mantenha os nomes de arquivo no padrão `<nome>.<camada>.ts` para que IAs e humanos encontrem rápido.

---

## Padrões de Resposta da API

**Sempre use `ApiResponse<T>` de `@repo/types`:**

```typescript
// Resposta de sucesso
return { data: user };

// Resposta com mensagem
return { data: user, message: "Usuário criado com sucesso" };

// Resposta de erro (use res.status())
return res.status(404).json({ error: "Usuário não encontrado" });

// Resposta paginada
return {
  data: users,
  total: 42,
  page: 1,
  pageSize: 10,
};
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
app.get('/users', async (_req, res) => {
  res.json(await prisma.user.findMany())  // mova para um service
})

// Não commite arquivos .env
// .gitignore já os ignora, mas nunca force o add

// Não use localhost como host do banco dentro do Docker
DATABASE_URL="...@localhost:5432/..."  // use @postgres:5432
```

---

_Atualizado junto com o projeto. Sempre que adicionar um novo app, package, porta ou convenção importante, atualize este arquivo._
