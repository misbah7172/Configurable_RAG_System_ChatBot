# Configurable RAG Chatbot Platform - Comprehensive Build Guide

## 1. Project Overview

Build a **desktop software platform** for creating, configuring, testing, evaluating, and operating RAG-powered AI chatbots.

This is **not a website-first project**. The primary user interface is an installable desktop application.

The platform should allow users to create multiple chatbots for different purposes, including customer support, research, internal knowledge, documentation, education, and private knowledge bases.

Each chatbot can independently configure:

- System prompt
- Knowledge bases
- Documents
- Chunking strategy
- Embedding provider/model
- Retrieval strategy
- Reranker
- LLM provider/model
- Conversation memory
- Cache policy
- Evaluation configuration

The goal is a **provider-agnostic, scalable RAG platform**, not a single-purpose chatbot.

---

## 2. Product Definition

### Desktop Client

Use:

- Tauri
- React
- TypeScript
- Vite
- Tailwind CSS

The user installs the application on Windows/Linux/macOS.

The desktop application provides:

- Chat interface
- Chatbot builder
- Knowledge-base management
- Document management
- Retrieval configuration
- Cache configuration
- Model configuration
- Evaluation
- Analytics
- System settings

### Backend

Use:

- FastAPI
- Python

Communication:

- HTTPS/REST
- WebSocket or SSE for streaming

### Core infrastructure

- PostgreSQL
- Qdrant
- Redis
- S3-compatible object storage
- Background workers
- Local embedding service
- LLM provider abstraction

---

## 3. High-Level Architecture

```text
                         RAG DESKTOP SOFTWARE
                                  |
                                  v
                  +-------------------------------+
                  |      Tauri Desktop Client     |
                  |                               |
                  | React + TypeScript            |
                  |                               |
                  | Chat                          |
                  | Chatbot Builder               |
                  | Knowledge Base                |
                  | Documents                     |
                  | Retrieval Settings            |
                  | Cache Settings                |
                  | Model Settings                |
                  | Evaluation                    |
                  | Analytics                     |
                  +---------------+---------------+
                                  |
                         HTTPS / WebSocket
                                  |
                                  v
                  +-------------------------------+
                  |        FastAPI Backend        |
                  |                               |
                  | Authentication                |
                  | Chat Orchestrator             |
                  | RAG Engine                    |
                  | Cache Manager                 |
                  | Retrieval Engine              |
                  | LLM Gateway                   |
                  | Configuration Service         |
                  +---------------+---------------+
                                  |
             +--------------------+--------------------+
             |                    |                    |
             v                    v                    v
         PostgreSQL            Qdrant                Redis
         Metadata             Vectors               Cache
             |
             v
       Object Storage

                  +-------------------------------+
                  |       Background Workers      |
                  |                               |
                  | Document Ingestion            |
                  | Embedding Generation          |
                  | Evaluation                    |
                  +-------------------------------+
                                  |
                                  v
                       Local Embedding Service
                              BGE-M3
```

---

## 4. Repository Structure

```text
rag-chatbot-platform/
|
+-- apps/
|   +-- desktop/                 # Tauri + React + TypeScript
|   |   +-- src/
|   |   +-- src-tauri/
|   |
|   +-- api/                     # FastAPI
|       +-- app/
|           +-- api/
|           +-- services/
|           +-- domain/
|           +-- repositories/
|           +-- providers/
|           +-- infrastructure/
|           +-- main.py
|
+-- services/
|   +-- embedding-service/
|   +-- ingestion-worker/
|   +-- evaluation-worker/
|
+-- packages/
|   +-- rag-core/
|   +-- cache/
|   +-- vector-store/
|   +-- providers/
|   +-- common/
|
+-- infrastructure/
|   +-- docker/
|   +-- kubernetes/
|   +-- monitoring/
|   +-- terraform/
|
+-- docs/
|   +-- architecture/
|   +-- api/
|   +-- deployment/
|   +-- decisions/
|
+-- tests/
|   +-- unit/
|   +-- integration/
|   +-- e2e/
|   +-- evaluation/
|
+-- scripts/
+-- .github/
|   +-- workflows/
|   +-- ISSUE_TEMPLATE/
|   +-- PULL_REQUEST_TEMPLATE.md
|
+-- docker-compose.yml
+-- Makefile
+-- README.md
+-- CONTRIBUTING.md
+-- CHANGELOG.md
+-- LICENSE
+-- .gitignore
```

