# Configurable RAG Chatbot Platform — Comprehensive Build Guide

## 1\. Project Overview

Build a production-oriented, configurable Retrieval-Augmented Generation (RAG) chatbot platform rather than a single-purpose PDF chatbot.

The platform must allow an administrator/developer to create multiple independent chatbots, each with its own:

* Knowledge bases
* Documents
* Chunking configuration
* Embedding provider/model
* Retrieval strategy
* Reranker
* LLM provider/model
* System prompt
* Conversation memory policy
* Cache policy
* Evaluation configuration
* Access control

The same core platform should be reusable for:

* University assistants
* Company knowledge assistants
* Customer-support bots
* Product/documentation assistants
* Internal HR assistants
* Research/document assistants
* Any other domain where answers can be grounded in supplied knowledge

The core design principle is:

> \*\*Configuration changes behavior; application code should not need to change for each chatbot.\*\*

\---

# 2\. Main Goals

## Functional goals

The system must support:

1. Multi-tenant chatbot management
2. Knowledge-base management
3. Document upload and ingestion
4. Text extraction
5. Configurable chunking
6. Local embedding generation
7. External embedding providers
8. Vector storage
9. Vector retrieval
10. Keyword retrieval
11. Hybrid retrieval
12. Optional reranking
13. LLM generation
14. Source citations
15. Conversation history
16. Exact query caching
17. Semantic caching
18. Embedding caching
19. Asynchronous ingestion
20. Rate limiting
21. Observability
22. RAG evaluation
23. Configuration versioning
24. Provider abstraction
25. API-first architecture

## Engineering goals

The platform should demonstrate:

* Clean architecture
* Modular design
* Horizontal scalability
* Background workers
* Caching
* Database design
* Vector search
* AI/ML inference
* Retrieval evaluation
* Containerization
* Security
* Observability
* Provider independence

\---

# 3\. Recommended Technology Stack

## Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy
* Alembic

## Primary database

* PostgreSQL

Use PostgreSQL for:

* Users
* Tenants
* Chatbots
* Configurations
* Documents
* Conversations
* Messages
* Evaluations
* API keys
* Audit records

## Vector database

Primary:

* Qdrant

Optional:

* PostgreSQL + pgvector for comparison/testing

## Cache

* Redis

Use Redis for:

* Exact response cache
* Semantic cache metadata
* Embedding cache
* Sessions
* Rate limiting
* Distributed locks
* Temporary task state

## Embeddings

Primary local model:

* `BAAI/bge-m3`

The embedding system must also support external providers through an interface.

Possible providers:

* Voyage AI
* Other providers later

## LLM

Create a provider abstraction.

Possible providers:

* OpenAI-compatible API
* Gemini
* Local Ollama models
* Other OpenAI-compatible servers

Do not hard-code a single LLM provider into the RAG engine.

## Reranking

Create a reranker abstraction.

Support:

* Local reranker
* External reranker

Implementing one reranker initially is enough.

## Background processing

Start with:

* Redis Streams or a lightweight Redis-backed worker system

Later:

* Celery
* RabbitMQ
* Kafka

Do not introduce Kafka merely because it sounds impressive.

## Object storage

Development:

* Local filesystem or MinIO

Production:

* S3-compatible object storage

## Frontend

Recommended:

* Next.js
* TypeScript
* Tailwind CSS

The frontend should provide:

* Admin dashboard
* Chatbot configuration
* Knowledge-base management
* Document upload
* Chat UI
* Evaluation dashboard
* System metrics

## Deployment

* Docker
* Docker Compose for local development
* Kubernetes later if horizontal scaling is required

\---

# 4\. High-Level Architecture

```text
                           ┌─────────────────────┐
                           │      Frontend       │
                           │      Next.js        │
                           └──────────┬──────────┘
                                      │
                                      ▼
                           ┌─────────────────────┐
                           │     API Gateway     │
                           │ FastAPI + Auth      │
                           └──────────┬──────────┘
                                      │
                         ┌────────────┴────────────┐
                         │                         │
                         ▼                         ▼
                ┌─────────────────┐       ┌─────────────────┐
                │ Chat Orchestrator│      │ Admin Services  │
                └────────┬────────┘       └─────────────────┘
                         │
       ┌─────────────────┼───────────────────────────┐
       │                 │                           │
       ▼                 ▼                           ▼
┌─────────────┐   ┌───────────────┐         ┌────────────────┐
│ Redis Cache │   │ Retrieval     │         │ Conversation    │
│             │   │ Engine        │         │ Memory          │
└─────────────┘   └───────┬───────┘         └────────────────┘
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
          Vector         BM25       Metadata
          Search       Search        Filters
             │            │            │
             └────────────┼────────────┘
                          ▼
                    Fusion / RRF
                          │
                          ▼
                      Reranker
                          │
                          ▼
                   Context Builder
                          │
                          ▼
                     LLM Provider
                          │
                          ▼
                  Response Validator
                          │
                          ▼
                 Cache + Persistence
```

Document ingestion is asynchronous:

