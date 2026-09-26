# randomHero-api

API REST para gerenciamento de heróis e batalhas, construída com Node.js, Express, Zod e Supabase.

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente (copie de `.env.example`):
   - `PORT`
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY`

3. Inicie o servidor:
   ```bash
   npm run dev
   ```
   Ou em produção:
   ```bash
   npm start
   ```

## Rotas

- `GET /health` - status da API
- `GET /hero` - lista de heróis (em desenvolvimento)
- `POST /hero` - cria um herói (em desenvolvimento)
- `GET /battle?hero1=<id>&hero2=<id>` - batalha entre dois heróis (em desenvolvimento)

## Banco de dados

Crie as tabelas do Supabase executando `db/schema.sql`.

## Desenvolvimento

- `npm run dev` - inicia com watch
- `npm start` - inicia em modo produção
