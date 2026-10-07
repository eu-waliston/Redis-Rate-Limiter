# 🚦 Redis Rate Limiter

<img width="1536" height="1024" alt="Image" src="https://github.com/user-attachments/assets/d96a074d-5f21-4d1e-a0ff-681ae88dc2ed" />

<p align="center">
  <strong>Distributed API Rate Limiting with Redis</strong>
</p>

<p align="center">
  Um Rate Limiter distribuído, rápido e escalável para controle de requisições em APIs, utilizando Node.js, TypeScript e Redis.
</p>

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?style=for-the-badge\&logo=redis\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)

</p>

---

## 📌 Sobre o Projeto

O **Redis Rate Limiter** é uma solução desenvolvida para controlar a quantidade de requisições que um cliente pode realizar em uma API durante determinado período de tempo.

O projeto utiliza o **Redis** como armazenamento compartilhado para controlar contadores e janelas de requisições, permitindo que o Rate Limiter funcione mesmo quando a aplicação possui múltiplas instâncias.

### Problema

APIs públicas ou privadas podem receber uma quantidade excessiva de requisições de um mesmo cliente.

Isso pode causar:

* Sobrecarga dos servidores;
* Consumo excessivo de recursos;
* Ataques de força bruta;
* Abuso de endpoints;
* Aumento desnecessário de custos;
* Degradação da experiência dos usuários;
* Instabilidade em serviços dependentes.

O Rate Limiter atua como uma camada de proteção entre o cliente e a aplicação.

```text
Client
   │
   │ HTTP Request
   ▼
┌─────────────────────┐
│     Rate Limiter    │
└──────────┬──────────┘
           │
           ▼
       ┌───────┐
       │ Redis │
       └───┬───┘
           │
     ┌─────┴─────┐
     │           │
   ALLOW        BLOCK
     │           │
     ▼           ▼
   API         HTTP 429
```

---

# 🎯 Objetivos

O projeto foi criado com os seguintes objetivos:

* Implementar Rate Limiting utilizando Redis;
* Entender controle de requisições em APIs;
* Trabalhar com armazenamento em memória;
* Implementar controle baseado em TTL;
* Criar middleware reutilizável;
* Trabalhar com HTTP `429 Too Many Requests`;
* Desenvolver uma solução compatível com múltiplas instâncias;
* Explorar algoritmos diferentes de Rate Limiting;
* Criar uma arquitetura preparada para escalabilidade;
* Aplicar conceitos de sistemas distribuídos.

---

# ⚡ Como funciona

Na primeira versão, o projeto utiliza o algoritmo **Fixed Window Counter**.

Por exemplo:

```text
Limite: 100 requisições
Janela: 60 segundos
Identificador: IP
```

Cada cliente possui um contador armazenado no Redis.

```text
IP: 192.168.0.10

Requests:
██████████████████████████████████████████████████

50 / 100
```

Enquanto o limite não for atingido:

```text
Request
   │
   ▼
Redis
   │
   ├── contador < limite
   │
   ▼
ALLOW
```

Quando o limite é atingido:

```text
Request
   │
   ▼
Redis
   │
   ├── contador >= limite
   │
   ▼
HTTP 429
```

O contador possui um TTL que determina quando a janela será reiniciada.

---

# 🧠 Arquitetura

```text
                         ┌─────────────────┐
                         │     Client      │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │    API Server   │
                         │   Node.js/TS    │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Rate Limiter    │
                         │   Middleware    │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │      Redis      │
                         │                 │
                         │ Counter + TTL   │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                  ALLOW                       BLOCK
                    │                           │
                    ▼                           ▼
             ┌─────────────┐            ┌─────────────┐
             │ Controller  │            │ HTTP 429    │
             └─────────────┘            └─────────────┘
```

---

# 🛠️ Tecnologias

## Backend

* Node.js
* TypeScript
* Express

## Infraestrutura

* Redis
* Docker
* Docker Compose

## Testes

* Jest
* Supertest

## Futuras integrações

* Prometheus
* Grafana
* Swagger / OpenAPI
* Nginx

---

# 📂 Estrutura do Projeto