```text
User Upload
    │
    ▼
FastAPI
    │
    ▼
Object Storage
    │
    ▼
Job Queue
    │
    ▼
Ingestion Worker
    │
    ├── Extract Text
    ├── Clean Text
    ├── Chunk
    ├── Generate Embeddings
    ├── Store Embeddings
    └── Update Document Status
```

\---

# 5\. Repository Structure

Use a monorepo initially.

```text
rag-platform/
│
├── apps/
│   ├── api/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   ├── core/
│   │   │   ├── db/
│   │   │   ├── models/
│   │   │   ├── schemas/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── workers/
│   │   │   ├── middleware/
│   │   │   └── main.py
│   │   ├── tests/
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   │
│   ├── embedding-service/
│   │   ├── app/
│   │   │   ├── providers/
│   │   │   ├── cache/
│   │   │   ├── schemas/
│   │   │   ├── services/
│   │   │   └── main.py
│   │   ├── tests/
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   │
│   └── web/
│       ├── app/
│       ├── components/
│       ├── lib/
│       ├── hooks/
│       ├── types/
│       └── package.json
│
├── packages/
│   ├── shared/
│   └── evaluation/
│
├── infra/
│   ├── docker/
│   ├── qdrant/
│   ├── postgres/
│   ├── redis/
│   └── monitoring/
│
├── migrations/
├── datasets/
├── scripts/
├── tests/
├── docs/
├── docker-compose.yml
├── .env.example
└── README.md
```

\---

# 6\. Core Domain Model

Design these entities.

## Tenant

```text
Tenant
- id
- name
- slug
- created\_at
- updated\_at
```

## User

```text
User
- id
- tenant\_id
- email
- password\_hash / external\_auth\_id
- role
- created\_at
```

Roles:

* owner
* admin
* editor
* viewer

## Chatbot

```text
Chatbot
- id
- tenant\_id
- name
- slug
- description
- status
- active\_config\_version\_id
- created\_at
- updated\_at
```

## ChatbotConfig

```text
ChatbotConfig
- id
- chatbot\_id
- version
- system\_prompt
- retrieval\_config
- chunking\_config
- embedding\_config
- reranking\_config
- generation\_config
- cache\_config
- memory\_config
- created\_at
- created\_by
```

Configurations should be versioned.

Never silently overwrite the active configuration.

## KnowledgeBase

```text
KnowledgeBase
- id
- chatbot\_id
- name
- description
- embedding\_provider
- embedding\_model
- vector\_collection
- created\_at
```

## Document

```text
Document
- id
- knowledge\_base\_id
- filename
- source\_type
- storage\_path
- mime\_type
- file\_size
- checksum
- status
- chunk\_count
- processing\_error
- created\_at
- updated\_at
```

Statuses:

```text
UPLOADED
QUEUED
PROCESSING
READY
FAILED
DELETED
```

## DocumentChunk

Do not necessarily store full vector arrays in PostgreSQL.

```text
DocumentChunk
- id
- document\_id
- chunk\_index
- text
- token\_count
- content\_hash
- metadata
- vector\_id
- created\_at
```

The actual vector should normally live in Qdrant.

## Conversation

```text
Conversation
- id
- chatbot\_id
- user\_id / anonymous\_session\_id
- title
- created\_at
- updated\_at
```

## Message

```text
Message
- id
- conversation\_id
- role
- content
- citations
- token\_usage
- latency\_ms
- cache\_status
- created\_at
```

## Evaluation

```text
Evaluation
- id
- chatbot\_id
- config\_version
- dataset\_id
- recall\_at\_k
- mrr
- ndcg
- faithfulness
- answer\_relevance
- latency
- cost
- created\_at
```

\---

# 7\. Configuration Schema

The system should use a configuration structure similar to:

```json
{
  "chunking": {
    "strategy": "recursive",
    "chunk\_size": 700,
    "chunk\_overlap": 100
  },
  "embedding": {
    "provider": "local",
    "model": "BAAI/bge-m3",
    "dimension": 1024,
    "batch\_size": 32,
    "normalize": true
  },
  "retrieval": {
    "strategy": "hybrid",
    "top\_k": 20,
    "vector\_weight": 0.7,
    "keyword\_weight": 0.3
  },
  "reranking": {
    "enabled": true,
    "top\_k": 5
  },
  "generation": {
    "provider": "openai\_compatible",
    "model": "MODEL\_NAME",
    "temperature": 0.2,
    "max\_tokens": 1000
  },
  "cache": {
    "exact\_query": true,
    "semantic\_query": true,
    "embedding": true,
    "ttl\_seconds": 3600,
    "semantic\_threshold": 0.92
  },
  "memory": {
    "enabled": true,
    "max\_messages": 10
  }
}
```

Do not hard-code these values throughout the application.

\---

# 8\. Embedding Service

Create a dedicated local embedding microservice.

## Requirements

It must:

* Load the embedding model once
* Keep the model in memory
* Support CPU
* Support GPU
* Support batch inference
* Normalize embeddings when configured
* Cache repeated embeddings
* Report model metadata
* Provide health checks
* Support provider abstraction