Start smaller if necessary. Do not create empty enterprise-looking directories merely for appearance.

---

## 5. Desktop Application Features

### Chat

- Chat with selected chatbot
- Streaming responses
- Conversation history
- Source citations
- Retrieved-document inspection
- Regenerate response
- Copy/export response
- Clear conversation

### Chatbot Builder

Users can:

- Create chatbot
- Rename chatbot
- Add description
- Select knowledge bases
- Configure system prompt
- Select LLM
- Select embedding model
- Select retrieval strategy
- Enable/disable reranking
- Configure caching
- Configure memory
- Version configuration

### Knowledge Base

Users can:

- Create knowledge base
- Upload documents
- Delete documents
- Re-index documents
- Inspect ingestion status
- View metadata
- Search documents

### Evaluation

Provide:

- Evaluation datasets
- Evaluation runs
- Retrieval metrics
- Generation metrics
- Latency
- Token usage
- Cache hit rate
- Configuration comparison

### Analytics

Display:

- Request count
- Errors
- P50/P95/P99 latency
- Cache hit rate
- Retrieval latency
- LLM latency
- Token usage
- Estimated cost
- Worker status

---

## 6. Backend Architecture

Use FastAPI with clear layers:

```text
API Layer
    |
Application / Service Layer
    |
Domain Layer
    |
Provider Interfaces
    |
Infrastructure Layer
```

Do not put the RAG pipeline directly inside API route functions.

Suggested backend areas:

```text
/api
/services
/domain
/providers
/repositories
/infrastructure
/workers
```

---

## 7. Multi-Tenancy

Logical hierarchy:

```text
Tenant
  |
  +-- Users
  |
  +-- Chatbots
        |
        +-- Configurations
        |
        +-- Knowledge Bases
              |
              +-- Documents
              |
              +-- Chunks
        |
        +-- Conversations
```

Every request should establish:

```text
tenant_id
user_id
chatbot_id
```

Apply tenant isolation to:

- PostgreSQL
- Qdrant
- Redis
- Object storage
- Conversations
- API keys
- Evaluation data

Never rely only on frontend filtering.

---

## 8. PostgreSQL

Use PostgreSQL as the primary relational database.

Suggested tables:

```text
tenants
users
api_keys
chatbots
chatbot_configs
knowledge_bases
documents
document_chunks
conversations
messages
evaluations
evaluation_runs
audit_logs
```

PostgreSQL stores application state, metadata, configuration, conversations, and evaluation results.

Qdrant stores vector representations.

Redis stores temporary/fast state and caches.

---

## 9. Qdrant

Use Qdrant as the primary vector database.

Payload should contain:

```text
tenant_id
chatbot_id
knowledge_base_id
document_id
chunk_id
chunk_index
source
page
document_type
metadata
```

Every search must apply appropriate tenant/chatbot/knowledge-base filters.

Do not mix incompatible embedding models in the same vector space.

Use collection/version management when changing embedding models.

---

## 10. Redis

Redis is the fast state and caching layer.

Logical uses:

```text
Exact Response Cache
Semantic Cache
Embedding Cache
Conversation/Session Cache
Rate Limit Counters
Distributed Locks
Job State
```

Initially one Redis deployment can serve these purposes. Separate infrastructure only when scale justifies it.

---

## 11. Object Storage

Use object storage for original documents.

Development:

```text
MinIO
```

Production:

```text
Amazon S3
Cloudflare R2
Other S3-compatible storage
```

Store original documents and optional processed artifacts.

PostgreSQL stores metadata and object references.

---

## 12. Document Ingestion

Ingestion must be asynchronous.

```text
Desktop App
    |
    v
FastAPI
    |
    v
File Validation
    |
    v
Object Storage
    |
    v
Document Record
    |
    v
Job Queue
    |
    v
Ingestion Worker
    |
    +--> File Parser
    +--> Text Cleaner
    +--> Metadata Extractor
    +--> Chunker
    +--> Embedding Service
    +--> Qdrant
    +--> PostgreSQL Metadata
```

Document states:

```text
UPLOADED
QUEUED
PROCESSING
READY
FAILED
```

Workers should be idempotent.

---

## 13. Document Loaders

Initially support:

