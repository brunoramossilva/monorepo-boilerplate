<div align="center">

<h1>Monorepo Boilerplate</h1>

<p><strong>Um monorepo TypeScript completo com Web, Server e Mobile.</strong></p>

<br/>

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com/)
[![Expo](https://img.shields.io/badge/Expo-SDK52-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.x-EF4444?style=flat-square&logo=turborepo&logoColor=white)](https://turbo.build/)
[![pnpm](https://img.shields.io/badge/pnpm-9.x-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)

<br/>

```
apps/
├── web       → Next.js 15 + Tailwind CSS    [localhost:3000]
├── server    → Express + Prisma + Docker    [localhost:3001]
└── mobile    → React Native + Expo
```

</div>

> Este monorepo foi criado para a task do Laboratório de Inovação do **Centro Integrado de Tecnologia da Informação (CITi)**.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Stack Completa](#-stack-completa)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Setup](#-instalação-e-setup)
- [Como Rodar](#-como-rodar)
- [Comandos](#-comandos)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Banco de Dados](#-banco-de-dados)
- [Docker](#-docker)
- [Packages Compartilhados](#-packages-compartilhados)
- [Convenções](#-convenções)
- [Fluxo de Dados](#-fluxo-de-dados)
- [Template de Integração](#-template-de-integração)
- [Uso com IA](#-uso-com-ia)

---

## 🎯 Visão Geral

Este repositório é um **boilerplate de monorepo**, um ponto de partida pré-configurado para produtos digitais que precisam de **site**, **API** e **app mobile** ao mesmo tempo.

Em vez de criar e configurar três repositórios separados, você tem tudo em um único lugar com:

- ✅ **TypeScript** em todas as camadas, com tipos compartilhados entre web, server e mobile
- ✅ **Docker** para o server e banco de dados, sobe tudo com um comando
- ✅ **Turborepo** para orquestrar builds e tasks com cache inteligente
- ✅ **pnpm workspaces** para gerenciar as dependências do monorepo
- ✅ **CONTEXT.md** otimizado para ferramentas de IA (Claude Code, Cursor, Copilot)

> **Por que monorepo?** Com tudo no mesmo repositório, a IA enxerga o projeto inteiro: tipos do servidor, componentes do front e telas do mobile, sem perder contexto. Refatorações que afetam múltiplos apps acontecem em um único PR.

---

## 🏗 Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        MÁQUINA LOCAL                        │
│                                                             │
│   ┌──────────────┐         ┌──────────────────────────┐    │
│   │   web        │         │   mobile                 │    │
│   │  Next.js 15  │         │  React Native + Expo     │    │
│   │  :3000       │         │  Expo Go (celular)       │    │
│   └──────┬───────┘         └────────────┬─────────────┘    │
│          │                              │                   │
└──────────┼──────────────────────────────┼───────────────────┘
           │  HTTP requests               │
           │  localhost:3001              │
┌──────────┼──────────────────────────────┼───────────────────┐
│          │         DOCKER               │                   │
│   ┌──────▼──────────────────────────────▼─────────────┐     │
│   │                   server                          │     │
│   │          Node.js + Express + Prisma               │     │
│   │                   :3001                           │     │
│   └──────────────────────┬────────────────────────────┘     │
│                          │  prisma client                   │
│   ┌──────────────────────▼────────────────────────────┐     │
│   │                  PostgreSQL 16                    │     │
│   │                     :5432                         │     │
│   └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

| Serviço       | Tecnologia                       | Onde roda            | Porta  |
| ------------- | -------------------------------- | -------------------- | ------ |
| `web`         | Next.js 15 + React 19 + Tailwind | Local                | `3000` |
| `server`      | Node.js + Express + Prisma       | Docker               | `3001` |
| `postgres`    | PostgreSQL 16                    | Docker               | `5432` |
| `mobile`      | React Native + Expo              | Local                |        |
| Prisma Studio | Interface visual do banco        | Local (quando ativo) | `5555` |
| Adminer       | GUI do banco (browser)           | Docker               | `8080` |

---

## 🛠 Stack Completa

### Gerenciamento do Monorepo

| Ferramenta    | Versão | Para que serve                                         |
| ------------- | ------ | ------------------------------------------------------ |
| **pnpm**      | 9.x    | Gerenciador de pacotes com suporte nativo a workspaces |
| **Turborepo** | 2.x    | Orquestra builds, paraleliza tasks e gerencia cache    |

### App Web (`apps/web`)

| Tecnologia       | Versão | Para que serve                                                |
| ---------------- | ------ | ------------------------------------------------------------- |
| **Next.js**      | 15     | Framework React com App Router, SSR, SSG e otimizações        |
| **React**        | 19     | Biblioteca de interface de usuário                            |
| **Tailwind CSS** | 3      | Framework CSS utilitário, estilos diretamente no JSX          |
| **Axios**        | 1      | Cliente HTTP usado para falar com o server (`apps/web/src/lib/api.ts`) |
| **TypeScript**   | 5      | Tipagem estática em toda a aplicação                          |

### App Server (`apps/server`)

| Tecnologia  | Versão | Para que serve                                          |
| ----------- | ------ | ------------------------------------------------------- |
| **Node.js** | 22 LTS | Runtime JavaScript no servidor (Prisma 7 exige ≥ 20.19) |
| **Express** | 4      | Framework HTTP minimalista e amplamente adotado         |
| **cors**    | 2      | Middleware de CORS, permite requisições do web e mobile |
| **Prisma**  | 7      | ORM moderno com driver adapter (`@prisma/adapter-pg`)   |
| **Zod**     | 3      | Validação e parsing de dados nas requisições            |
| **tsx**     | 4      | Executa TypeScript diretamente (dev com hot-reload)     |

### App Mobile (`apps/mobile`)

| Tecnologia       | Versão | Para que serve                                                            |
| ---------------- | ------ | ------------------------------------------------------------------------- |
| **React Native** | 0.76   | Apps iOS e Android com React e TypeScript                                 |
| **Expo**         | SDK 52 | Plataforma de desenvolvimento que simplifica o React Native               |
| **Expo Router**  | 4      | Sistema de rotas baseado em arquivos (igual ao Next.js)                   |
| **Axios**        | 1      | Cliente HTTP usado para falar com o server (`apps/mobile/src/lib/api.ts`) |

### Infraestrutura

| Tecnologia         | Versão    | Para que serve                                |
| ------------------ | --------- | --------------------------------------------- |
| **Docker**         |           | Conteineriza server + banco de dados          |
| **docker-compose** |           | Orquestra múltiplos containers com um comando |
| **PostgreSQL**     | 16 Alpine | Banco de dados relacional                     |

---

## 📁 Estrutura de Pastas

```
monorepo-boilerplate/
│
├── apps/
│   ├── web/                    # Next.js + Tailwind (roda local)
│   │   ├── src/
│   │   │   ├── app/            # App Router, páginas e layouts
│   │   │   ├── components/     # Componentes React reutilizáveis
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── lib/            # Utilitários e configurações
│   │   │   └── styles/         # CSS global
│   │   ├── public/             # Arquivos estáticos
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json       # Extende packages/config/typescript/base.json
│   │   └── package.json        # name: "web"
│   │
│   ├── server/                 # Express + Prisma (roda no Docker)
│   │   ├── src/
│   │   │   ├── routes/         # Definição das rotas HTTP
│   │   │   ├── controllers/    # Handlers das requisições
│   │   │   ├── services/       # Lógica de negócio
│   │   │   ├── middlewares/    # Auth, logging, etc.
│   │   │   └── index.ts        # Entry point
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Estrutura do banco de dados
│   │   │   └── migrations/     # Histórico de mudanças no banco
│   │   ├── Dockerfile
│   │   ├── .env                # Variáveis de ambiente (não commitado)
│   │   ├── tsconfig.json
│   │   └── package.json        # name: "server"
│   │
│   └── mobile/                 # React Native + Expo (roda local)
│       ├── src/
│       │   ├── app/            # Expo Router, telas e navegação
│       │   ├── components/     # Componentes React Native
│       │   ├── hooks/          # Custom hooks
│       │   └── lib/            # Utilitários
│       ├── assets/             # Imagens, fontes, ícones
│       ├── app.json            # Configuração do Expo
│       ├── tsconfig.json
│       └── package.json        # name: "mobile"
│
├── packages/                   # Código compartilhado entre os apps
│   ├── types/                  # @repo/types, interfaces TypeScript
│   │   └── src/index.ts
│   ├── utils/                  # @repo/utils, funções utilitárias
│   │   └── src/index.ts
│   └── config/                 # @repo/config, ESLint e TSConfig base
│       ├── eslint/index.js
│       └── typescript/base.json
│
├── docker-compose.yml          # Sobe server + PostgreSQL
├── turbo.json                  # Configuração do Turborepo
├── pnpm-workspace.yaml         # Define os workspaces do pnpm
├── package.json                # Scripts raiz + devDependencies globais
├── .env.example                # Template das variáveis de ambiente
├── .gitignore
├── .npmrc
├── CONTEXT.md                  # 🤖 Contexto da arquitetura para IAs
└── README.md                   # Este arquivo
```

---

## ✅ Pré-requisitos

Antes de começar, verifique se você tem:

```bash
# Node.js 20.19+ ou 22.12+ (requisito do Prisma 7)
node --version   # deve mostrar v20.19+ ou v22.12+

# pnpm (instale se não tiver)
pnpm --version   # deve mostrar 9.x.x
# Para instalar: npm install -g pnpm

# Docker Desktop rodando
docker --version
docker ps        # deve listar containers sem erro
```

> **Turborepo e Expo CLI não precisam ser instalados globalmente.** Ambos estão configurados como dependências do projeto e rodam automaticamente via `pnpm`.

---

## 🚀 Instalação e Setup

> Execute estes comandos **uma única vez** após clonar o repositório.

### 1. Clonar e entrar na pasta

```bash
git clone https://github.com/seu-usuario/monorepo-boilerplate.git
cd monorepo-boilerplate
```

### 2. Instalar todas as dependências

```bash
pnpm install
```

Isso instala as dependências de **todos** os apps e packages de uma vez.

### 3. Configurar as variáveis de ambiente

```bash
cp .env.example apps/web/.env.local
cp .env.example apps/server/.env
cp .env.example apps/mobile/.env
```

Edite cada arquivo e ajuste os valores conforme necessário. Veja a seção [Variáveis de Ambiente](#-variáveis-de-ambiente) para detalhes.

### 4. Subir o banco de dados e o server

```bash
pnpm docker:up
```

Este comando sobe o **PostgreSQL** e o **server (Node.js/Express)** em containers Docker.

Após a inicialização, ao acompanhar os logs com `pnpm docker:logs` o server deve imprimir:

```
🚀 Server ready at http://localhost:3001
📦 Successfully connected with database
```

A primeira linha confirma que o Express está escutando, e a segunda confirma que o `PrismaClient.$connect()` validou a conexão com o PostgreSQL.

### 5. Aplicar o schema no banco de dados

```bash
pnpm db:push
```

> ✅ Deve exibir: `🚀 Your database is now in sync with your Prisma schema`

### 6. Verificar se tudo está funcionando

```bash
curl http://localhost:3001/health
# Deve retornar: {"status":"ok"}
```

---

## 💻 Como Rodar

### Rodar tudo

```bash
# Terminal 1: sobe o Docker (server + banco)
pnpm docker:up

# Terminal 2: roda web + mobile localmente
pnpm dev
```

### Rodar separadamente

```bash
# Só o front-end
pnpm dev:web

# Só o app mobile
pnpm dev:mobile

# Ver logs do server (Docker)
pnpm docker:logs
```

### Rodar web/mobile sem o server (modo offline)

O `apiGet` em [apps/web/src/lib/api.ts](apps/web/src/lib/api.ts) e [apps/mobile/src/lib/api.ts](apps/mobile/src/lib/api.ts) tem **fallback automático**: se a requisição falhar (server fora do ar, sem rede, URL errada), ele usa os dados de [`lib/mocks.ts`](apps/web/src/lib/mocks.ts) e a tela renderiza um banner amarelo avisando **"Modo offline: sem comunicação com o servidor. Os dados abaixo são mockados."**

Isso permite rodar `pnpm dev:web` ou `pnpm dev:mobile` sem precisar do `pnpm docker:up`. Quando o server voltar a responder, o banner some e os dados vêm da API normalmente.

> ⚠️ O fallback dispara em **qualquer falha de rede**, inclusive erros reais (ex: server retornando 500). Se vir o banner quando o server deveria estar respondendo, cheque os logs com `pnpm docker:logs`.

### URLs após inicialização

| Serviço         | URL                                  |
| --------------- | ------------------------------------ |
| Web (Next.js)   | http://localhost:3000                |
| Server (API)    | http://localhost:3001                |
| Health Check    | http://localhost:3001/health         |
| Prisma Studio   | http://localhost:5555 (quando ativo) |
| Adminer (banco) | http://localhost:8080                |

---

## 📌 Comandos

### Desenvolvimento

```bash
pnpm dev              # Roda web + mobile em paralelo
pnpm dev:web          # Só o Next.js (porta 3000)
pnpm dev:mobile       # Só o Expo
```

### Docker (server + banco)

```bash
pnpm docker:up        # Sobe server + PostgreSQL
pnpm docker:down      # Para os containers
pnpm docker:logs      # Logs do server em tempo real
pnpm docker:rebuild   # Rebuilda a imagem do server e reinicia
```

### Banco de dados

```bash
pnpm db:push          # Sincroniza banco com o schema (sem migration)
pnpm db:migrate       # Cria migration nomeada e aplica (use em produção)
pnpm db:studio        # Abre o Prisma Studio em localhost:5555
```

### Qualidade

```bash
pnpm build            # Build de todos os apps
pnpm lint             # ESLint em todos os apps
pnpm format           # Prettier em todos os arquivos
```

### Comandos clássicos (sem os atalhos do pnpm)

Os scripts `pnpm` acima são apenas atalhos. Se você está acostumado com os comandos "puros" do Docker, Prisma, Next.js e Expo, eles continuam funcionando normalmente. Use o que for mais natural pra você.

```bash
# Docker (na raiz do repo)
docker compose up -d                              # ≈ pnpm docker:up
docker compose up --build                         # ≈ pnpm docker:rebuild (em foreground)
docker compose down                               # ≈ pnpm docker:down
docker compose logs -f server                     # ≈ pnpm docker:logs

# Prisma (dentro de apps/server, ou com --filter server na raiz)
npx prisma migrate dev --name <nome_da_migration> # ≈ pnpm db:migrate
npx prisma db push                                # ≈ pnpm db:push
npx prisma generate                               # ≈ pnpm db:generate
npx prisma studio                                 # ≈ pnpm db:studio

# Dev local (dentro do app correspondente)
cd apps/web && pnpm dev                           # ≈ pnpm dev:web (Next.js: next dev)
cd apps/mobile && pnpm dev                        # ≈ pnpm dev:mobile (Expo: expo start)
```

> Para os comandos do Prisma fora do Docker, lembre de exportar `DATABASE_URL` apontando para `localhost:5432` antes (o host `postgres` só resolve dentro da rede do Docker).

---

## 🔑 Variáveis de Ambiente

> ⚠️ **Nunca commite arquivos `.env`**. O `.gitignore` já os ignora. Use o `.env.example` como referência.

### Por que o projeto roda sem criar `.env` em desenvolvimento

Você consegue subir back, front, mobile e banco sem criar nenhum `.env`. Isso acontece por **dois mecanismos distintos**, não por um só:

1. **Server e PostgreSQL (no Docker):** o `docker-compose.yml` injeta as variáveis diretamente nos containers pelo bloco `environment:` (`DATABASE_URL`, `PORT`, `WEB_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`). Os processos nunca leem um arquivo `.env`; recebem tudo já populado pelo Docker.
2. **Web e Mobile (locais):** não recebem nada do Docker. Funcionam sem `.env` porque o código tem **fallback hardcoded** em [apps/web/src/lib/api.ts](apps/web/src/lib/api.ts) e [apps/mobile/src/lib/api.ts](apps/mobile/src/lib/api.ts): `process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"` (e o equivalente `EXPO_PUBLIC_API_URL` no mobile). Como o fallback aponta pra porta que o Docker expõe, o client encontra o server sem configuração extra.

> 🚨 **Em produção isso não vai do jeito que está.** As credenciais do banco (`postgres:postgres`) estão em texto puro no `docker-compose.yml`: bom pra dev local, inseguro pra prod. No deploy real, remova o bloco `environment:` do compose e use `env_file: ./apps/server/.env` (com o `.env` fora do Git) ou um secrets manager (Vault, AWS Secrets Manager, Doppler, etc.). Os fallbacks `?? "http://localhost:3001"` no web/mobile também deixam de fazer sentido: o build do Next/Expo precisa receber a URL real via variável de ambiente no momento do build, senão o app empacotado vai tentar bater em `localhost`.

### `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### `apps/server/.env`

```env
# URL usada pelo server EM RUNTIME dentro do Docker
# "postgres" é o nome do serviço no docker-compose
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/projectdb?schema=public"

PORT=3001
WEB_URL=http://localhost:3000
```

> Para rodar comandos do Prisma CLI fora do Docker (ex: `prisma db push` direto no terminal), exporte `DATABASE_URL` apontando para `localhost:5432` antes do comando, ou use `pnpm docker:logs` e rode os comandos via `docker exec`.

### `apps/mobile/.env`

```env
EXPO_PUBLIC_API_URL=http://localhost:3001
```

---

## 🗄 Banco de Dados

O banco de dados é gerenciado pelo **Prisma ORM** com **PostgreSQL 16**.

### Schema e configuração

A partir do Prisma 7, a URL de conexão **não fica mais no `schema.prisma`**: fica em `apps/server/prisma.config.ts`. O schema só descreve a estrutura do banco:

```prisma
// apps/server/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

A URL é resolvida via `prisma.config.ts`, e o `PrismaClient` é instanciado com o driver adapter `@prisma/adapter-pg`.

### Fluxo de trabalho

```bash
# 1. Edite o schema.prisma
# 2. Aplique as mudanças no banco
pnpm db:push            # desenvolvimento (rápido, sem histórico)
pnpm db:migrate         # produção (cria arquivo de migration)

# 3. Visualize os dados no Prisma Studio
pnpm db:studio
```

### `db:push` vs `db:migrate`

|                                | `db:push`                            | `db:migrate`                   |
| ------------------------------ | ------------------------------------ | ------------------------------ |
| **Quando usar**                | Desenvolvimento, explorando o schema | Produção, mudanças definitivas |
| **Cria arquivo de migration?** | Não                                  | Sim (em `prisma/migrations/`)  |
| **Mantém histórico?**          | Não                                  | Sim                            |
| **Pode perder dados?**         | Sim (se remover campos)              | Avisa antes                    |

---

## 🐳 Docker

O Docker conteineriza apenas o **server** e o **PostgreSQL**. O web e o mobile rodam localmente para ter hot-reload instantâneo.

### Arquitetura Docker

```yaml
services:
  postgres: # banco de dados
    image: postgres:16-alpine
    ports: 5432:5432 # exposto localmente para o Prisma CLI

  server: # API Node.js
    build: ./apps/server # constrói a partir do Dockerfile
    ports: 3001:3001 # exposto localmente para web e mobile
    depends_on:
      postgres: { condition: service_healthy }
```

### Comandos úteis

```bash
# Ver o que está rodando
docker ps

# Entrar no container do server
docker exec -it monorepo_server sh

# Entrar no container do banco
docker exec -it monorepo_postgres psql -U postgres -d projectdb

# Remover volumes (apaga os dados do banco!)
docker-compose down -v
```

---

## 📦 Packages Compartilhados

Os packages em `packages/` são **bibliotecas internas**, não publicadas no npm, usadas diretamente pelos apps.

### `@repo/types`

Interfaces e tipos TypeScript compartilhados entre todos os apps.

```typescript
import { User, ApiResponse, PaginatedResponse } from "@repo/types";
```

Defina aqui todas as interfaces que precisam ser consistentes entre web, server e mobile.

### `@repo/utils`

Funções utilitárias genéricas que não pertencem a nenhum app específico.

```typescript
import { formatDate, sleep, isProd } from "@repo/utils";
```

### `@repo/config`

O `tsconfig.json` de cada app estende `packages/config/typescript/base.json`:

```json
// apps/web/tsconfig.json
{
  "extends": "../../packages/config/typescript/base.json",
  ...
}
```

---

## 📐 Convenções

### TypeScript

```typescript
// ✅ Correto, sem any
async function getUser(id: string): Promise<User> { ... }

// ❌ Evitar
async function getUser(id: any): Promise<any> { ... }
```

### Imports

```typescript
// Arquivos locais do app
import { Button } from "@/components/Button";

// Packages compartilhados
import { User } from "@repo/types";
import { formatDate } from "@repo/utils";
```

### Nomenclatura

| Contexto               | Convenção          | Exemplo         |
| ---------------------- | ------------------ | --------------- |
| Variáveis e funções    | `camelCase`        | `getUserById`   |
| Tipos e interfaces     | `PascalCase`       | `UserProfile`   |
| Componentes React      | `PascalCase`       | `UserCard`      |
| Arquivos de componente | `PascalCase`       | `UserCard.tsx`  |
| Arquivos de utilitário | `camelCase`        | `formatDate.ts` |
| Constantes             | `UPPER_SNAKE_CASE` | `MAX_RETRIES`   |

### Estrutura de pastas no server

```
routes/      → Define URLs e métodos HTTP
controllers/ → Recebe request, chama service, retorna response
services/    → Lógica de negócio e acesso ao banco (Prisma)
middlewares/ → Autenticação, logging, validação global
```

---

## 🔄 Fluxo de Dados

```
Usuário clica em algo no Web ou Mobile
           ↓
  Requisição HTTP para localhost:3001
           ↓
  Express recebe e verifica CORS
           ↓
  Router direciona para o Controller
           ↓
  Controller chama o Service
           ↓
  Service usa Prisma para consultar PostgreSQL
           ↓
  Prisma executa SQL e retorna dados tipados
           ↓
  Service retorna para o Controller
           ↓
  Controller serializa resposta JSON
           ↓
  Web/Mobile renderiza os dados na tela
```

---

## 🧩 Template de Integração

Para servir como ponto de partida, o boilerplate já vem com uma rota `GET /users` integrada ponta-a-ponta entre **server**, **web** e **mobile**.

### Server: camadas em ação

```
apps/server/src/services/users.service.ts      → retorna User[] (mock, troque por Prisma)
apps/server/src/controllers/users.controller.ts → empacota em ApiResponse<User[]>
apps/server/src/routes/users.route.ts           → registra GET /
apps/server/src/index.ts                        → app.use("/users", usersRouter)
```

Teste direto na API:

```bash
curl http://localhost:3001/users
# {"data":[{"id":"1","email":"ana@example.com",...}, ...]}
```

### Cliente HTTP: Axios

A comunicação entre web/mobile e o server usa **Axios**, não `fetch` puro. Cada app cria sua própria instância via `axios.create({ baseURL })` em `lib/api.ts` e a exporta como `api` para uso direto em chamadas mais sofisticadas (ex: `api.post`, `api.put`, headers customizados, interceptors). O helper `apiGet<T>(path, fallback)` é construído em cima dessa instância e cobre o caso comum (GET com fallback offline).

```typescript
// apps/web/src/lib/api.ts (e apps/mobile/src/lib/api.ts, com EXPO_PUBLIC_API_URL)
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});
```

> **Por que axios em vez de `fetch`?** Tipagem genérica nas respostas (`api.get<ApiResponse<T>>`), interceptors prontos para auth/refresh, transformação automática de JSON, timeouts e cancelamento mais simples, e a mesma API funciona idêntica em web e mobile. Para casos mais avançados (ex: interceptor de token), edite a instância `api` em `lib/api.ts`.

### Web: `apps/web/src/lib/api.ts`

Helper `apiGet<T>(path, fallback)` usa a instância `api` (axios), desempacota `ApiResponse<T>` e retorna `{ data, isMocked }`. Se a requisição falhar, devolve `fallback` com `isMocked: true`. A `app/page.tsx` é um Server Component que faz `await apiGet<User[]>("/users", mockUsers)` e mostra um banner quando `isMocked`.

### Mobile: `apps/mobile/src/lib/api.ts`

Mesmo helper, lê `EXPO_PUBLIC_API_URL`. A tela `app/index.tsx` chama via `useEffect`, exibe os usuários com `FlatList` e mostra o banner de modo offline quando o fallback dispara.

### Como adicionar uma nova entidade

1. Defina a interface em `packages/types/src/index.ts`
2. No server, crie `services/<nome>.service.ts` → `controllers/<nome>.controller.ts` → `routes/<nome>.route.ts`
3. Monte a rota em `apps/server/src/index.ts`: `app.use("/<nome>", <nome>Router)`
4. No web/mobile, adicione mocks em `lib/mocks.ts` e chame `apiGet<Tipo>("/<nome>", mockTipo)`

> Os arquivos de exemplo são auto-explicativos e curtos. Leia-os antes de criar os seus para manter o mesmo padrão.

---

## 🤖 Uso com IA

Este boilerplate foi otimizado para ser usado com ferramentas de IA.

### CONTEXT.md

O arquivo `CONTEXT.md` na raiz contém um resumo completo da arquitetura, convenções, comandos e estrutura. As IAs leem este arquivo para entender o projeto sem explorar cada pasta manualmente.

**Claude Code:**

```bash
# Na pasta do projeto
claude
# O Claude Code lê automaticamente o CONTEXT.md
```

**Cursor:**

```
# Na primeira mensagem, mencione:
"Leia o CONTEXT.md antes de começar"
```

### Dicas para codar com IA neste projeto

- Diga qual app você está modificando: `apps/web`, `apps/server`
- Mencione os tipos: "use a interface `User` de `@repo/types`"
- Para novas features: "crie o endpoint no server e o hook no web"
- Mantenha o `CONTEXT.md` atualizado quando adicionar algo novo

---

<div align="center">

Feito com TypeScript, café e muito `pnpm install`

**[⬆ Voltar ao topo](#monorepo-boilerplate)**

</div>