Recommended first local model:

```text
BAAI/bge-m3
```

The service should expose:

```text
POST /v1/embed
POST /v1/embed/batch
GET  /v1/model
GET  /health
```

Example request:

```json
{
  "texts": \[
    "What is the refund policy?",
    "How long does a refund take?"
  ]
}
```

Example response:

```json
{
  "model": "BAAI/bge-m3",
  "dimension": 1024,
  "embeddings": \[
    \[0.01, -0.02],
    \[0.03, -0.04]
  ]
}
```

The real vectors will contain the model's full dimension.

\---

# 9\. Embedding Provider Interface

Create an interface:

```python
class EmbeddingProvider:
    async def embed(self, texts: list\[str]) -> list\[list\[float]]:
        raise NotImplementedError

    async def embed\_query(self, text: str) -> list\[float]:
        raise NotImplementedError

    def dimension(self) -> int:
        raise NotImplementedError

    def model\_name(self) -> str:
        raise NotImplementedError
```

Implement:

```text
LocalEmbeddingProvider
VoyageEmbeddingProvider
```

Later:

```text
OpenAIEmbeddingProvider
CohereEmbeddingProvider
HuggingFaceEmbeddingProvider
```

The RAG engine must depend on the interface, not the concrete provider.

\---

# 10\. Embedding Cache

Use Redis.

Cache key:

```text
embedding:{provider}:{model}:{model\_version}:{sha256(text)}
```

Never omit the model identifier.

Flow:

```text
Text
 ↓
Hash
 ↓
Redis
 ├── HIT  → Return vector
 └── MISS
       ↓
   Embedding Model
       ↓
      Redis
       ↓
     Return
```

For large-scale systems, consider whether embedding vectors should be stored directly in Redis or whether Redis should only store compact references. Keep memory usage under control.

\---

# 11\. Document Ingestion Pipeline

Support at least:

* PDF
* TXT
* Markdown
* DOCX
* HTML

Pipeline:

```text
Upload
 ↓
Validate
 ↓
Calculate checksum
 ↓
Store file
 ↓
Create Document
 ↓
Queue ingestion job
 ↓
Extract text
 ↓
Normalize text
 ↓
Chunk
 ↓
Generate embeddings
 ↓
Write Qdrant points
 ↓
Update PostgreSQL
 ↓
READY
```

The API should return immediately after queueing.

Do not make the HTTP request wait for a large document to finish processing.

\---

# 12\. Document Deduplication

Calculate:

```text
SHA256(file bytes)
```

If the same file already exists for the same knowledge base:

```text
checksum match
      ↓
avoid reprocessing
```

For chunks, calculate:

```text
SHA256(normalized\_chunk\_text)
```

This enables embedding cache reuse.

\---

# 13\. Chunking Engine

Create:

```text
Chunker
 ├── RecursiveChunker
 ├── MarkdownChunker
 ├── SentenceChunker
 └── SemanticChunker
```

Start with:

```text
RecursiveChunker
```

Configuration:

```text
chunk\_size
chunk\_overlap
```

Do not assume one chunk size works for every domain.

Make it configurable and measurable.

\---

# 14\. Qdrant Design

Use one logical vector space per embedding model/configuration.

Every point should contain:

```json
{
  "id": "chunk-id",
  "vector": \[ ... ],
  "payload": {
    "tenant\_id": "tenant-123",
    "chatbot\_id": "bot-123",
    "knowledge\_base\_id": "kb-123",
    "document\_id": "doc-123",
    "chunk\_id": "chunk-123",
    "chunk\_index": 4,
    "source": "employee-handbook.pdf",
    "document\_type": "pdf",
    "page": 12
  }
}
```

Use payload filters aggressively for tenant and chatbot isolation.

\---

# 15\. Vector Store Interface

Create:

```python
class VectorStore:
    async def upsert(self, points):
        raise NotImplementedError

    async def search(self, query\_vector, filters, limit):
        raise NotImplementedError

    async def delete\_document(self, document\_id):
        raise NotImplementedError
```

Implement:

```text
QdrantVectorStore
PgVectorStore
```

This lets you benchmark both.

\---

# 16\. Retrieval Engine

Create separate retrieval components.

```text
Retriever
 ├── VectorRetriever
 ├── KeywordRetriever
 ├── HybridRetriever
 └── MetadataRetriever
```

## Vector retrieval

```text
query
 ↓
embedding
 ↓
Qdrant
 ↓
top K
```

## Keyword retrieval

Use BM25 or PostgreSQL full-text search.

```text
query
 ↓
keyword search
 ↓
top K
```

## Hybrid retrieval

```text
                   Query
                  /     \\
                 /       \\
            Vector       BM25
              │            │
              ▼            ▼
           Top 20       Top 20
                 \\        /
                  \\      /
                   Fusion
                     ↓
                  Top 20
```

Use Reciprocal Rank Fusion (RRF) initially.

