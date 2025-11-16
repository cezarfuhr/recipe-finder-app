# Deploy Guide - Recipe Finder App

Guia completo para deploy em produção do Recipe Finder App.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente)
3. [Deploy com Docker Compose](#deploy-com-docker-compose)
4. [Deploy em Cloud Providers](#deploy-em-cloud-providers)
5. [Monitoramento e Logs](#monitoramento-e-logs)
6. [Backup e Recuperação](#backup-e-recuperação)
7. [Troubleshooting](#troubleshooting)

## 🔧 Pré-requisitos

### Servidor

- **SO**: Linux (Ubuntu 22.04 LTS recomendado)
- **CPU**: Mínimo 2 vCPUs
- **RAM**: Mínimo 4GB
- **Disco**: Mínimo 20GB SSD
- **Docker**: 24.0+
- **Docker Compose**: 2.20+

### Serviços Externos

- **Spoonacular API Key**: [Registre-se aqui](https://spoonacular.com/food-api/console#Dashboard)
- **Domínio** (opcional): Para HTTPS em produção

## 🔐 Configuração de Variáveis de Ambiente

### 1. Gerar Secrets Seguros

```bash
# Gerar JWT secrets (Linux/Mac)
openssl rand -hex 32  # Para JWT_SECRET
openssl rand -hex 32  # Para JWT_REFRESH_SECRET

# Ou usar Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Criar arquivo .env

```bash
cp .env.example .env
```

### 3. Editar .env com valores de produção

```bash
# Database - Use senhas fortes!
DB_USERNAME=recipe_user
DB_PASSWORD=ALTERE_AQUI_SENHA_FORTE_MINIMO_16_CHARS
DB_NAME=recipe_finder

# JWT - CRÍTICO! Use os secrets gerados acima
JWT_SECRET=seu_jwt_secret_de_32_chars_aqui
JWT_REFRESH_SECRET=seu_refresh_secret_de_32_chars_aqui

# Spoonacular API
SPOONACULAR_API_KEY=sua_api_key_real_aqui
```

### ⚠️ IMPORTANTE

- **NUNCA** commite o arquivo `.env` no git
- Use senhas com mínimo 16 caracteres
- Rotacione secrets regularmente (a cada 90 dias)
- Em produção, use um gerenciador de secrets (AWS Secrets Manager, HashiCorp Vault)

## 🚀 Deploy com Docker Compose

### Deploy Simples (Single Server)

```bash
# 1. Clone o repositório
git clone <seu-repositorio>
cd recipe-finder-app

# 2. Configure as variáveis de ambiente
cp .env.example .env
nano .env  # Edite com suas credenciais

# 3. Inicie os serviços
docker-compose up -d

# 4. Verifique os logs
docker-compose logs -f

# 5. Teste o health check
curl http://localhost:3001/health
```

### Comandos Úteis

```bash
# Ver status dos containers
docker-compose ps

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f postgres

# Reiniciar um serviço
docker-compose restart backend

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (⚠️ APAGA DADOS!)
docker-compose down -v

# Rebuild após mudanças de código
docker-compose up -d --build

# Ver uso de recursos
docker stats
```

## ☁️ Deploy em Cloud Providers

### AWS (Recomendado para Produção)

#### Opção 1: EC2 + RDS + ElastiCache

```bash
# 1. Criar RDS PostgreSQL
- Engine: PostgreSQL 16
- Instance class: db.t3.micro (ou maior)
- Storage: 20GB SSD
- Backup retention: 7 dias
- Multi-AZ: Sim (para alta disponibilidade)

# 2. Criar ElastiCache Redis
- Node type: cache.t3.micro
- Number of nodes: 1 (ou mais para replicação)

# 3. Provisionar EC2
- AMI: Ubuntu 22.04 LTS
- Instance type: t3.small (ou maior)
- Security Group: Permitir 80, 443, 22

# 4. Configurar EC2
ssh ubuntu@your-ec2-ip

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 5. Deploy da aplicação
git clone <repo>
cd recipe-finder-app
cp .env.example .env

# Editar .env com endpoints do RDS e ElastiCache
nano .env

# Iniciar
docker-compose up -d
```

#### Opção 2: ECS Fargate

Veja `docs/AWS_ECS_DEPLOY.md` (a ser criado)

### Google Cloud Platform

```bash
# Cloud Run + Cloud SQL + Memorystore (Redis)
gcloud run deploy recipe-finder-backend \
  --image gcr.io/PROJECT_ID/recipe-finder-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Digital Ocean

```bash
# App Platform (mais simples)
- Conecte seu repositório GitHub
- Configure variáveis de ambiente
- Deploy automático
```

### Heroku

```bash
# Com Heroku Postgres e Redis
heroku create recipe-finder-app
heroku addons:create heroku-postgresql:mini
heroku addons:create heroku-redis:mini
git push heroku main
```

## 📊 Monitoramento e Logs

### Logs Locais

```bash
# Logs em tempo real
docker-compose logs -f

# Últimas 100 linhas
docker-compose logs --tail=100

# Logs de um serviço específico
docker-compose logs -f backend

# Logs salvos (backend)
docker exec recipe-finder-backend cat /app/logs/application-$(date +%Y-%m-%d).log
```

### Monitoramento com Prometheus + Grafana

Ver `docs/MONITORING.md` (a ser criado)

### Alertas Recomendados

- CPU > 80%
- Memória > 85%
- Disco > 90%
- Health check failures
- Taxa de erro > 5%
- Latência > 1s (P95)

## 💾 Backup e Recuperação

### Backup do PostgreSQL

```bash
# Backup manual
docker exec recipe-finder-postgres pg_dump -U recipe_user recipe_finder > backup_$(date +%Y%m%d).sql

# Restauração
docker exec -i recipe-finder-postgres psql -U recipe_user recipe_finder < backup_20240115.sql
```

### Backup Automatizado (Cron)

```bash
# Adicionar ao crontab
crontab -e

# Backup diário às 2AM
0 2 * * * docker exec recipe-finder-postgres pg_dump -U recipe_user recipe_finder | gzip > /backups/recipe_$(date +\%Y\%m\%d).sql.gz
```

### Retenção de Backups

- Diários: 7 dias
- Semanais: 4 semanas
- Mensais: 12 meses

## 🐛 Troubleshooting

### Backend não inicia

```bash
# 1. Ver logs
docker-compose logs backend

# 2. Verificar variáveis de ambiente
docker exec recipe-finder-backend env | grep DB

# 3. Testar conexão com banco
docker exec recipe-finder-postgres psql -U recipe_user -d recipe_finder -c "SELECT 1"

# 4. Verificar porta
netstat -tulpn | grep 3001
```

### Database migration falhou

```bash
# Conectar ao banco e verificar
docker exec -it recipe-finder-postgres psql -U recipe_user -d recipe_finder

# Ver tabelas
\dt

# Ver migrations executadas
SELECT * FROM migrations;
```

### Alta latência / Performance

```bash
# 1. Verificar recursos
docker stats

# 2. Verificar cache Redis
docker exec recipe-finder-redis redis-cli INFO stats

# 3. Verificar queries lentas (PostgreSQL)
docker exec recipe-finder-postgres psql -U recipe_user -d recipe_finder -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
```

### Quota da Spoonacular excedida

```bash
# Ver quantas chamadas foram feitas
docker exec recipe-finder-backend grep "API call to Spoonacular" /app/logs/application-*.log | wc -l

# Aumentar cache TTL (em .env)
SPOONACULAR_CACHE_TTL=7200  # 2 horas ao invés de 1
```

## 🔒 Segurança em Produção

### Checklist de Segurança

- [ ] JWT secrets aleatórios e seguros
- [ ] Senha do banco forte (16+ caracteres)
- [ ] HTTPS configurado (use Certbot/Let's Encrypt)
- [ ] Firewall configurado (apenas portas necessárias)
- [ ] Rate limiting ativado
- [ ] CORS configurado corretamente
- [ ] Backup automático funcionando
- [ ] Monitoramento de logs ativo
- [ ] Updates automáticos de segurança (unattended-upgrades)

### SSL/HTTPS com Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📈 Otimizações de Produção

### PostgreSQL

```sql
-- Em postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
```

### Redis

```conf
# Em redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```

### Docker Resources Limits

```yaml
# Em docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          memory: 512M
```

## 🔄 Atualizações e Rollback

### Deploy de Nova Versão

```bash
# 1. Pull do código
git pull origin main

# 2. Rebuild
docker-compose build

# 3. Rolling update (zero downtime)
docker-compose up -d --no-deps --build backend

# 4. Verificar saúde
curl http://localhost:3001/health
```

### Rollback

```bash
# 1. Voltar para commit anterior
git checkout <commit-hash>

# 2. Rebuild e deploy
docker-compose up -d --build

# Ou usar imagens taggeadas
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Suporte

- **Issues**: https://github.com/seu-usuario/recipe-finder-app/issues
- **Documentação**: https://docs.seu-dominio.com
- **Email**: support@seu-dominio.com

---

**Última atualização**: 2025-01-16