```text
redis-rate-limiter/
│
├── src/
│   │
│   ├── config/
│   │   └── redis.ts
│   │
│   ├── controllers/
│   │   └── test.controller.ts
│   │
│   ├── middleware/
│   │   └── rateLimiter.ts
│   │
│   ├── routes/
│   │   └── test.routes.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests/
│   └── rateLimiter.test.ts
│
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🚀 Instalação

## Pré-requisitos

Antes de executar o projeto, certifique-se de possuir:

* Node.js 22+
* npm
* Docker
* Docker Compose
* Git

---

## 1. Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/redis-rate-limiter.git

cd redis-rate-limiter
```

---

## 2. Instale as dependências

```bash
npm install
```

---

## 3. Configure as variáveis de ambiente

Crie um arquivo `.env`:

```env
PORT=3000

REDIS_HOST=localhost
REDIS_PORT=6379

RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60
```

---

## 4. Inicie o Redis

Utilizando Docker Compose:

```bash
docker compose up -d
```

Verifique os containers:

```bash
docker ps
```

---

## 5. Execute a aplicação

Modo desenvolvimento:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Produção:

```bash
npm start
```

---

# 🔌 API

## Health Check

```http
GET /health
```

Resposta:

```json
{
  "status": "ok",
  "redis": "connected"
}
```

---

# 🚦 Rate Limit

Exemplo de configuração:

```text
100 requests / 60 seconds
```

Cada requisição passa pelo middleware:

```text
Request
   │
   ▼
RateLimiter
   │
   ▼
Redis
   │
   ├── Allowed
   │      ↓
   │     API
   │
   └── Blocked
          ↓
        HTTP 429
```

---

# 📊 Headers

Quando uma requisição é processada, a API pode retornar informações relacionadas ao limite:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 72
X-RateLimit-Reset: 45
```

Quando o limite for excedido:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 45
```

---

# ❌ Rate Limit Exceeded

Quando o cliente ultrapassa o limite:

```json
{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Try again later.",
  "retryAfter": 45
}
```

Status HTTP:

```text
429 Too Many Requests
```

---

# 🔑 Estratégia de Identificação

Inicialmente, o Rate Limiter utiliza o endereço IP do cliente:

```text
Client IP
   │
   ▼
192.168.0.10
   │
   ▼
Redis Key
   │
   ▼
rate-limit:192.168.0.10
```

A arquitetura será posteriormente expandida para suportar diferentes identificadores:

```text
IP
│
├── User ID
│
├── API Key
│
├── JWT Subject
│
└── Custom Identifier
```

---

# 🧮 Algoritmos

O projeto será desenvolvido progressivamente utilizando diferentes algoritmos.

### Implementado

* [x] Fixed Window Counter

### Planejado

* [ ] Sliding Window
* [ ] Sliding Window Counter
* [ ] Token Bucket
* [ ] Leaky Bucket

A comparação entre os algoritmos permitirá analisar diferenças de:

* Precisão;
* Memória;
* Performance;
* Complexidade;
* Distribuição;
* Burst control.

---

# 🌐 Escalabilidade

Uma das principais vantagens de utilizar Redis é permitir que múltiplas instâncias da API compartilhem o mesmo estado.

```text
                    Load Balancer
                         │
             ┌───────────┼───────────┐
             │           │           │
             ▼           ▼           ▼
          API #1       API #2      API #3
             │           │           │
             └───────────┼───────────┘
                         │
                         ▼
                      Redis
```

Sem Redis:

```text
API #1 → contador local
API #2 → contador local
API #3 → contador local
```

Cada servidor teria uma visão diferente do limite.

Com Redis:

```text
API #1 ──┐
API #2 ──┼──→ Redis
API #3 ──┘
```

Todos compartilham o mesmo contador.

---

# 🧪 Testes

Os testes verificarão cenários como:

```text
✓ Request dentro do limite
✓ Request no limite máximo
✓ Request acima do limite
✓ TTL do contador
✓ Reset da janela
✓ Retorno HTTP 429
✓ Headers de Rate Limit
✓ Redis indisponível
✓ Múltiplos clientes
```

Executar:

```bash
npm test
```

Modo watch:

```bash
npm run test:watch
```

---

# 📈 Observabilidade

Uma futura versão do projeto terá suporte a métricas:

```text
Total Requests
      │
      ├── Allowed
      │
      └── Blocked
```

Métricas planejadas:

```text
rate_limit_requests_total
rate_limit_blocked_requests_total
rate_limit_allowed_requests_total
rate_limit_redis_errors_total
rate_limit_latency_seconds
```

