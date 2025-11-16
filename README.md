# Recipe Finder App

Encontre receitas deliciosas e saudáveis facilmente com filtros nutricionais e lista de compras integrada.

## Funcionalidades

- 🔍 **Busca por ingredientes** - Encontre receitas baseadas nos ingredientes que você tem
- 🥗 **Filtros nutricionais** - Filtre por calorias, proteínas, carboidratos e gorduras
- 📝 **Lista de compras** - Adicione ingredientes das receitas diretamente à sua lista
- ⭐ **Favoritos** - Salve suas receitas preferidas
- 👨‍🍳 **Modo passo a passo** - Siga instruções detalhadas para preparar suas receitas
- 🎯 **Filtros de dieta** - Vegetariano, vegano, sem glúten, keto e muito mais
- ⏱️ **Tempo de preparo** - Filtre receitas por tempo disponível

## 🚀 Production-Ready Features

- 🔐 **Autenticação JWT** - Sistema completo de login e registro
- 🗄️ **PostgreSQL** - Persistência de dados com TypeORM
- ⚡ **Redis Cache** - Cache inteligente para economizar chamadas de API
- 📊 **Logging Winston** - Logs estruturados com rotação diária
- 🛡️ **Segurança** - Helmet, rate limiting, validação de dados
- 🏥 **Health Checks** - Monitoramento de banco, cache e API
- 🐳 **Docker Production** - Builds otimizados multi-stage
- 🔄 **CI/CD** - GitHub Actions para testes automatizados
- 📚 **API Docs** - Swagger/OpenAPI completo
- 🔧 **Configurável** - Variáveis de ambiente gerenciáveis

## Tecnologias

### Backend
- Node.js + Express
- TypeScript
- **PostgreSQL** + TypeORM
- **Redis** (cache)
- **JWT** Authentication
- Spoonacular API
- **Winston** (logging)
- **Joi** (validation)
- Jest + Supertest (testes)
- Swagger/OpenAPI (documentação)
- Docker

### Frontend
- React 18
- TypeScript
- Material-UI (MUI)
- Zustand (gerenciamento de estado)
- React Router
- Vite (build tool)
- Jest + React Testing Library (testes)
- Docker + Nginx

## Arquitetura

O projeto utiliza uma arquitetura de microserviços com:

- **Backend**: API RESTful com autenticação JWT
- **Frontend**: SPA React
- **PostgreSQL**: Banco de dados relacional
- **Redis**: Cache para otimização
- **Docker Compose**: Orquestração completa

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Frontend  │ ───> │   Backend   │ ───> │ Spoonacular  │
│   (React)   │      │  (Express)  │      │     API      │
│   Nginx     │      │   + JWT     │      └──────────────┘
└─────────────┘      └──────┬──────┘
                            │
                     ┌──────┴──────┐
                     ▼             ▼
              ┌──────────┐  ┌──────────┐
              │PostgreSQL│  │  Redis   │
              │   (DB)   │  │ (Cache)  │
              └──────────┘  └──────────┘
```

## Pré-requisitos

- Docker e Docker Compose
- Conta na Spoonacular API (gratuita) - [Registre-se aqui](https://spoonacular.com/food-api/console#Dashboard)

## Instalação e Uso

### 1. Clone o repositório

```bash
git clone <repository-url>
cd recipe-finder-app
```

### 2. Configure as Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com suas configurações
nano .env
```

**IMPORTANTE**: Configure os seguintes valores:

```bash
# Database
DB_PASSWORD=escolha_uma_senha_forte

# JWT (OBRIGATÓRIO para produção!)
JWT_SECRET=gere_um_secret_aleatorio_32_chars
JWT_REFRESH_SECRET=gere_outro_secret_aleatorio_32_chars

# Spoonacular
SPOONACULAR_API_KEY=sua_api_key_aqui
```

**Gerar secrets seguros**:
```bash
# Linux/Mac
openssl rand -hex 32

# Ou com Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Execute com Docker Compose

#### Modo Produção

```bash
# Iniciar os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Parar os serviços
docker-compose down
```

#### Modo Desenvolvimento

```bash
# Iniciar os serviços em modo desenvolvimento (com hot reload)
docker-compose -f docker-compose.dev.yml up -d

# Verificar logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar os serviços
docker-compose -f docker-compose.dev.yml down
```

### 4. Acesse a aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs (Swagger)**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

### 5. Crie sua primeira conta

```bash
# Registrar usuário
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "password": "senha123",
    "name": "Seu Nome"
  }'

# Fazer login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "password": "senha123"
  }'