\---

# 17\. Reranking

Retrieval should return more candidates than the LLM needs.

Recommended:

```text
Qdrant/BM25
     ↓
20-50 candidates
     ↓
Reranker
     ↓
Top 3-8
     ↓
Context Builder
```

Create:

```python
class Reranker:
    async def rank(
        self,
        query: str,
        documents: list\[str]
    ):
        raise NotImplementedError
```

Do not rerank thousands of documents.

\---

# 18\. Context Builder

The context builder should:

1. Remove duplicate chunks
2. Respect maximum context size
3. Preserve source metadata
4. Group chunks from the same document when useful
5. Add citation IDs
6. Order chunks by relevance
7. Avoid injecting irrelevant text

Example internal representation:

```text
\[DOC-1 PAGE-12]
Refunds are allowed within 30 days...

\[DOC-4 PAGE-3]
Customers must provide the original receipt...
```

The LLM should be instructed to answer only from the supplied context when the chatbot is configured for grounded answers.

\---

# 19\. Prompt Strategy

System prompt should be configurable per chatbot.

Default behavior:

```text
You are a knowledge-grounded assistant.

Use the provided context to answer the user's question.

Rules:
1. Prefer information from the supplied context.
2. Do not invent facts.
3. If the context does not contain enough information, say so.
4. Cite the relevant sources.
5. Distinguish uncertainty from known information.
6. Follow the chatbot's configured behavior.
```

Never put untrusted retrieved content into a position where it can silently override your system instructions.

Treat retrieved documents as data, not instructions.

\---

# 20\. Exact Query Cache

Normalize the query first.

Example normalization:

```text
"What is the Refund Policy?"
        ↓
"what is the refund policy?"
```

Cache key should include:

```text
tenant\_id
chatbot\_id
config\_version
model
normalized\_query
relevant memory/context version
```

Conceptually:

```text
answer:
{tenant}:{bot}:{config}:{model}:{query\_hash}
```

If configuration changes, old cached answers should not be returned automatically.

\---

# 21\. Semantic Cache

Exact matching misses semantically equivalent questions.

Example:

```text
"What is the refund policy?"

"How can I get a refund?"

"Can I get my money back?"
```

Pipeline:

```text
New Query
 ↓
Query Embedding
 ↓
Semantic Cache Search
 ↓
Similarity
 ├── >= threshold → Cache HIT
 └── < threshold  → RAG pipeline
```

Do not start with an arbitrary threshold and declare victory.

Create an evaluation dataset and test:

```text
0.85
0.88
0.90
0.92
0.94
0.96
```

Measure:

* Cache hit rate
* False positive rate
* Answer correctness
* Latency reduction

Then select the threshold based on evidence.

\---

# 22\. Semantic Cache Safety

Do not return a cached answer merely because two questions look similar.

Cache matching should also consider:

* chatbot
* tenant
* configuration version
* permissions
* knowledge-base version
* language
* model
* retrieval configuration

A user asking:

```text
"What is my salary?"
```

must never receive another user's cached response.

This is a security requirement, not an optimization detail.

\---

# 23\. Conversation Memory

Do not send the entire conversation to the LLM forever.

Use:

```text
Recent messages
+
Conversation summary
+
Relevant retrieved context
```

Example:

```text
Conversation
 ├── Summary
 ├── Last 6 messages
 └── Current question
```

Memory should be configurable.

\---

# 24\. Chat Orchestrator

The orchestrator is the heart of the system.

Recommended flow:

```text
User Query
   │
   ▼
Authentication
   │
   ▼
Load Chatbot Config
   │
   ▼
Validate Permissions
   │
   ▼
Normalize Query
   │
   ▼
Exact Cache
   │
   ├── HIT → Return
   │
   ▼
Semantic Cache
   │
   ├── HIT → Return
   │
   ▼
Query Processing
   │
   ▼
Retrieve
   │
   ▼
Hybrid Fusion
   │
   ▼
Rerank
   │
   ▼
Context Builder
   │
   ▼
Conversation Memory
   │
   ▼
LLM
   │
   ▼
Response Validation
   │
   ▼
Persist Message
   │
   ▼
Populate Cache
   │
   ▼
Return Response + Citations
```

Keep this orchestration code readable.

Do not create a 900-line `chat\_service.py` because apparently software developers enjoy archaeology.

\---

# 25\. API Design