A visualização poderá ser realizada utilizando:

```text
Prometheus
     ↓
Grafana
```

---

# 🔐 Segurança

O Rate Limiter pode ser utilizado como uma camada adicional de segurança contra:

* Brute Force;
* Credential Stuffing;
* API Abuse;
* Scraping excessivo;
* DDoS em pequena escala;
* Flood de endpoints;
* Tentativas excessivas de autenticação.

> Rate Limiting não substitui uma estratégia completa de segurança ou proteção contra DDoS. Ele é uma camada dentro de uma arquitetura de defesa em profundidade.

---

# 🐳 Docker

O ambiente de desenvolvimento utiliza Docker para executar o Redis.

```text
┌─────────────────────────────────────┐
│             Docker                  │
│                                     │
│   ┌─────────────────────────────┐   │
│   │          Redis              │   │
│   │          :6379              │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
                ▲
                │
                │
        Node.js Application
```

Iniciar:

```bash
docker compose up -d
```

Parar:

```bash
docker compose down
```

Ver logs:

```bash
docker compose logs -f redis
```

---

# 🔬 Roadmap

## Phase 1 — Core

* [x] Definição da arquitetura
* [ ] Configuração do projeto
* [ ] Docker Compose
* [ ] Conexão com Redis
* [ ] Middleware
* [ ] Fixed Window
* [ ] HTTP 429
* [ ] TTL
* [ ] Headers

## Phase 2 — Production Ready

* [ ] Testes automatizados
* [ ] Tratamento de falhas do Redis
* [ ] Configuração por ambiente
* [ ] Logs estruturados
* [ ] Health checks
* [ ] Graceful shutdown

## Phase 3 — Advanced Rate Limiting

* [ ] Sliding Window
* [ ] Token Bucket
* [ ] Leaky Bucket
* [ ] Limites por usuário
* [ ] Limites por API Key
* [ ] Limites por endpoint
* [ ] Limites personalizados

## Phase 4 — Distributed Architecture

* [ ] Múltiplas instâncias da API
* [ ] Load Balancer
* [ ] Distributed Rate Limiting
* [ ] Redis atomic operations
* [ ] Redis Lua Scripts
* [ ] Concorrência
* [ ] Race Conditions

## Phase 5 — Observability

* [ ] Prometheus
* [ ] Grafana
* [ ] Métricas
* [ ] Tracing
* [ ] Dashboards
* [ ] Alertas

---

# 📚 Conceitos Estudados

Este projeto explora conceitos importantes de backend e sistemas distribuídos:

```text
Redis
Caching
TTL
Atomic Operations
Rate Limiting
HTTP 429
Middleware
Distributed Systems
Concurrency
Race Conditions
Scalability
Load Balancing
Observability
Docker
API Design
```

---

# 🎓 Objetivo Educacional

O projeto foi desenvolvido como laboratório prático para compreender como sistemas modernos controlam tráfego e protegem APIs contra uso excessivo.

Mais do que simplesmente utilizar Redis, o objetivo é compreender:

> **Por que Redis é utilizado?**

> **Qual problema ele resolve?**

> **Como o Rate Limiter funciona em múltiplas instâncias?**

> **Quais são os limites de cada algoritmo?**

> **Como transformar uma implementação simples em uma solução distribuída?**

---

# 📌 Próximos Passos

A evolução planejada é:

```text
Fixed Window
     ↓
Redis
     ↓
Middleware
     ↓
Tests
     ↓
Sliding Window
     ↓
Token Bucket
     ↓
Distributed Rate Limiting
     ↓
Multiple API Instances
     ↓
Load Balancer
     ↓
Prometheus
     ↓
Grafana
     ↓
Production Architecture
```

---

# 👨‍💻 Autor

Desenvolvido por **Waliston** como projeto de estudo e laboratório de arquitetura backend.

---

# ⭐ Contribuição

Contribuições, sugestões e melhorias são bem-vindas.

Para contribuir:

```bash
git fork
git checkout -b feature/new-feature
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

Abra um Pull Request descrevendo as alterações realizadas.

---

# 📄 Licença

Este projeto está disponível sob a licença MIT.

---

<p align="center">
  <strong>Built with Node.js, TypeScript & Redis ⚡</strong>
</p>

<p align="center">
  <sub>Because apparently telling an API "calm down" requires distributed systems.</sub>
</p>