```text
PDF
DOCX
TXT
Markdown
HTML
CSV
```

Later:

```text
PPTX
XLSX
JSON
XML
Images/OCR
Web pages
```

Use a loader interface:

```python
class DocumentLoader:
    def load(self, source):
        ...
```

---

## 14. Chunking Engine

Support configurable strategies:

```text
Recursive Chunking
Sentence Chunking
Markdown-aware Chunking
Semantic Chunking
```

Configuration:

```text
chunk_size
chunk_overlap
strategy
```

The active chatbot configuration determines the strategy.

---

## 15. Local Embedding Service

Use local **BGE-M3** as the default embedding solution.

Architecture:

```text
RAG Backend
     |
     v
Embedding Service
     |
     v
Model Manager
     |
     v
BGE-M3
     |
     v
Embedding Vector
```

Support:

- CPU
- GPU
- Batch inference
- Model loading/unloading
- Health checks
- Embedding cache
- Configurable batch size

Logical API:

```text
POST /v1/embed
POST /v1/embed/batch
GET /v1/model
GET /health
```

Provider interface:

```python
class EmbeddingProvider:
    async def embed(self, texts):
        ...
```

Implementations:

```text
LocalBGEProvider
VoyageEmbeddingProvider
```

Voyage AI is optional.

---

## 16. Embedding Cache

Use Redis to avoid repeated embedding computation.

Logical key:

```text
embedding:
provider:{provider}
model:{model}
version:{version}
hash:{text_hash}
```

Flow:

```text
Text
 |
 v
Hash Text
 |
 v
Redis Embedding Cache
 |
 +-- HIT --> Return Embedding
 |
 +-- MISS
       |
       v
     BGE-M3
       |
       v
   Store in Redis
       |
       v
   Return Embedding
```

Embedding caching is independent of response caching.

---

## 17. Retrieval Engine

Support:

### Vector retrieval

```text
Query
  |
Embedding
  |
Qdrant
  |
Top-K
```

### Keyword retrieval

Use PostgreSQL full-text search or another keyword-search implementation.

```text
Query
  |
Keyword Search
  |
Top-K
```

### Hybrid retrieval

```text
                 Query
                   |
          +--------+--------+
          |                 |
          v                 v
     Vector Search     Keyword Search
          |                 |
          +--------+--------+
                   |
                   v
             Result Fusion
                   |
                   v
                  RRF
                   |
                   v
             Candidate Set
```

Use Reciprocal Rank Fusion or another configurable fusion strategy.

---

## 18. Reranking

Optional but recommended for quality.

```text
Hybrid Retrieval
       |
       v
20-50 Candidates
       |
       v
Reranker
       |
       v
Top 3-8 Chunks
```

Provider interface:

```python
class Reranker:
    async def rerank(self, query, documents):
        ...
```

Possible implementations:

```text
Local Reranker
Voyage Reranker
Cohere Reranker
```

---

## 19. Context Builder

The context builder should:

- Remove duplicate chunks
- Respect token limits
- Order chunks
- Format source metadata
- Generate citation IDs
- Enforce context budget

```text
Reranked Chunks
      |
      v
Deduplication
      |
      v
Token Budget Manager
      |
      v
Source Formatter
      |
      v
Citation IDs
      |
      v
Final Context
```

Never blindly send every retrieved chunk to the LLM.

---

## 20. LLM Gateway

Use an abstraction:

```python
class LLMProvider:
    async def generate(self, messages, config):
        ...
```

Possible implementations:

```text
OpenAICompatibleProvider
GeminiProvider
AnthropicProvider
OllamaProvider
```

Handle:

- Provider selection
- Streaming
- Retry
- Timeout
- Token tracking
- Model selection
- Fallback providers
- Error normalization

---

## 21. Chat Orchestrator

Central runtime pipeline:

```text
Incoming Query
      |
      v
Authentication
      |
      v
Tenant Validation
      |
      v
Load Chatbot Configuration
      |
      v
Query Normalization
      |
      v
Exact Cache
      |
      +---- HIT ------> Response
      |
      MISS
      |
      v
Query Embedding
      |
      v
Semantic Cache
      |
      +---- HIT ------> Validate --> Response
      |
      MISS
      |
      v
Retrieval
      |
      v
Reranking
      |
      v
Context Builder
      |
      v
Conversation Memory
      |
      v
Prompt Builder
      |
      v
LLM Gateway
      |
      v
Response Validator
      |
      v
Citation Builder
      |
      v
Cache Write
      |
      v
Persist Message
      |
      v
Stream Response
```