## Authentication

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
```

## Tenants

```text
GET  /api/v1/tenants
POST /api/v1/tenants
GET  /api/v1/tenants/{id}
```

## Chatbots

```text
GET  /api/v1/chatbots
POST /api/v1/chatbots
GET  /api/v1/chatbots/{id}
PATCH /api/v1/chatbots/{id}
DELETE /api/v1/chatbots/{id}
```

## Configurations

```text
GET  /api/v1/chatbots/{id}/configs
POST /api/v1/chatbots/{id}/configs
POST /api/v1/chatbots/{id}/configs/{version}/activate
```

## Knowledge bases

```text
GET  /api/v1/chatbots/{id}/knowledge-bases
POST /api/v1/chatbots/{id}/knowledge-bases
```

## Documents

```text
POST /api/v1/knowledge-bases/{id}/documents
GET  /api/v1/knowledge-bases/{id}/documents
GET  /api/v1/documents/{id}
DELETE /api/v1/documents/{id}
```

## Chat

```text
POST /api/v1/chatbots/{id}/chat
POST /api/v1/chatbots/{id}/stream
```

## Evaluation

```text
POST /api/v1/evaluations
GET  /api/v1/evaluations/{id}
GET  /api/v1/chatbots/{id}/evaluations
```

\---

# 26\. Streaming Responses

Use Server-Sent Events (SSE) initially.

Flow:

```text
Client
  ↓
POST /stream
  ↓
FastAPI
  ↓
RAG pipeline
  ↓
LLM streaming
  ↓
SSE
  ↓
Client
```

The client should see tokens as they arrive.

Do not expose internal chain-of-thought or hidden reasoning.

Return only the final generated response and useful metadata/citations.

\---

# 27\. Security Requirements

Implement:

## Authentication

Use secure authentication.

## Authorization

Every database and vector operation must verify:

```text
tenant\_id
chatbot\_id
user permissions
```

## API rate limiting

Use Redis.

Example:

```text
100 requests / minute / user
```

Make limits configurable.

## File validation

Validate:

* MIME type
* File size
* Extension
* Content
* Malware scanning in production

## Prompt injection defense

Treat retrieved content as untrusted data.

Do not allow a document to redefine:

* System instructions
* User permissions
* Tools
* API access
* Security policies

## Secret management

Never commit:

```text
OPENAI\_API\_KEY
VOYAGE\_API\_KEY
DATABASE\_PASSWORD
JWT\_SECRET
```

Use environment variables or a proper secrets manager.

\---

# 28\. Observability

Every chat request should record:

```text
request\_id
tenant\_id
chatbot\_id
conversation\_id
config\_version
cache\_status
retrieval\_strategy
retrieval\_count
reranker\_enabled
model
input\_tokens
output\_tokens
latency\_ms
```

Track latency stages:

```text
total
 ├── authentication
 ├── cache lookup
 ├── embedding
 ├── vector search
 ├── keyword search
 ├── reranking
 ├── prompt construction
 └── LLM generation
```

This allows you to discover where the system is actually slow instead of guessing.

\---

# 29\. Metrics Dashboard

Display:

## Performance

* Requests/minute
* Average latency
* P50 latency
* P95 latency
* P99 latency

## Cache

* Exact cache hit rate
* Semantic cache hit rate
* Embedding cache hit rate

## Retrieval

* Recall@K
* MRR
* NDCG
* Average retrieved documents

## Generation

* Token usage
* Cost/request
* Answer relevance
* Faithfulness

## Infrastructure

* CPU
* RAM
* GPU utilization
* Qdrant storage
* Redis memory
* Queue depth

\---

# 30\. RAG Evaluation Framework

Build a dataset:

```json
{
  "question": "What is the refund period?",
  "expected\_answer": "30 days",
  "expected\_sources": \[
    "refund-policy.pdf"
  ]
}
```

Evaluate:

## Retrieval

* Recall@1
* Recall@5
* Recall@10
* MRR
* NDCG

## Generation

* Faithfulness
* Answer relevance
* Context relevance
* Citation correctness

## System

* Latency
* Cost
* Cache hit rate

\---

# 31\. Configuration Benchmarking

One of the strongest features of this project should be automatic comparison.

Example:

```text
Configuration A
chunk = 400
top\_k = 5
reranker = false

Configuration B
chunk = 700
top\_k = 10
reranker = true

Configuration C
chunk = 1000
top\_k = 15
reranker = true
```

Run the same evaluation dataset.

Produce:

```text
                 A        B        C
Recall@5        82%      91%      89%
MRR             .77      .86      .84
Faithfulness    89%      95%      93%
Latency         650ms    980ms    1.4s
Cost            low      medium   high
```

Then recommend the best configuration according to a user-selected objective:

```text
Quality
Quality / Cost
Low Latency
Balanced
```

This can become the project's major differentiating feature.

\---

# 32\. Local Development Environment

Create Docker Compose services:

```text
postgres
redis
qdrant
api
embedding-service
worker
web
```

Optional:

```text
minio
prometheus
grafana
```

Local architecture:

```text
Docker Compose
│
├── PostgreSQL
├── Redis
├── Qdrant
├── Embedding Service
├── FastAPI
├── Worker
└── Next.js
```

\---

# 33\. Development Phases

## Phase 1 — Foundation

Build:

* Repository
* Docker Compose
* PostgreSQL
* Redis
* Qdrant
* FastAPI
* Environment configuration
* Logging
* Health checks

Verification:

```text
GET /health
```

must report all dependencies correctly.

\---

## Phase 2 — Database

Implement:

* Tenant
* User
* Chatbot
* Configuration
* KnowledgeBase
* Document
* Conversation
* Message

Add:

* SQLAlchemy models
* Alembic migrations
* Repository layer
* Tests

Verification:

* Migrations work from a clean database
* CRUD tests pass
* Tenant isolation tests pass

\---

## Phase 3 — Local Embedding Service

Implement:

* BGE-M3 loading
* CPU/GPU detection
* Batch inference
* `/v1/embed`
* `/v1/embed/batch`
* `/v1/model`
* `/health`

Verification:

* Model loads once
* Correct vector dimension
* Batch inference works
* CPU works
* GPU works when available

\---

## Phase 4 — Embedding Cache

Implement:

* SHA-256 text hashing
* Redis cache
* Model-aware cache keys
* Cache hit/miss metrics

Verification:

```text
First request → MISS
Second identical request → HIT
Different model → MISS
Different text → MISS
```

\---

## Phase 5 — Document Ingestion

Implement:

* File upload
* Storage
* Parsing
* Chunking
* Embeddings
* Qdrant insertion
* Background jobs

Verification:

```text
Upload PDF
 ↓
