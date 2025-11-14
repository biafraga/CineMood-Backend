# CineMood API

API em Node.js (Express + TypeScript) para descoberta de filmes por estados de espírito (moods). Conecta em MySQL usando Prisma (somente leitura do schema existente; não cria tabelas). Documentação via Swagger.

## Visão Geral
- Público: Descoberta de filmes por mood e consulta de detalhes.
- Admin: Autenticação (JWT 24h) e CRUD de filmes, pessoas e associações.
- Soft delete: aplicado a filmes e pessoas usando campo `deletadoEm` (se existir no banco).

## Stack
- Node.js + TypeScript
- Express, Helmet, CORS, Rate-limit
- Prisma (MySQL)
- JWT (jsonwebtoken) + bcrypt
- Zod (validação)
- Logs (pino/pino-http)
- Swagger (swagger-ui-express)

## Estrutura de Pastas (resumo)
- `src/`
  - `app.ts`, `server.ts`
  - `config/` (env, logger, swagger)
  - `middlewares/` (auth, error, rateLimit)
  - `schemas/` (DTOs Zod)
  - `repositories/` (Prisma)
  - `services/` (regras de negócio)
  - `controllers/` (HTTP)
  - `routes/` (públicas e admin)
- `prisma/schema.prisma`

## Pré-requisitos
- Node.js LTS (>= 18 recomendado)
- MySQL ativo e acessível; tabelas já existentes:
  - `administrador(id, login, senhaHash)`
  - `filme(...)`, `pessoa(...)`, `mood(...)`
  - `filme_mood(IDFilme, IDMood)`
  - `filme_pessoa(IDFilme, IDPessoa, papel, personagem)`
- Caso deseje soft delete: adicionar colunas (se ainda não existirem):
  - `ALTER TABLE filme ADD COLUMN deletadoEm DATETIME NULL;`
  - `ALTER TABLE pessoa ADD COLUMN deletadoEm DATETIME NULL;`

## Configuração
1. Copie `.env.example` para `.env` e ajuste:
```
PORT=3000
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/NOME_BANCO
JWT_SECRET=um_segredo_forte
BCRYPT_SALT_ROUNDS=10
CORS_ORIGIN=*
```

2. Instale as dependências:
```
npm install
```

3. Gere o cliente Prisma (sem criar tabelas):
```
npx prisma generate
```

4. (Opcional) Sincronize o `schema.prisma` com o banco existente:
```
# Isso lê o schema do banco e atualiza o prisma/schema.prisma
npx prisma db pull
npx prisma generate
```
> Atenção: se executar `db pull`, ajustes manuais como `deletadoEm` no schema podem ser sobrescritos.

## Rodando em localhost
- Desenvolvimento:
```
npm run dev
```
- Produção (build + start):
```
npm run build
npm start
```
- Healthcheck: `GET http://localhost:3000/health`
- Swagger: `http://localhost:3000/docs` (JSON: `/docs-json`)
- Base path da API: `http://localhost:3000/api/v1`

## Criando um administrador
Insira um registro na tabela `administrador` com `login` e `senhaHash` (bcrypt):

- Gerar hash (PowerShell):
```
node -e "console.log(require('bcrypt').hashSync('minha_senha', 10))"
```
- Inserir no banco (exemplo SQL):
```
INSERT INTO administrador (login, senhaHash) VALUES ('admin', '<HASH_GERADO>');
```

## Endpoints Principais
- Públicos:
  - `GET /api/v1/moods`
  - `GET /api/v1/filmes` (paginação `page`, `limit`, filtros `titulo`, `anoLancamento`)
  - `GET /api/v1/filmes/{idFilme}`
  - `GET /api/v1/filmes/mood/{idMood}` (paginação)
  - `GET /api/v1/pessoas` (paginação `page`, `limit`, filtro `nome`)
  - `GET /api/v1/pessoas/filme/{idFilme}`
- Admin (JWT Bearer):
  - `POST /api/v1/admin/login`
  - `GET/POST/PUT/DELETE /api/v1/filmes`
  - `GET/POST/PUT/DELETE /api/v1/pessoas`
  - `POST /api/v1/filmes/associar-mood`
  - `POST /api/v1/filmes/associar-pessoa`

## Testando (rápido)
- cURL (público):
```
# Listar moods
curl http://localhost:3000/api/v1/moods

# Filmes por mood (id=1), página 1, 10 por página
curl "http://localhost:3000/api/v1/filmes/mood/1?page=1&limit=10"

# Filmes (com filtros)
curl "http://localhost:3000/api/v1/filmes?titulo=amor&anoLancamento=2020&page=1&limit=5"

# Pessoas (com filtro)
curl "http://localhost:3000/api/v1/pessoas?nome=joao&page=1&limit=10"
```
- cURL (admin):
```
# Login (retorna { token })
curl -X POST http://localhost:3000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","senha":"minha_senha"}'

# Exemplo usando o token
$TOKEN="seu_token_aqui"
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/v1/filmes
```

## Postman
Incluímos uma collection Postman com todas as rotas (públicas e admin):
- Arquivo: `postman/CineMood.postman_collection.json`
- Variáveis:
  - `baseUrl` (default: `http://localhost:3000/api/v1`)
  - `token` (preenchido automaticamente após login)

Uso:
1. Importe a collection no Postman.
2. Execute `Admin > Login` com suas credenciais.
3. A collection grava o `token` em variável de collection automaticamente.
4. As rotas Admin usarão `Authorization: Bearer {{token}}`.

## Observações
- Se o banco não possuir `deletadoEm` em `filme`/`pessoa`, o soft delete não funcionará; adicione as colunas ou altere para hard delete.
- O Prisma não cria tabelas aqui. Toda alteração de estrutura deve ser feita diretamente no MySQL e refletida com `db pull`.