---

## 22. Multi-Level Caching

Use three primary logical caches.

### Level 1: Exact Response Cache

Stores responses for identical normalized queries.

Conceptual key:

```text
tenant_id
chatbot_id
config_version
llm_model
query_hash
```

A hit avoids:

- Embedding
- Retrieval
- Reranking
- LLM generation

---

### Level 2: Semantic Cache

Handles semantically equivalent queries.

Example:

```text
"What is your refund policy?"
"Can I get my money back?"
```

Flow:

```text
Query
  |
Embedding
  |
Semantic Cache Search
  |
Similarity Threshold
```

Example threshold:

```text
similarity >= 0.92
```

Make the threshold configurable.

Validate:

- tenant
- chatbot
- configuration version
- knowledge-base version
- access context
- model/provider requirements

Never return a semantic cache result solely because it is similar.

---

### Level 3: Embedding Cache

Prevents repeated embedding computation.

```text
Query
  |
  v
Embedding Cache
  |
  +-- HIT --> Existing Vector
  |
  +-- MISS
        |
        v
      BGE-M3
        |
        v
    Redis Cache
```

---

## 23. Cache Write-Back

After a successful grounded response:

```text
LLM Response
    |
    +--> Exact Response Cache
    +--> Semantic Cache
    +--> Conversation History
```

Semantic cache entries should contain:

```text
query_embedding
answer
citations
source_document_ids
tenant_id
chatbot_id
config_version
knowledge_base_version
embedding_model
created_at
expires_at
```

---

## 24. Cache Invalidation

Prefer versioned keys over deleting huge numbers of keys.

Important versions:

```text
config_version
knowledge_base_version
embedding_model_version
llm_model_version
```

Examples:

```text
Configuration changed
    |
    v
config_version++
    |
    v
Old response cache no longer matches
```

```text
Knowledge Base Updated
    |
    v
knowledge_base_version++
    |
    v
Affected semantic responses become invalid
```

```text
Embedding model changed
    |
    v
embedding_model/version changes
    |
    v
Old embedding cache is not reused
```

---

## 25. Cache TTL

Make TTL configurable per chatbot.

Example defaults:

```text
Exact Response TTL: 1 hour
Semantic Cache TTL: 1 hour
Embedding Cache TTL: longer/configurable
```

These are examples, not mandatory values.

---

## 26. Cache Security

Every cache lookup must respect:

```text
tenant_id
chatbot_id
user permissions
config_version
knowledge_base_version
```

Cross-tenant cache access must be impossible.

Never use only:

```text
query_hash
```

as a global response-cache key.

---

## 27. Conversation Memory

Support:

```text
No Memory
Short-Term Conversation Memory
Summarized Memory
Long-Term User Memory
```

Do not send the entire conversation to the LLM on every request.

Use:

- Recent message window
- Conversation summaries
- Relevant previous turns

Store permanent conversation history in PostgreSQL.

Use Redis for temporary fast-access state.

---

## 28. Prompt Construction and Injection Protection

Prompt structure:

```text
System Instructions
+
Chatbot Configuration
+
Conversation Memory
+
Retrieved Context
+
Current User Query
```

Retrieved documents are **untrusted data**.

Implement:

- Clear instruction/data separation
- Prompt injection testing
- Output validation
- External authorization for tools/actions
- Sensitive-instruction filtering

Never allow a retrieved document to grant itself permissions.

---

## 29. Background Job System

Use asynchronous workers for:

```text
Document ingestion
Embedding generation
Re-indexing
Document deletion
Evaluation
Benchmarking
```

Start with Redis Streams or a Redis-backed queue.

Possible later options:

```text
RabbitMQ
Kafka
Celery
```

Workers need:

- Retry count
- Exponential backoff
- Failed/dead-letter state
- Job status
- Idempotency

---

## 30. Evaluation System

### Retrieval metrics

```text
Recall@1
Recall@5
Recall@10
MRR
NDCG
```

### Generation metrics

```text
Faithfulness
Answer Relevance
Context Relevance
Citation Correctness
```

### System metrics