Job queued
 ↓
Chunks created
 ↓
Embeddings generated
 ↓
Qdrant points created
 ↓
Document READY
```

\---

## Phase 6 — Basic Retrieval

Implement:

* Query embedding
* Qdrant search
* Metadata filtering
* Source metadata
* Top-K configuration

Verification:

* Correct document is retrieved
* Tenant isolation works
* Chatbot isolation works

\---

## Phase 7 — Hybrid Retrieval

Implement:

* Vector search
* BM25
* RRF
* Configurable weights

Verification:

Compare:

```text
Vector only
BM25 only
Hybrid
```

using an evaluation dataset.

\---

## Phase 8 — Reranking

Implement:

* Reranker interface
* One local/external reranker
* Candidate top-K
* Final top-K

Verification:

Compare retrieval quality with and without reranking.

\---

## Phase 9 — LLM Generation

Implement:

* LLM provider interface
* System prompt
* Context construction
* Citation generation
* Response validation

Verification:

* Answers are grounded
* Sources are returned
* Unknown questions are handled safely
* Prompt injection tests pass

\---

## Phase 10 — Exact Cache

Implement:

* Query normalization
* Cache key generation
* Config-aware caching
* TTL
* Invalidation

Verification:

* Repeated question returns cached answer
* Config change bypasses old cache
* Different chatbot cannot access cache
* Different tenant cannot access cache

\---

## Phase 11 — Semantic Cache

Implement:

* Query embeddings
* Semantic similarity
* Threshold configuration
* Cache metadata
* Safety checks

Benchmark:

```text
0.85
0.88
0.90
0.92
0.94
0.96
```

Choose the threshold based on correctness.

\---

## Phase 12 — Conversation Memory

Implement:

* Message persistence
* Recent messages
* Conversation summaries
* Configurable memory limits

Verification:

* Follow-up questions work
* Context window remains bounded

\---

## Phase 13 — Multi-Tenancy

Implement strict tenant isolation.

Test:

```text
Tenant A → cannot access Tenant B
Bot A → cannot access Bot B
User A → cannot access User B's private conversation
```

This phase should include automated security tests.

\---

## Phase 14 — Evaluation

Implement:

* Dataset management
* Retrieval metrics
* Generation metrics
* Latency metrics
* Cost metrics
* Benchmark runs

Build a dashboard.

\---

## Phase 15 — Configuration Versioning

Implement:

```text
v1
v2
v3
```

Allow:

* Create version
* Compare versions
* Activate version
* Roll back version

Cache keys must include the active config version.

\---

## Phase 16 — Frontend

Build:

### Dashboard

Show:

* Chatbots
* Requests
* Latency
* Cache hit rate
* Knowledge bases

### Chatbot Builder

Allow:

* Name
* Prompt
* Model
* Embedding provider
* Chunking
* Retrieval
* Reranking
* Cache

### Knowledge Base

Allow:

* Upload
* Delete
* Processing status
* Search
* Document metadata

### Chat UI

Show:

* Answer
* Citations
* Source documents
* Conversation history

### Evaluation

Show:

* Retrieval metrics
* Generation metrics
* Configuration comparison

\---

# 34\. Testing Strategy

Use several layers.

## Unit tests

Test:

* Chunkers
* Cache keys
* Configuration validation
* Retrieval fusion
* RRF
* Prompt construction
* Permission checks

## Integration tests

Test:

```text
API
 ↓
PostgreSQL
 ↓
Redis
 ↓
Qdrant
```

## RAG tests

Use fixed datasets.

Test:

* Retrieval accuracy
* Citation correctness
* Hallucination behavior

## Security tests

Test:

* Tenant isolation
* Cache isolation
* Prompt injection
* Unauthorized document access
* File upload validation

## Load tests

Use tools such as:

* Locust
* k6

Measure:

* Requests/sec
* P95 latency
* Cache behavior
* Queue throughput

\---

# 35\. Scalability Strategy

Start:

```text
1 API
1 worker
1 embedding service
1 Qdrant
1 Redis
1 PostgreSQL
```

Scale to:

```text
                 Load Balancer
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
            API       API       API
             │
      ┌──────┼─────────────┐
      ▼      ▼             ▼
   Worker  Worker       Worker
             │
             ▼
       Embedding Pool
