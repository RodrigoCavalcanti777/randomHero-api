# SPEC — random-hero-api

Contrato da API. Esta é a **fonte da verdade** do projeto.
Cada regra aqui deve poder virar um cenário de teste.

## 1. Visão geral
API REST em JSON para cadastrar personagens (heróis ou vilões), sorteá-los,
gerar personagens aleatórios e simular batalhas.

- Base URL local: `http://localhost:3000` (porta configurável via `PORT`)
- Formato: JSON (`Content-Type: application/json`)
- Sem autenticação
- Banco: Supabase (Postgres), tabela `heroes`

## 2. Variáveis de ambiente
| Variável | Descrição |
|---|---|
| `PORT` | Porta da API (padrão `3000`) |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SECRET_KEY` | Chave secreta de servidor do Supabase (nunca vai para o Git) |

A API deve falhar ao iniciar, com mensagem clara, se `SUPABASE_URL` ou
`SUPABASE_SECRET_KEY` não estiverem definidos.

## 3. Modelo de dados: `heroes`

| Campo | Tipo | Regras |
|---|---|---|
| `id` | inteiro | gerado pelo banco |
| `name` | texto | obrigatório, 2 a 50 caracteres (após `trim`), único sem diferenciar maiúsculas/minúsculas |
| `age` | inteiro | obrigatório, de 1 a 10000 |
| `gender` | texto | obrigatório, 1 a 30 caracteres (após `trim`) |
| `ability` | texto | obrigatório, 1 a 200 caracteres (após `trim`) |
| `alignment` | texto | obrigatório, `hero` ou `villain` |
| `power` | inteiro | obrigatório, de 1 a 100 |
| `background` | texto | opcional, até 500 caracteres; pode ser `null` |
| `created_at` | timestamp | gerado pelo banco |
| `updated_at` | timestamp | atualizado a cada `PUT` |

### SQL (`db/schema.sql`)
```sql
create table if not exists heroes (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 50),
  age integer not null check (age between 1 and 10000),
  gender text not null check (char_length(gender) between 1 and 30),
  ability text not null check (char_length(ability) between 1 and 200),
  alignment text not null check (alignment in ('hero', 'villain')),
  power integer not null check (power between 1 and 100),
  background text check (background is null or char_length(background) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists heroes_name_unique_idx on heroes (lower(name));

alter table heroes enable row level security;
-- Sem policies de propósito: só a chave secreta do servidor acessa a tabela.
```

## 4. Formato de erro (padrão para todos os endpoints)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos.",
    "details": [
      { "field": "power", "message": "power deve ser no máximo 100" }
    ]
  }
}
```
- `details` só existe em `VALIDATION_ERROR`.
- Os testes devem conferir o `code`, nunca o texto da `message`.

| `code` | Status | Quando |
|---|---|---|
| `VALIDATION_ERROR` | 400 | corpo, query ou parâmetro inválido |
| `INVALID_JSON` | 400 | corpo com JSON malformado |
| `NOT_FOUND` | 404 | personagem não existe, ou rota inexistente |
| `DUPLICATE_NAME` | 409 | nome já em uso (ignorando maiúsculas/minúsculas) |
| `INTERNAL_ERROR` | 500 | erro inesperado (sem vazar detalhes internos) |

Regras gerais de validação:
- Campos desconhecidos no corpo são **rejeitados** com `VALIDATION_ERROR`.
- Textos são recortados com `trim` antes de validar e salvar.
- Tipos errados (ex.: `age: "20"` como texto) são `VALIDATION_ERROR` (sem conversão automática).
- `:id` deve ser inteiro positivo; caso contrário, `VALIDATION_ERROR` (400), não 404.

## 5. Objeto Hero (resposta)
```json
{
  "id": 1,
  "name": "Dark Vex",
  "age": 120,
  "gender": "male",
  "ability": "Controla sombras",
  "alignment": "villain",
  "power": 87,
  "background": "Busca vingança contra o antigo reino.",
  "created_at": "2026-09-24T18:00:00.000Z",
  "updated_at": "2026-09-24T18:00:00.000Z"
}
```

## 6. Endpoints

### `GET /health`
- 200: `{ "status": "ok" }`

### `POST /hero`
Cadastra um personagem.
- Corpo: `name`, `age`, `gender`, `ability`, `alignment`, `power` (obrigatórios) e `background` (opcional).
- 201: objeto Hero.
- 400 `VALIDATION_ERROR` | 409 `DUPLICATE_NAME`.

### `GET /hero`
Lista personagens, com filtro e paginação.
- Query (todos opcionais):
  - `alignment`: `hero` ou `villain`
  - `page`: inteiro >= 1 (padrão `1`)
  - `limit`: inteiro de 1 a 50 (padrão `10`)
- Ordenação fixa: `id` crescente.
- 200:
```json
{
  "data": [ { "...Hero" } ],
  "page": 1,
  "limit": 10,
  "total": 25,
  "totalPages": 3
}
```
- Página além do fim: 200 com `data: []`.
- Valor inválido em qualquer parâmetro (`page=0`, `limit=51`, `alignment=banana`): 400 `VALIDATION_ERROR`.

### `GET /hero/random`
Sorteia um personagem já cadastrado.
- Query opcional: `alignment` (`hero` ou `villain`).
- 200: objeto Hero.
- 404 `NOT_FOUND` se não houver nenhum personagem (com o filtro aplicado).
- 400 `VALIDATION_ERROR` se `alignment` for inválido.
- **Esta rota deve ser declarada antes de `/hero/:id`.**

### `GET /hero/:id`
- 200: objeto Hero.
- 400 `VALIDATION_ERROR` (id inválido) | 404 `NOT_FOUND`.

### `PUT /hero/:id`
Substitui **todos** os dados editáveis do personagem (mesmas regras do `POST /hero`;
todos os campos obrigatórios devem ser enviados).
- 200: objeto Hero atualizado (`updated_at` renovado, `id` e `created_at` preservados).
- 400 `VALIDATION_ERROR` | 404 `NOT_FOUND` | 409 `DUPLICATE_NAME` (nome usado por **outro** personagem).
- Manter o próprio nome atual não é conflito.

### `DELETE /hero/:id`
- 204 sem corpo.
- 400 `VALIDATION_ERROR` | 404 `NOT_FOUND` (inclusive ao excluir duas vezes).

### `POST /hero/generate`
Cria e salva um personagem com dados aleatórios.
- Corpo **opcional** (pode ser vazio ou `{}`). Pode conter qualquer subconjunto dos
  campos do Hero para fixar valores (ex.: `{ "alignment": "villain" }`). Os campos
  enviados seguem as mesmas validações do `POST /hero`; os demais são sorteados.
- Regras do sorteio (listas em `src/data/generator-data.js`):
  - `name`: `"<prefixo> <sufixo>"` sorteados (mín. 20 prefixos e 20 sufixos)
  - `age`: inteiro aleatório de 16 a 900
  - `gender`: um de `male`, `female`, `other`
  - `ability`: sorteada de uma lista (mín. 15 itens)
  - `background`: sorteado de uma lista (mín. 10 itens)
  - `alignment`: `hero` ou `villain`
  - `power`: inteiro aleatório de 1 a 100
- Se o nome sorteado já existir, tentar de novo até **5 vezes**. Se todas falharem: 409 `DUPLICATE_NAME`.
- Se o `name` foi **fixado** pelo cliente e já existe: 409 imediato, sem novas tentativas.
- 201: objeto Hero criado.
- 400 `VALIDATION_ERROR` (campo fixado inválido ou campo desconhecido).

### `GET /battle?hero1=<id>&hero2=<id>`
Simula uma batalha entre dois personagens.
- Query obrigatória: `hero1` e `hero2`, inteiros positivos e **diferentes**.
- Regra: vence quem tiver maior `power`. Em empate, o vencedor é sorteado e `tiebreak` é `true`.
- 200:
```json
{
  "winner": { "id": 1, "name": "Dark Vex", "power": 87 },
  "loser": { "id": 2, "name": "Sun Knight", "power": 60 },
  "tiebreak": false
}
```
- 400 `VALIDATION_ERROR` (ausente, inválido ou `hero1 == hero2`) | 404 `NOT_FOUND` (algum dos dois não existe).

## 7. Rotas inexistentes
Qualquer rota não listada responde 404 com `code: "NOT_FOUND"` no formato padrão de erro.

## 8. Estrutura de pastas
```
random-hero-api/
├── src/
│   ├── server.js
│   ├── app.js
│   ├── config/        (env.js, supabase.js)
│   ├── routes/        (hero.routes.js, battle.routes.js)
│   ├── controllers/   (hero.controller.js, battle.controller.js)
│   ├── services/      (hero.service.js, generator.service.js, battle.service.js)
│   ├── repositories/  (hero.repository.js)
│   ├── schemas/       (hero.schema.js)
│   ├── middlewares/   (validate.js, error-handler.js)
│   ├── errors/        (app-error.js)
│   └── data/          (generator-data.js)
├── db/schema.sql
├── docs/              (SPEC.md, TASKS.md)
├── AGENTS.md
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
