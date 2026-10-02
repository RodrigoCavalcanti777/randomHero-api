# ⚡ Random Hero API

API REST para cadastro, sorteio e batalha de personagens (heróis e vilões), criada como base para estudos de automação de testes.

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat&logo=express&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-validation-3E67B1?style=flat&logo=zod&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?style=flat&logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-informational)

---

## 📖 Sobre o projeto

A **Random Hero API** permite cadastrar personagens com atributos e habilidades definidos (ou sorteados) por você, listar e filtrar esse acervo, sortear um personagem aleatório e simular batalhas entre eles com base no atributo `power`.

O projeto foi desenhado para ser **pequeno, previsível e consistente**, servindo como alvo de testes automatizados de API. 

---

## 🧱 Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 20+ (ES Modules) |
| Framework | Express 5 |
| Validação | Zod |
| Banco de dados | Supabase (PostgreSQL) |
| Cliente do banco | `@supabase/supabase-js` |

Sem TypeScript, sem ORM, sem Docker — propositalmente enxuto.

---

## 🏗️ Arquitetura

```
routes → controllers → services → repositories → Supabase
```

| Camada | Responsabilidade |
|---|---|
| `routes/` | Mapeia caminho + middleware de validação + controller |
| `controllers/` | Lida com `req`/`res`, sem regra de negócio |
| `services/` | Regras de negócio (duplicidade, 404, sorteio, batalha) |
| `repositories/` | Único ponto de acesso ao Supabase |
| `schemas/` | Validações de entrada com Zod |
| `middlewares/` | `validate.js` e `error-handler.js` |
| `data/` | Listas usadas pelo gerador aleatório |
| `config/` | Variáveis de ambiente e cliente do Supabase |

```
src/
├── config/
├── controllers/
├── data/
├── errors/
├── middlewares/
├── repositories/
├── routes/
├── schemas/
├── services/
├── app.js
└── server.js
```

---

## 🚀 Como rodar

### Pré-requisitos
- Node.js 20 ou superior
- Uma conta no [Supabase](https://supabase.com) com um projeto criado

### 1. Clone o repositório
```bash
git clone https://github.com/<seu-usuario>/random-hero-api.git
cd random-hero-api
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Copie o arquivo de exemplo e preencha com os dados do seu projeto Supabase:
```bash
cp .env.example .env
```

| Variável | Descrição |
|---|---|
| `PORT` | Porta da API (padrão `3000`) |
| `SUPABASE_URL` | URL do seu projeto Supabase |
| `SUPABASE_SECRET_KEY` | Chave secreta de servidor do Supabase |

> ⚠️ Nunca commite o arquivo `.env`. Ele já está no `.gitignore`.

### 4. Crie a tabela no banco
Copie o conteúdo de [`db/schema.sql`](./db/schema.sql) e execute no **SQL Editor** do seu projeto Supabase.

### 5. Suba a API
```bash
npm run dev   # com reload automático
npm start     # produção
```

A API sobe em `http://localhost:3000`.

---

## 📚 Endpoints

### Health
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica se a API está no ar |

### Heróis
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/hero` | Cadastra um personagem |
| `GET` | `/hero` | Lista personagens (filtro e paginação) |
| `GET` | `/hero/random` | Sorteia um personagem já cadastrado |
| `GET` | `/hero/:id` | Busca um personagem por id |
| `PUT` | `/hero/:id` | Atualiza um personagem |
| `DELETE` | `/hero/:id` | Exclui um personagem |
| `POST` | `/hero/generate` | Gera e cadastra um personagem com dados aleatórios |

### Batalha
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/battle?hero1=&hero2=` | Simula uma batalha entre dois personagens |

📄 Contrato completo, regras de validação e formato de erros: [`docs/SPEC.md`](./docs/SPEC.md).

---

## 🧬 Modelo de dados

```json
{
  "id": 1,
  "name": "Thor",
  "age": 1500,
  "gender": "male",
  "ability": "Controla raios e trovões com o martelo Mjolnir",
  "alignment": "hero",
  "power": 92,
  "background": "Príncipe de Asgard, protetor dos nove reinos",
  "created_at": "2026-09-26T16:21:35.760Z",
  "updated_at": "2026-09-26T16:21:35.760Z"
}
```

| Campo | Tipo | Regra |
|---|---|---|
| `name` | string | 2–50 caracteres, único |
| `age` | int | 1–10000 |
| `gender` | string | 1–30 caracteres |
| `ability` | string | 1–200 caracteres |
| `alignment` | enum | `"hero"` ou `"villain"` |
| `power` | int | 1–100 |
| `background` | string | opcional, até 500 caracteres |

---

## ❗ Formato de erro

Todas as respostas de erro seguem o mesmo formato:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos.",
    "details": [
      { "field": "power", "message": "Power não pode ser maior que 100" }
    ]
  }
}
```

| Código | Status |
|---|---|
| `VALIDATION_ERROR` | 400 |
| `INVALID_JSON` | 400 |
| `NOT_FOUND` | 404 |
| `DUPLICATE_NAME` | 409 |
| `INTERNAL_ERROR` | 500 |

---

## 🗂️ Documentação do projeto

| Arquivo | Conteúdo |
|---|---|
| [`docs/SPEC.md`](./docs/SPEC.md) | Contrato completo da API — fonte da verdade |
| [`docs/TASKS.md`](./docs/TASKS.md) | Roteiro de implementação, passo a passo |
| [`AGENTS.md`](./AGENTS.md) | Regras de trabalho para agentes de IA (OpenCode) |

---

## 📄 Licença

Projeto de estudo, livre para uso educacional.