```

Qdrant and PostgreSQL should be treated as shared stateful services.

Redis should be configured appropriately for the deployment model.

\---

# 36\. Performance Optimization Order

Do not optimize everything simultaneously.

Use this order:

1. Measure baseline
2. Exact cache
3. Batch embeddings
4. Embedding cache
5. Connection pooling
6. Async I/O
7. Retrieval optimization
8. Reranker optimization
9. Semantic cache
10. Horizontal scaling

Always benchmark before and after.

\---

# 37\. Important Cache Invalidation Rules

Invalidate or version cache when:

* Chatbot config changes
* Embedding model changes
* Knowledge base changes
* Relevant documents are deleted
* Retrieval strategy changes
* System prompt changes
* LLM model changes
* User permissions change

Prefer versioned cache keys over trying to delete every related key manually.

Example:

```text
bot\_config\_version = 7

cache key:
answer:bot123:v7:query\_hash
```

Changing to version 8 naturally makes old entries unreachable.

\---

# 38\. Failure Handling

The system must handle:

## Qdrant unavailable

Return controlled error.

Do not silently generate an ungrounded answer if grounding is required.

## Embedding service unavailable

Queue/retry ingestion jobs.

For chat, return a controlled failure or configured fallback.

## LLM unavailable

Retry with exponential backoff where appropriate.

## Redis unavailable

The core RAG system should still be able to operate without cache if the product's availability requirements permit it.

Caching should accelerate the system, not become its single point of failure.

## Worker failure

Jobs must be retryable.

Store:

```text
attempt\_count
last\_error
status
```

\---

# 39\. Retry Strategy

Use exponential backoff:

```text
1s
2s
4s
8s
16s
```

Set a maximum number of retries.

Do not retry permanent errors indefinitely.

\---

# 40\. Idempotency

Document ingestion must be idempotent.

If a worker crashes after embedding but before updating PostgreSQL, retrying should not create uncontrolled duplicates.

Use:

* document checksum
* chunk IDs
* deterministic point IDs
* job IDs

\---

# 41\. Recommended Initial Defaults

Start with:

```text
Embedding:
BAAI/bge-m3

Chunking:
recursive

Chunk size:
\~700 tokens/appropriate units after benchmarking

Overlap:
\~100

Retrieval:
hybrid

Vector candidates:
20

Reranker:
enabled

Final context:
3-8 chunks

Temperature:
0.1-0.2

Exact cache:
enabled

Semantic cache:
enabled after evaluation

Embedding cache:
enabled

Memory:
last 6-10 messages
```

These are starting points, not sacred numbers.

\---

# 42\. What NOT to Do

Do not:

* Put all logic in one FastAPI route
* Hard-code one embedding provider
* Hard-code one LLM
* Mix vectors from different embedding models
* Store every vector in PostgreSQL unnecessarily
* Send the full conversation forever
* Retrieve 100 documents and dump them into the LLM
* Cache responses without tenant/chatbot/config isolation
* Trust retrieved text as instructions
* Process large documents synchronously inside HTTP requests
* Introduce Kafka before you have a queue problem
* Introduce Kubernetes before you have a deployment/scaling problem
* Claim semantic caching works without measuring false positives
* Optimize latency without measuring P95/P99
* Use LangChain as the architecture itself

Frameworks can be useful, but your architecture should remain understandable without them.

\---

# 43\. Recommended Development Order

The shortest path to a working system is:

```text
1. Docker infrastructure
2. PostgreSQL schema
3. Qdrant integration
4. Local BGE-M3 service
5. Document ingestion
6. Vector retrieval
7. LLM generation
8. Basic chat
9. Exact cache
10. Hybrid retrieval
11. Reranking
12. Semantic cache
13. Conversation memory
14. Multi-tenancy
15. Evaluation
16. Configuration versioning
17. Dashboard
18. Load testing
19. Horizontal scaling
```

Do not start by building the dashboard.

The dashboard cannot save a terrible retrieval pipeline. It can only give the terrible retrieval pipeline rounded rectangles.

\---

# 44\. Minimum Viable Version

The first working release should contain:

```text
FastAPI
PostgreSQL
Qdrant
Redis
BGE-M3
One LLM provider
PDF/TXT ingestion
Recursive chunking
Vector retrieval
Basic citations
Exact query cache
Docker Compose
```

A user should be able to:

```text
Create chatbot
     ↓
Create knowledge base
     ↓
Upload PDF
     ↓
Wait for processing
     ↓
Ask question
     ↓
Retrieve relevant chunks
     ↓
Generate grounded answer
     ↓
