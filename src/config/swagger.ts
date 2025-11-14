import { env } from './env';

export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'CineMood API',
    version: '0.1.0',
    description:
      'API do CineMood — Descoberta de filmes por estados de espírito (moods).',
  },
  servers: [
    { url: `/api/v1`, description: 'API base' },
  ],
  tags: [
    { name: 'Public' },
    { name: 'Admin/Auth' },
    { name: 'Admin/Filmes' },
    { name: 'Admin/Pessoas' },
    { name: 'Admin/Associações' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      LoginRequest: {
        type: 'object',
        required: ['login', 'senha'],
        properties: {
          login: { type: 'string' },
          senha: { type: 'string' },
        },
      },
      AuthToken: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          expiraEm: { type: 'string' },
        },
      },
      Mood: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          descricao: { type: 'string' },
          iconeUrl: { type: 'string' },
        },
      },
      Filme: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          titulo: { type: 'string' },
          sinopse: { type: 'string' },
          anoLancamento: { type: 'integer' },
          posterUrl: { type: 'string' },
          fraseEfeito: { type: 'string' },
        },
      },
      Pessoa: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          biografia: { type: 'string' },
          fotoUrl: { type: 'string' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/moods': {
      get: {
        tags: ['Public'],
        summary: 'Lista todos os moods',
        responses: {
          200: {
            description: 'Lista de moods',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Mood' } } } },
          },
        },
      },
    },
    '/filmes': {
      get: {
        tags: ['Public'],
        summary: 'Lista filmes (público) com paginação e filtros',
        parameters: [
          { name: 'titulo', in: 'query', schema: { type: 'string' } },
          { name: 'anoLancamento', in: 'query', schema: { type: 'integer' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200: {
            description: 'Lista de filmes',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Filme' } } } },
          },
        },
      },
      post: {
        tags: ['Admin/Filmes'],
        summary: 'Cadastra um novo filme',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  titulo: { type: 'string' },
                  sinopse: { type: 'string' },
                  anoLancamento: { type: 'integer' },
                  posterUrl: { type: 'string' },
                  fraseEfeito: { type: 'string' },
                },
                required: ['titulo', 'anoLancamento'],
              },
            },
          },
        },
        responses: { 201: { description: 'Criado' } },
      },
    },
    '/filmes/{idFilme}': {
      get: {
        tags: ['Public'],
        summary: 'Obtém detalhes completos de um filme',
        parameters: [{ name: 'idFilme', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Detalhes do filme' }, 404: { description: 'Não encontrado' } },
      },
      put: {
        tags: ['Admin/Filmes'],
        summary: 'Atualiza um filme',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'idFilme', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  titulo: { type: 'string' },
                  sinopse: { type: 'string' },
                  anoLancamento: { type: 'integer' },
                  posterUrl: { type: 'string' },
                  fraseEfeito: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 204: { description: 'Atualizado' } },
      },
      delete: {
        tags: ['Admin/Filmes'],
        summary: 'Remove (soft delete) um filme',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'idFilme', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 204: { description: 'Removido' } },
      },
    },
    '/filmes/mood/{idMood}': {
      get: {
        tags: ['Public'],
        summary: 'Lista filmes por mood',
        parameters: [
          { name: 'idMood', in: 'path', required: true, schema: { type: 'integer' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { 200: { description: 'Lista de filmes' } },
      },
    },
    '/pessoas': {
      get: {
        tags: ['Public'],
        summary: 'Lista pessoas (público) com paginação e filtro',
        parameters: [
          { name: 'nome', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200: {
            description: 'Lista de pessoas',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Pessoa' } } } },
          },
        },
      },
      post: {
        tags: ['Admin/Pessoas'],
        summary: 'Cadastra uma nova pessoa',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  biografia: { type: 'string' },
                  fotoUrl: { type: 'string' },
                },
                required: ['nome'],
              },
            },
          },
        },
        responses: { 201: { description: 'Criado' } },
      },
    },
    '/pessoas/{idPessoa}': {
      put: {
        tags: ['Admin/Pessoas'],
        summary: 'Atualiza uma pessoa',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'idPessoa', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  biografia: { type: 'string' },
                  fotoUrl: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 204: { description: 'Atualizado' } },
      },
      delete: {
        tags: ['Admin/Pessoas'],
        summary: 'Remove (soft delete) uma pessoa',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'idPessoa', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 204: { description: 'Removido' } },
      },
    },
    '/pessoas/filme/{idFilme}': {
      get: {
        tags: ['Public'],
        summary: 'Lista pessoas (atores/diretores) de um filme',
        parameters: [{ name: 'idFilme', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Lista de pessoas' } },
      },
    },
    '/filmes/associar-mood': {
      post: {
        tags: ['Admin/Associações'],
        summary: 'Associa um filme a um ou mais moods',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { idFilme: { type: 'integer' }, idsMood: { type: 'array', items: { type: 'integer' } } }, required: ['idFilme', 'idsMood'] } } },
        },
        responses: { 204: { description: 'Vínculos atualizados' } },
      },
    },
    '/filmes/associar-pessoa': {
      post: {
        tags: ['Admin/Associações'],
        summary: 'Associa uma pessoa a um filme',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  idFilme: { type: 'integer' },
                  idPessoa: { type: 'integer' },
                  papel: { type: 'string' },
                  personagem: { type: 'string' },
                },
                required: ['idFilme', 'idPessoa', 'papel'],
              },
            },
          },
        },
        responses: { 204: { description: 'Vínculo criado/atualizado' } },
      },
    },
    '/admin/login': {
      post: {
        tags: ['Admin/Auth'],
        summary: 'Autentica o administrador (JWT 24h)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: { 200: { description: 'Token JWT', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthToken' } } } }, 401: { description: 'Credenciais inválidas' } },
      },
    },
  },
} as const;
