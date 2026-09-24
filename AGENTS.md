# AGENTS.md — random-hero-api

Este arquivo define **como** você (o agente) deve trabalhar neste repositório.
O **que** construir está em `docs/SPEC.md`. A **ordem** está em `docs/TASKS.md`.

## Contexto do projeto
API REST simples para cadastrar e sortear personagens (heróis e vilões).
Ela existe para ser alvo de testes automatizados com Cypress, que ficam em
**outro repositório** (`random-hero-tests`). Portanto:
- O objetivo é uma API **pequena, previsível e consistente**, sem funcionalidades extras.
- **Não crie testes Cypress aqui.** Não instale Cypress neste repositório.

## Stack
- Node.js 20+ com **ES Modules** (`"type": "module"` no `package.json`)
- Express
- Zod (validação de entrada)
- Supabase (Postgres) via `@supabase/supabase-js`
- dotenv (variáveis de ambiente)
- Sem TypeScript, sem ORM, sem Docker

## Arquitetura em camadas
Fluxo: `routes -> controllers -> services -> repositories -> Supabase`

- `routes/`: só mapeiam caminho + middleware de validação + controller.
- `controllers/`: lidam com `req`/`res` e chamam services. Sem regra de negócio.
- `services/`: regras de negócio (nome duplicado, 404, sorteio, batalha).
- `repositories/`: **único** lugar que fala com o Supabase.
- `schemas/`: schemas Zod.
- `middlewares/`: `validate.js` e `error-handler.js`.
- `data/`: listas usadas pelo gerador.
- `config/`: leitura de variáveis de ambiente e cliente do Supabase.

Erros de negócio são lançados como um `AppError` (com `status` e `code`) e
tratados **somente** no `error-handler.js`. Controllers não montam respostas de erro.

## Regras de trabalho (importante)
1. **Antes de codar, leia `docs/SPEC.md`.** Ele é a fonte da verdade.
2. **Faça somente a tarefa pedida** de `docs/TASKS.md` e **pare** ao terminar.
   Não adiante tarefas seguintes.
3. **Não altere `docs/SPEC.md` nem `docs/TASKS.md`.** Se achar um erro ou uma
   ambiguidade, pare e descreva o problema para mim em vez de decidir sozinho.
4. Se o SPEC e o código divergirem, o SPEC vence.
5. Não adicione dependências além das listadas na stack sem me perguntar.
6. Não invente endpoints, campos ou regras que não estejam no SPEC.
7. Mantenha o código simples e legível. Sem abstrações desnecessárias.
8. Nomes de arquivos, variáveis e campos em **inglês**. Mensagens de erro em **português (pt-BR)**.

## Segurança
- **Nunca leia, imprima ou copie o conteúdo do arquivo `.env`.**
- Nunca coloque chaves, URLs de banco ou senhas no código, em logs ou em commits.
- Só o `.env.example` (sem valores reais) vai para o Git.
- Nunca exponha a chave secreta do Supabase em respostas da API.

## Comandos
- `npm run dev`: sobe a API com recarga automática (`node --watch src/server.js`)
- `npm start`: sobe a API (`node src/server.js`)

## Ao terminar cada tarefa
Responda em poucas linhas com:
1. Lista dos arquivos criados ou alterados.
2. Como eu posso testar manualmente (exemplo de comando `curl`).
3. Qualquer dúvida ou ponto do SPEC que ficou ambíguo.

Depois disso, **pare e aguarde** o próximo pedido.