See citations
```

Only after this works should you add semantic cache, hybrid retrieval, reranking, evaluation, and optimization.

\---

# 45\. Strong Final Version

The mature platform should look like:

```text
                         ContextForge
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   Chatbot Builder      Knowledge Manager       Evaluation
        │                     │                     │
        ▼                     ▼                     ▼
 Configuration          Document Pipeline       Benchmarks
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                       RAG Orchestrator
                              │
             ┌────────────────┼────────────────┐
             │                │                │
          Redis            Qdrant          PostgreSQL
          Cache            Vectors          Metadata
             │                │
             │         ┌──────┴──────┐
             │         │             │
             │       Vector         BM25
             │         │             │
             │         └──────┬──────┘
             │                │
             │             Hybrid
             │                │
             │             Rerank
             │                │
             └───────────────►│
                              ▼
                         Context Builder
                              │
                              ▼
                       LLM Provider Layer
                              │
                              ▼
                        Grounded Answer
                              │
                              ▼
                       Citations + Cache
```

\---

# 46\. Project Differentiator

Do not market the project simply as:

> "A RAG chatbot."

The stronger positioning is:

> \*\*A configurable, multi-tenant RAG infrastructure platform with pluggable embedding/LLM providers, hybrid retrieval, multi-level caching, asynchronous ingestion, RAG evaluation, and configuration optimization.\*\*

The technically interesting parts are:

1. Provider abstraction
2. Local embedding inference
3. Embedding caching
4. Exact query caching
5. Semantic caching
6. Hybrid retrieval
7. Reranking
8. Configuration versioning
9. Automated RAG evaluation
10. Multi-tenant isolation
11. Async ingestion
12. Performance benchmarking

\---

# 47\. Research/Benchmark Opportunities

If this becomes a research project rather than only a portfolio project, investigate:

## Cache performance

Compare:

```text
No cache
Exact cache
Semantic cache
Hybrid cache
```

Measure:

* Latency
* Cost
* Hit rate
* Accuracy

## Retrieval

Compare:

```text
Vector
BM25
Hybrid
Hybrid + Reranker
```

Measure:

* Recall@K
* MRR
* NDCG
* Answer quality

## Embeddings

Compare:

```text
BGE-M3
Voyage AI
Other local models
```

Measure:

* Retrieval quality
* Embedding latency
* Memory
* Cost
* Multilingual performance

## Chunking

Compare:

```text
300
500
700
1000
```

Measure retrieval and generation quality.

## System optimization

Study:

```text
Quality vs Latency vs Cost
```

This gives you a legitimate experimental component rather than simply building another chatbot.

\---

# 48\. Definition of Done

The project is considered production-oriented when:

* \[ ] Multiple tenants can exist
* \[ ] Multiple chatbots can exist per tenant
* \[ ] Each chatbot has independent configuration
* \[ ] Configuration versions are immutable
* \[ ] Documents process asynchronously
* \[ ] Duplicate documents are detected
* \[ ] Local embeddings work
* \[ ] External embedding providers can be plugged in
* \[ ] Qdrant stores vectors
* \[ ] Metadata filtering works
* \[ ] Hybrid retrieval works
* \[ ] Reranking works
* \[ ] Grounded answers include citations
* \[ ] Exact cache works
* \[ ] Semantic cache works
* \[ ] Embedding cache works
* \[ ] Cache isolation is enforced
* \[ ] Conversation memory works
* \[ ] Rate limiting works
* \[ ] Authentication and authorization work
* \[ ] Prompt injection defenses are tested
* \[ ] Evaluation datasets can be executed
* \[ ] Retrieval metrics are calculated
* \[ ] Generation metrics are calculated
* \[ ] Latency is measured
* \[ ] Docker deployment works
* \[ ] Automated tests pass
* \[ ] Load testing has been performed
* \[ ] Logs and metrics are available
* \[ ] Failure/retry behavior is tested

\---

# 49\. First Implementation Milestone

Do not attempt the complete platform in one pass.

The first milestone should be:

```text
FastAPI
   │
   ├── PostgreSQL
   │
   ├── Redis
   │
   ├── Qdrant
   │
   └── Local Embedding Service
             │
             └── BGE-M3

Upload PDF
    ↓
Chunk
    ↓
Embed
    ↓
Qdrant
    ↓
User Query
    ↓
Embed
    ↓
Qdrant Search
    ↓
LLM
    ↓
Answer + Citation
```

Once this vertical slice works end-to-end, expand the system one capability at a time.

\---

# 50\. Guiding Architecture Principle

The most important rule for the entire implementation is:

```text
                     Interfaces
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
     Embeddings       Retrieval         LLM
          │              │              │
     ┌────┴────┐     ┌───┴────┐    ┌───┴────┐
     │         │     │        │    │        │
   Local     API   Qdrant   BM25  Provider  Provider
```

The business logic should depend on interfaces.

The infrastructure should implement those interfaces.

This gives the platform the ability to change:

* Embedding model
* Vector database
* Retrieval strategy
* Reranker
* LLM
* Cache implementation

without rewriting the chatbot.

That is the foundation that turns the project from a demonstration into a genuinely reusable RAG platform.