```text
P50 latency
P95 latency
P99 latency
Token usage
Cost per request
Cache hit rate
Embedding latency
Retrieval latency
Reranking latency
LLM latency
```

---

## 31. Configuration Benchmarking

Compare configurations using the same evaluation dataset.

Example:

```text
Configuration A
chunk_size = 500
top_k = 10
reranker = off

Configuration B
chunk_size = 800
top_k = 20
reranker = on
```

Compare:

```text
Quality
Latency
Cost
Cache performance
```

Calculate a configurable weighted score.

---

## 32. Observability

Use:

```text
OpenTelemetry
Prometheus
Grafana
```

Optional:

```text
Langfuse
Sentry
```

Track per request:

```text
request_id
tenant_id
chatbot_id
config_version
cache_status
embedding_latency
retrieval_latency
reranker_latency
llm_latency
total_latency
token_usage
model
retrieved_chunk_count
```

Langfuse can provide detailed LLM/RAG traces and evaluations.

---

## 33. Security

Implement:

```text
Authentication
Authorization
Tenant isolation
API key management
Rate limiting
Input validation
File validation
Secret management
Audit logging
Prompt injection protection
```

Never commit:

```text
.env
API keys
database passwords
private certificates
tokens
```

---

## 34. API Design

Use versioned APIs:

```text
/api/v1/auth
/api/v1/chatbots
/api/v1/config
/api/v1/knowledge-bases
/api/v1/documents
/api/v1/conversations
/api/v1/chat
/api/v1/evaluations
/api/v1/metrics
```

The desktop client should not directly access PostgreSQL, Qdrant, or Redis.

---

## 35. Provider Abstractions

Keep the core engine independent of vendors.

Interfaces:

```text
EmbeddingProvider
LLMProvider
Reranker
VectorStore
Retriever
Chunker
CacheProvider
ObjectStorage
```

Examples:

```text
EmbeddingProvider
    |
    +-- LocalBGEProvider
    +-- VoyageEmbeddingProvider

LLMProvider
    |
    +-- OpenAIProvider
    +-- GeminiProvider
    +-- AnthropicProvider
    +-- OllamaProvider

VectorStore
    |
    +-- QdrantVectorStore

ObjectStorage
    |
    +-- MinIOStorage
    +-- S3Storage
    +-- R2Storage
```

---

## 36. Recommended Third-Party Services

### Core

| Area | Recommendation |
|---|---|
| LLM | Provider abstraction |
| Embeddings | Local BGE-M3 |
| Vector DB | Qdrant |
| Cache | Redis |
| Database | PostgreSQL |
| Object Storage | MinIO → S3/R2 |
| Queue | Redis Streams initially |

### Optional

| Area | Options |
|---|---|
| External Embeddings | Voyage AI |
| Reranking | Local / Voyage / Cohere |
| LLM | OpenAI / Gemini / Anthropic / Ollama |
| Authentication | Keycloak / Auth0 / custom |
| LLM Observability | Langfuse |
| Error Tracking | Sentry |
| Metrics | Prometheus |
| Dashboard | Grafana |
| Tracing | OpenTelemetry |

Do not make every service mandatory.

---

## 37. Local Development

Use Docker Compose for infrastructure:

```text
services:
  postgres
  redis
  qdrant
  minio
  api
  embedding-service
  ingestion-worker
  evaluation-worker
```

Run the Tauri desktop application separately during development.

```text
Tauri Desktop
      |
      v
FastAPI
      |
 +----+----+---------+
 |    |    |         |
 v    v    v         v
PG  Redis Qdrant   MinIO
      |
      v
 Workers
      |
      v
Embedding Service
```

---

## 38. Production Architecture

```text
Desktop Clients
       |
       v
Load Balancer / API Gateway
       |
       v
FastAPI Instances
       |
  +----+----+-----+
  |    |    |     |
  v    v    v     v
Redis Qdrant PG  Object Storage
       |
       v
Worker Pool
       |
       v
Embedding Service
       |
       v
GPU/CPU Nodes
```

Scale stateless API instances horizontally.

Scale workers independently.

Scale embedding inference independently.

---

## 39. Kubernetes

Do not start with Kubernetes unless needed.

When scaling requires it, separate:

```text
api-deployment
worker-deployment
embedding-deployment
evaluation-deployment
```

Scale based on actual workload.

---

## 40. Testing Strategy

### Unit

Test:

