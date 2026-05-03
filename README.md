# monorepo-boilerplate

Monorepo base para Web, Server e Mobile com pnpm workspaces e Turborepo.

Fluxo de desenvolvimento:

- web roda localmente em `apps/web`
- mobile roda localmente em `apps/mobile`
- backend, PostgreSQL e Adminer sobem no Docker via `docker-compose.yml`

Estrutura principal:

- `apps/web`: Next.js + Tailwind
- `apps/server`: Node.js + Prisma + PostgreSQL
- `apps/mobile`: Expo + React Native
- `packages/types`: tipos compartilhados
- `packages/utils`: utilitarios compartilhados
- `packages/config`: configs comuns

Comandos úteis:

- `pnpm dev` inicia só web + mobile localmente
- `pnpm docker:up` sobe backend + banco + Adminer
- `pnpm docker:logs` acompanha os logs do backend
- `pnpm docker:down` derruba a stack Docker
