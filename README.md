# sg-bot-web-app

Монорепозиторий web-приложения с backend API, worker-процессом и общей базой для будущих shared-модулей.

Проект переведен в `web-only` модель: в архитектуре остается только браузерный клиент без отдельной платформенной версии.

## Что внутри

- `apps/web` - клиентское приложение на `React + Vite + TypeScript`
- `apps/api` - HTTP API на `Fastify`
- `apps/worker` - фоновый процесс на Node.js с подключением к `Redis`
- `packages/shared` - заготовка под общие типы, схемы и утилиты
- `docs/architecture/web-architecture.md` - актуальный архитектурный документ

## Структура репозитория

```text
repo/
|- apps/
|  |- api/
|  |  |- package.json
|  |  `- src/
|  |     `- index.ts
|  |- web/
|  |  |- package.json
|  |  |- vite.config.ts
|  |  |- eslint.config.js
|  |  |- index.html
|  |  `- src/
|  |     |- main.tsx
|  |     |- App.tsx
|  |     |- App.css
|  |     `- index.css
|  `- worker/
|     |- package.json
|     `- src/
|        `- index.ts
|- docs/
|  `- architecture/
|     `- web-architecture.md
|- packages/
|  `- shared/
|     `- package.json
|- docker-compose.yml
|- package.json
|- pnpm-workspace.yaml
|- turbo.json
`- README.md
```

## Роли приложений

### `apps/web`

Фронтенд приложения. Сейчас это стандартная Vite-заготовка с React-счетчиком, но пакет уже подготовлен под дальнейшее развитие продукта.

Текущий стек:

- `React 19`
- `Vite 7`
- `TypeScript`
- `TanStack Query`
- `Zustand`
- `Zod`

На текущем этапе:

- нет реального API-клиента;
- нет продуктовых экранов;
- нет использования `shared`.

### `apps/api`

Backend-сервис на `Fastify`.

Сейчас реализовано:

- запуск HTTP-сервера;
- логирование через встроенный logger Fastify;
- endpoint `GET /health`;
- чтение порта из `PORT` с дефолтом `3000`.

Подключены зависимости, которые указывают на целевую архитектуру:

- `@fastify/cors`
- `@fastify/helmet`
- `@fastify/websocket`
- `zod`
- `shared`

Но в текущем коде они еще почти не используются.

### `apps/worker`

Фоновый процесс для асинхронных задач.

Сейчас реализовано:

- загрузка env через `dotenv`;
- подключение к `Redis`;
- логирование через `pino`;
- корректное завершение по `SIGINT` и `SIGTERM`.

Пакет уже зависит от `bullmq`, но обработчики задач пока не реализованы.

### `packages/shared`

Общий workspace-пакет под схемы, DTO, типы и общие утилиты.

Сейчас это только оболочка с `package.json`. Исходников в пакете пока нет.

## Текущий статус реализации

- `web` - стартовый шаблон Vite/React;
- `api` - минимальный сервис с `/health`;
- `worker` - только подключение к Redis;
- `shared` - пустая заготовка;
- `docker-compose.yml` поднимает только `PostgreSQL` и `Redis`.

Архитектурная база уже намечена, но основная бизнес-логика еще впереди.

## Технологический стек

### Монорепо

- `pnpm workspaces`
- `Turborepo`

### Frontend

- `React`
- `Vite`
- `TypeScript`
- `TanStack Query`
- `Zustand`
- `Zod`

### Backend / Async

- `Fastify`
- `Redis`
- `BullMQ` (задекларирован, но пока не используется в коде)
- `Pino`

### Infrastructure

- `Docker Compose`
- `PostgreSQL 16`
- `Redis 7`

## Как запускать проект

### 1. Требования

- `Node.js`
- `pnpm@10.13.1`
- `Docker` + `Docker Compose`

### 2. Установка зависимостей

```bash
pnpm install
```

### 3. Поднять инфраструктуру

```bash
docker compose up -d
```

Сейчас compose поднимает:

- `postgres` на `5432`
- `redis` на `6379`

Параметры PostgreSQL по умолчанию:

- user: `app`
- password: `app`
- database: `app`

### 4. Запуск всех приложений в dev-режиме

```bash
pnpm dev
```

Команда запускает через Turbo все workspace-пакеты с `dev`-скриптами параллельно:

- `apps/api`
- `apps/worker`
- `apps/web`

### 5. Полезные команды

```bash
pnpm build
pnpm typecheck
pnpm lint
```

## Важные замечания

- Актуальная архитектура хранится в `docs/architecture/web-architecture.md`.
- В `apps/api`, `apps/worker` и `packages/shared` заявлены `build/typecheck`-скрипты с `tsconfig.json`, но самих `tsconfig`-файлов в этих пакетах сейчас нет.
- Между пакетами уже настроены `workspace:*` зависимости, но реальных импортов из `shared` в коде пока нет.
- Локальная инфраструктура пока покрывает только базу данных и Redis, без контейнеров для frontend, API и worker.

## Куда смотреть дальше

- Если нужен продуктовый план развития, см. `docs/architecture/web-architecture.md`.
- Если нужен быстрый старт по текущему состоянию проекта, достаточно поднять `PostgreSQL` и `Redis`, затем выполнить `pnpm dev`.
