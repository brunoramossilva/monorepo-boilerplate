# Context

Monorepo TypeScript com três apps principais:

- web em Next.js rodando localmente
- server em Node.js + Fastify + Prisma rodando no Docker
- mobile em Expo + React Native rodando localmente

Pacotes compartilhados:

- types em packages/types
- utils em packages/utils
- config em packages/config

Fluxo base:
web/mobile -> backend containerizado -> Prisma -> PostgreSQL containerizado

Serviços Docker:

- postgres
- backend
- adminer