```

## Desenvolvimento Local (sem Docker)

### Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com sua API key

# Executar em modo desenvolvimento
npm run dev

# Executar testes
npm test

# Build para produção
npm run build

# Executar versão de produção
npm start
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar em modo desenvolvimento
npm run dev

# Executar testes
npm test

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## Estrutura do Projeto

```
recipe-finder-app/
├── backend/                    # Microserviço backend
│   ├── src/
│   │   ├── config/            # Configurações
│   │   ├── controllers/       # Controllers da API
│   │   ├── middleware/        # Middlewares (error handler, rate limit)
│   │   ├── routes/            # Rotas da API
│   │   ├── services/          # Serviços de negócio
│   │   ├── types/             # Tipos TypeScript
│   │   └── tests/             # Testes
│   ├── Dockerfile             # Dockerfile de produção
│   ├── Dockerfile.dev         # Dockerfile de desenvolvimento
│   └── package.json
│
├── frontend/                   # Microserviço frontend
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/             # Páginas
│   │   ├── services/          # Serviços de API
│   │   ├── stores/            # Estado global (Zustand)
│   │   ├── types/             # Tipos TypeScript
│   │   └── tests/             # Testes
│   ├── public/                # Arquivos estáticos
│   ├── Dockerfile             # Dockerfile de produção
│   ├── Dockerfile.dev         # Dockerfile de desenvolvimento
│   ├── nginx.conf             # Configuração Nginx
│   └── package.json
│
├── docker-compose.yml         # Compose para produção
├── docker-compose.dev.yml     # Compose para desenvolvimento
├── .env.example               # Exemplo de variáveis de ambiente
└── README.md
```

## API Endpoints

### Receitas

- `GET /api/recipes/search` - Buscar receitas com filtros
- `GET /api/recipes/:id` - Obter detalhes de uma receita
- `GET /api/recipes/random` - Obter receitas aleatórias
- `GET /api/recipes/by-ingredients` - Buscar por ingredientes
- `GET /api/recipes/:id/similar` - Obter receitas similares

### Favoritos

- `GET /api/favorites` - Listar favoritos
- `POST /api/favorites` - Adicionar favorito
- `DELETE /api/favorites/:id` - Remover favorito
- `DELETE /api/favorites/clear/all` - Limpar todos os favoritos

### Lista de Compras

- `GET /api/shopping-list` - Obter lista de compras
- `POST /api/shopping-list` - Adicionar item
- `POST /api/shopping-list/bulk` - Adicionar múltiplos itens
- `PUT /api/shopping-list/:id` - Atualizar item
- `DELETE /api/shopping-list/:id` - Remover item
- `DELETE /api/shopping-list/clear/all` - Limpar lista
- `DELETE /api/shopping-list/clear/purchased` - Limpar itens comprados

## Testes

### Backend

```bash
cd backend

# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm test -- --coverage
```

### Frontend

```bash
cd frontend

# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm test -- --coverage
```

## 🚀 Deploy para Produção

Para deploy em produção, consulte o **[Guia de Deploy Completo](DEPLOY.md)** que inclui:

- Configuração de variáveis de ambiente seguras
- Deploy em AWS, GCP, Digital Ocean, Heroku
- Monitoramento e logs
- Backup e recuperação
- Troubleshooting
- Otimizações de performance
- Checklist de segurança

**Quick Start para Produção**:

```bash
# 1. Gerar secrets
openssl rand -hex 32  # JWT_SECRET
openssl rand -hex 32  # JWT_REFRESH_SECRET

# 2. Configurar .env
cp .env.example .env
# Editar com secrets e senhas fortes

# 3. Deploy
docker-compose up -d

# 4. Verificar saúde
curl http://seu-servidor:3001/health
```

## API Externa Gerenciável

A aplicação se comunica com a Spoonacular API através de variáveis de ambiente, permitindo:

- Trocar a API key facilmente
- Configurar diferentes endpoints
- Ajustar rate limits
- Configurar CORS

Todas as configurações podem ser ajustadas através do arquivo `.env` sem necessidade de rebuild.

## Limitações da API Gratuita

A conta gratuita da Spoonacular permite:
- 150 requisições por dia
- 1 requisição por segundo

Para uso em produção, considere assinar um plano pago.

## Troubleshooting

### Problema: API retorna erro 402

**Solução**: Você excedeu a cota gratuita da API. Aguarde 24 horas ou faça upgrade do plano.

### Problema: Container do backend não inicia

**Solução**: Verifique se a API key está configurada corretamente no arquivo `.env`.

### Problema: Frontend não consegue se conectar ao backend

**Solução**: Certifique-se de que ambos os containers estão na mesma rede do Docker Compose.

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.

## Contato

Para dúvidas e sugestões, abra uma issue no repositório.

---

Desenvolvido com ❤️ usando React, TypeScript e Node.js
