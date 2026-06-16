# API-бэкенд (FirstVDS / self-hosted)

Минимальный Node.js API для замены прямого доступа браузера к Supabase/PostgreSQL.

## Зачем

Сейчас фронтенд ходит в БД с `anon`-ключом и открытым RLS. Любой может читать `password_hash` и менять роли. Бэкенд:

- хранит `SERVICE_ROLE_KEY` / `DATABASE_URL` только на сервере;
- проверяет JWT-сессию на каждом запросе;
- применяет права (admin, editor, user).

## Стек

```
nginx → /api/* → Node (Fastify) → PostgreSQL
              → /uploads/* → файлы
              → /* → dist/ (статика Vite)
```

## Эндпоинты (план)

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/auth/login` | логин, выдача httpOnly cookie / JWT |
| POST | `/api/auth/register` | регистрация |
| POST | `/api/auth/logout` | выход |
| GET | `/api/auth/me` | текущий пользователь |
| GET/PUT | `/api/progress` | прогресс профиля |
| CRUD | `/api/wiki/*` | статьи вики (редакторы) |
| POST | `/api/uploads` | картинки |

## Переменные окружения

```env
DATABASE_URL=postgresql://...
JWT_SECRET=случайная_строка_64_символа
PORT=3001
CORS_ORIGIN=https://wwm-wiki-nocthra.ru
```

## Переключение фронтенда

В `.env`:

```env
VITE_API_URL=https://wwm-wiki-nocthra.ru/api
VITE_USE_API_BACKEND=true
```

Клиент `src/lib/apiClient.ts` (следующий этап) будет звать API вместо `getSupabase()`.

## Деплой на FirstVDS

1. `npm run build` в корне → `dist/`
2. `cd server && npm install && npm run build`
3. systemd unit для `node server/dist/index.js`
4. nginx: proxy `/api` → `127.0.0.1:3001`
5. Let's Encrypt для домена

## RLS в Supabase (переходный период)

Пока API не готов, используйте `08_secure_rls_phase1.sql` — view `accounts_public`.
После API — раскомментируйте политики в том же файле и отзовите `anon` на таблицах.
