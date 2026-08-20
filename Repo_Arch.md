rag-chatbot-platform/
│
├── apps/
│   ├── api/                    # FastAPI backend
│   ├── web/                    # Next.js frontend
│   └── embedding-service/      # Local embedding service
│
├── services/
│   ├── ingestion-worker/       # Document processing
│   ├── evaluation-worker/      # RAG evaluation
│   └── scheduler/              # Scheduled jobs
│
├── packages/
│   ├── rag-core/               # Retrieval/orchestration logic
│   ├── providers/              # LLM/embedding/reranker adapters
│   ├── cache/                  # Redis caching abstraction
│   ├── vector-store/           # Qdrant abstraction
│   └── common/                 # Shared utilities/types
│
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   ├── terraform/
│   └── monitoring/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── deployment/
│   └── decisions/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── evaluation/
│
├── scripts/
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docker-compose.yml
├── Makefile
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
└── .gitignore