```text
Chunking
Cache key generation
Configuration validation
Prompt construction
RRF
Metadata filtering
Provider adapters
Token budgeting
```

### Integration

Test:

```text
PostgreSQL
Redis
Qdrant
Object storage
Embedding service
LLM providers
```

### End-to-end

Test:

```text
Upload document
→ ingestion
→ embedding
→ Qdrant
→ query
→ retrieval
→ LLM
→ response
```

### Evaluation

Maintain a fixed RAG evaluation dataset.

Benchmark meaningful retrieval/configuration changes.

---

## 41. Performance

Track:

```text
Cache hit latency
Embedding latency
Retrieval latency
Reranking latency
LLM latency
End-to-end latency
Throughput
Concurrent users
Queue processing rate
```

Optimization order:

```text
1. Correctness
2. Retrieval quality
3. Cache effectiveness
4. Latency
5. Cost
6. Infrastructure efficiency
```

Do not sacrifice groundedness for latency.

---

## 42. Git Strategy

Permanent branches:

```text
main
develop
```

Short-lived branches:

```text
feature/*
fix/*
perf/*
refactor/*
security/*
docs/*
test/*
chore/*
```

Examples:

```text
feature/project-scaffold
feature/chatbot-management
feature/document-ingestion
feature/local-embedding-service
feature/qdrant-retrieval
feature/hybrid-retrieval
feature/reranking
feature/chat-orchestrator
feature/exact-cache
feature/semantic-cache
feature/embedding-cache
feature/rag-evaluation
feature/desktop-ui
```

Use semantic version tags:

```text
v0.1.0
v0.2.0
v1.0.0
```

Use Conventional Commits:

```text
feat(cache): implement semantic response cache
fix(qdrant): apply chatbot metadata filter
perf(embedding): add batch inference
refactor(rag): extract retrieval interface
test(cache): add semantic cache integration tests
docs(architecture): document cache strategy
```

---

## 43. Development Roadmap

### Phase 0 - Foundation

Build:

- Repository
- Tauri desktop shell
- React UI
- FastAPI
- Docker Compose
- PostgreSQL
- Redis
- Qdrant
- MinIO
- Basic CI

Milestone:

```text
Desktop app ↔ FastAPI ↔ Infrastructure
```

### Phase 1 - Chatbot Management

Build:

- Users
- Tenants
- Chatbots
- Configurations
- Configuration versions

Milestone:

```text
Create chatbot
→ Configure chatbot
→ Save configuration
```

### Phase 2 - Document Management

Build:

- Upload
- Object storage
- Metadata
- Async queue
- Parser
- Chunking
- Status tracking

Milestone:

```text
Upload PDF
→ Process
→ READY
```

### Phase 3 - Local Embeddings

Build:

- Embedding service
- BGE-M3
- Batch inference
- Provider interface
- Embedding cache

Milestone:

```text
Document
→ Chunks
→ BGE-M3
→ Vectors
```

### Phase 4 - Qdrant Retrieval

Build:

- Qdrant integration
- Metadata filters
- Vector search
- Retrieval abstraction

Milestone:

```text
Query
→ Embedding
→ Qdrant
→ Relevant chunks
```

### Phase 5 - Hybrid Retrieval

Build:

- Keyword search
- Vector retrieval
- RRF
- Deduplication

Milestone:

```text
Vector + Keyword
→ Fusion
→ Better candidates
```

### Phase 6 - Reranking

Build:

- Reranker interface
- Local/external reranker
- Candidate reranking
- Top-N selection

### Phase 7 - LLM Gateway

Build:

- Provider abstraction
- Streaming
- Retry
- Timeout
- Token tracking
- Provider selection

Milestone:

```text
Context
→ LLM
→ Grounded answer
```

### Phase 8 - Chat Orchestrator

Integrate:

```text
Query
→ Cache
→ Embedding
→ Retrieval
→ Reranking
→ Context
→ Memory
→ LLM
→ Validation
→ Citation
```

### Phase 9 - Multi-Level Caching

Build:

- Exact response cache
- Semantic cache
- Embedding cache
- Cache versioning
- TTL
- Invalidation
- Cache metrics

### Phase 10 - Evaluation

Build:

- Evaluation datasets
- Retrieval metrics
- Generation metrics
- Latency metrics
- Configuration comparison

### Phase 11 - Desktop Productization

