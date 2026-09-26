# TASKS — random-hero-api

Execute **uma tarefa por vez**, na ordem. Ao terminar cada uma, siga o
"Ao terminar cada tarefa" do `AGENTS.md` e **pare**.
Antes de cada tarefa, releia a(s) seção(ões) relevante(s) de `docs/SPEC.md`.

Como pedir: *"Leia o AGENTS.md e o docs/SPEC.md e execute a tarefa N do docs/TASKS.md. Pare ao terminar."*

---

## Tarefa 1 — Setup do projeto
**Fazer**
- Criar `package.json` (`"type": "module"`, scripts `dev` e `start`) e instalar: `express`, `zod`, `@supabase/supabase-js`, `dotenv`.
- Criar a estrutura de pastas do SPEC (seção 8), com arquivos vazios ou mínimos onde ainda não houver conteúdo.
- `src/config/env.js`: carrega o `.env` e valida `SUPABASE_URL` e `SUPABASE_SECRET_KEY` (erro claro se faltarem); `PORT` padrão `3000`.
- `src/app.js` (monta o Express, `express.json()`) e `src/server.js` (`app.listen`).
- `GET /health` conforme o SPEC.
- Criar `.env.example` (só nomes das variáveis, sem valores).
- Garantir que o `.gitignore` (criar se não existir, ou **acrescentar** as linhas que faltarem, sem apagar as existentes) contenha estas entradas: `node_modules`, `package-lock.json` e `.env`.
- README curto: o que é, como instalar e como rodar.

**Pronto quando**
- `npm run dev` sobe a API e `curl localhost:3000/health` retorna `{"status":"ok"}`.
- `git status` **não** lista `node_modules`, `package-lock.json` nem `.env`.

---

## Tarefa 2 — Erros e middlewares base
**Fazer**
- `src/errors/app-error.js`: classe `AppError` com `status`, `code`, `message` e `details` opcional.
- `src/middlewares/error-handler.js`: responde no formato padrão do SPEC (seção 4). Trata `AppError`, JSON malformado (`INVALID_JSON`) e qualquer erro inesperado (`INTERNAL_ERROR`, sem vazar detalhes).
- Handler de rota inexistente (`NOT_FOUND`, seção 7).
- `src/middlewares/validate.js`: recebe um schema Zod e a origem (`body`, `query` ou `params`); em caso de falha lança `VALIDATION_ERROR` com `details` (`field` + `message`).

**Pronto quando**
- Uma rota inexistente retorna 404 no formato padrão.
- Enviar JSON quebrado retorna 400 `INVALID_JSON`.

---

## Tarefa 3 — Banco de dados e repository
**Fazer**
- Criar `db/schema.sql` exatamente como no SPEC (seção 3).
- `src/config/supabase.js`: cria o cliente com `SUPABASE_URL` e `SUPABASE_SECRET_KEY`.
- `src/repositories/hero.repository.js` com as funções: `create`, `findById`, `list({ alignment, page, limit })` (retorna itens + total), `update`, `remove`, `findRandom({ alignment })`.
- Erro de nome duplicado do Postgres (código `23505`) deve virar `AppError` 409 `DUPLICATE_NAME`.

**⚠️ Passo manual meu:** ao terminar, **avise que eu preciso rodar o `db/schema.sql`** no SQL Editor do Supabase (projeto de dev) antes da próxima tarefa.

**Pronto quando**
- O código compila e sobe sem erro. (O teste real acontece na tarefa 5.)

---

## Tarefa 4 — Schemas Zod
**Fazer**
- `src/schemas/hero.schema.js` com todas as regras da seção 3 e da seção 4 (rejeitar campos desconhecidos, `trim`, sem conversão de tipos):
  - `createHeroSchema` (corpo do `POST` e do `PUT`)
  - `generateHeroSchema` (subconjunto opcional, para `/hero/generate`)
  - `idParamSchema` (inteiro positivo)
  - `listQuerySchema` (`alignment`, `page`, `limit` com padrões e limites; converte a query de texto para número)
  - `randomQuerySchema` (`alignment` opcional)
  - `battleQuerySchema` (`hero1`, `hero2` inteiros positivos e diferentes)

**Pronto quando**
- Os schemas existem e são exportados. (Serão usados nas rotas das próximas tarefas.)

---

## Tarefa 5 — `POST /hero`
**Fazer**
- Rota, controller e service para cadastro, usando o `validate` e o repository.
- Resposta 201 com o objeto Hero; nomes duplicados (ignorando maiúsculas/minúsculas) retornam 409.

**Pronto quando**
- Um `curl` com corpo válido retorna 201 com `id`, `created_at` e `updated_at`.
- Corpo inválido retorna 400 com `details`; nome repetido retorna 409.

---

## Tarefa 6 — `GET /hero` (filtro e paginação)
**Fazer**
- Listagem conforme a seção 6: `alignment`, `page`, `limit`, ordenação por `id`, resposta com `data`, `page`, `limit`, `total`, `totalPages`.

**Pronto quando**
- `?alignment=villain&page=1&limit=2` funciona; `page=0`, `limit=51` e `alignment=banana` retornam 400.

---

## Tarefa 7 — `GET /hero/:id`
**Fazer**
- Busca por id (400 para id inválido, 404 se não existir).

**Pronto quando**
- `/hero/abc` retorna 400; `/hero/999999` retorna 404; um id existente retorna 200.

---

## Tarefa 8 — `PUT /hero/:id`
**Fazer**
- Atualização completa conforme o SPEC. Renovar `updated_at`. Manter o próprio nome não é conflito; usar o nome de outro personagem retorna 409.

**Pronto quando**
- Atualização válida retorna 200 com `updated_at` novo; id inexistente retorna 404.

---

## Tarefa 9 — `DELETE /hero/:id`
**Fazer**
- Exclusão com 204 sem corpo; 404 para id inexistente (inclusive na segunda exclusão).

**Pronto quando**
- Excluir uma vez retorna 204 e excluir de novo retorna 404.

---

## Tarefa 10 — `GET /hero/random`
**Fazer**
- Sorteio conforme o SPEC, com filtro opcional `alignment`. Declarar a rota **antes** de `/hero/:id`.

**Pronto quando**
- Retorna um personagem existente; com o banco vazio (ou filtro sem resultados) retorna 404; `/hero/random` não é tratado como id.

---

## Tarefa 11 — `POST /hero/generate`
**Fazer**
- `src/data/generator-data.js` com as listas mínimas do SPEC.
- `src/services/generator.service.js`: gera os dados, aplica os campos fixados pelo cliente, tenta até 5 vezes em caso de nome duplicado (nome fixado duplicado: 409 imediato).
- Rota, controller e resposta 201.

**Pronto quando**
- Corpo vazio gera um personagem válido; `{"alignment":"villain"}` sempre gera vilão; `{"power":101}` retorna 400.

---

## Tarefa 12 — `GET /battle`
**Fazer**
- `src/services/battle.service.js` e rota conforme o SPEC: maior `power` vence; empate sorteia e marca `tiebreak: true`.

**Pronto quando**
- Ids iguais ou ausentes retornam 400; id inexistente retorna 404; a resposta segue o formato do SPEC.

---

## Tarefa 13 — Acabamento
**Fazer**
- Revisar o README (instalação, variáveis de ambiente, como rodar, lista de endpoints).
- Conferir que nenhum segredo está no código e que o `.env.example` está atualizado.
- Verificar rapidamente todos os endpoints contra o SPEC e listar qualquer divergência encontrada (sem alterar o SPEC).

**Pronto quando**
- Todos os endpoints respondem como o SPEC descreve e o README está completo.