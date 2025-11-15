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

## Tecnologias

### Backend
- Node.js + Express
- TypeScript
- Spoonacular API
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

- **Backend**: API RESTful que se comunica com a Spoonacular API
- **Frontend**: SPA React que consome a API do backend
- **Docker Compose**: Orquestração dos serviços

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Frontend  │ ───> │   Backend   │ ───> │ Spoonacular  │
│   (React)   │      │  (Express)  │      │     API      │
└─────────────┘      └─────────────┘      └──────────────┘
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

### 2. Configure a API Key

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env e adicione sua API key da Spoonacular
SPOONACULAR_API_KEY=sua_api_key_aqui
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