Build:

- Polished Tauri UI
- Chatbot builder
- Knowledge-base UI
- Configuration editor
- Evaluation dashboard
- Analytics
- Settings
- Import/export configurations

### Phase 12 - Production Scaling

Build:

- Authentication
- Authorization
- Rate limiting
- Observability
- Distributed tracing
- Worker scaling
- API horizontal scaling
- Backups/recovery
- Security hardening
- Kubernetes if required

---

## 44. Recommended MVP

Start with:

```text
Tauri Desktop
       |
       v
FastAPI
       |
       +-- PostgreSQL
       +-- Redis
       +-- Qdrant
       +-- MinIO
       |
       +-- BGE-M3
       |
       +-- One LLM provider
```

Features:

```text
Create chatbot
Upload documents
Process documents
Generate embeddings
Store vectors
Ask questions
Retrieve context
Generate answer
Show citations
Exact cache
Basic semantic cache
Conversation history
```

This is enough to validate the core architecture.

---

## 45. Do Not Build Initially

Avoid starting with:

```text
Kubernetes
Kafka
Multiple databases
Multiple vector databases
10 LLM providers
5 embedding providers
Complex agent framework
Multi-region deployment
Advanced autonomous agents
```

Start with:

```text
One desktop client
One API
One PostgreSQL
One Redis
One Qdrant
One local embedding model
One LLM provider
One worker system
```

Introduce complexity only when measurements justify it.

---

## 46. Definition of Done for V1

V1 should satisfy:

- Desktop application installs successfully
- User can create a chatbot
- User can configure a chatbot
- User can upload documents
- Documents process asynchronously
- Chunks are created
- BGE-M3 generates embeddings
- Vectors are stored in Qdrant
- User can ask questions
- Retrieval is tenant/chatbot isolated
- LLM produces grounded responses
- Citations are displayed
- Exact cache works
- Semantic cache works
- Embedding cache works
- Conversations are persisted
- Errors are handled
- Unit/integration tests exist
- Docker development environment works
- Documentation explains setup and architecture

---

## 47. Final Target Architecture

```text
                         USER
                           |
                           v
              +-------------------------+
              | Tauri Desktop Software  |
              |                         |
              | React + TypeScript      |
              |                         |
              | Chat                    |
              | Chatbot Builder         |
              | Knowledge Base          |
              | Documents               |
              | Configuration           |
              | Evaluation              |
              | Analytics               |
              +------------+------------+
                           |
                      HTTPS / WS
                           |
                           v
              +-------------------------+
              |       FastAPI           |
              |                         |
              | Auth                    |
              | Chat Orchestrator       |
              | Configuration           |
              | Document API             |
              | Evaluation API          |
              +------------+------------+
                           |
                           v
              +-------------------------+
              |       RAG Engine        |
              |                         |
              | Query Processor         |
              | Cache Manager           |
              | Retrieval Engine        |
              | Reranker                |
              | Context Builder         |
              | Memory Manager          |
              | LLM Gateway             |
              +------------+------------+
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
       Redis            Qdrant          PostgreSQL
       Cache            Vectors         Metadata
          |                                 |
          |                                 v
          |                           Conversations
          |
          v
    Background Jobs
          |
          v
    Ingestion Workers
          |
          v
   Embedding Service
          |
          v
        BGE-M3
          |
          v
       Qdrant
```

---

## 48. Core Design Principles

1. **Desktop-first, not website-first**
2. **Backend separated from UI**
3. **Provider-agnostic AI integrations**
4. **PostgreSQL for relational state**
5. **Qdrant for vector retrieval**
6. **Redis for caching and fast state**
7. **Local BGE-M3 as the default embedding solution**
8. **Asynchronous document ingestion**
9. **Hybrid retrieval before assuming vector search is enough**
10. **Reranking as a configurable component**
11. **Version-aware caching**
12. **Strict tenant isolation**
13. **Evaluation-driven RAG optimization**
14. **Observability from the beginning**
15. **Horizontal scalability for stateless services**
16. **Do not introduce infrastructure complexity without a measured need**
17. **Treat retrieved content as untrusted**
18. **Keep the core RAG engine independent from the UI**
19. **Make every expensive operation measurable**
20. **Optimize correctness before latency**

The target is a **reusable desktop RAG software platform**, not merely a chatbot website.
