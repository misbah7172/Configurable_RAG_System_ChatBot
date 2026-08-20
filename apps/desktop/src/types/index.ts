// ===== Chatbot Types =====
export interface Chatbot {
  id: string;
  name: string;
  description: string;
  avatar: string;
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
  configVersion: number;
  knowledgeBaseIds: string[];
  config: ChatbotConfig;
}

export interface ChatbotConfig {
  systemPrompt: string;
  llmProvider: string;
  llmModel: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  embeddingProvider: string;
  embeddingModel: string;
  retrievalStrategy: "vector" | "keyword" | "hybrid";
  topK: number;
  rrfWeight: number;
  rerankingEnabled: boolean;
  rerankingProvider: string;
  rerankingTopN: number;
  exactCacheEnabled: boolean;
  exactCacheTTL: number;
  semanticCacheEnabled: boolean;
  semanticCacheTTL: number;
  semanticCacheThreshold: number;
  embeddingCacheEnabled: boolean;
  embeddingCacheTTL: number;
  memoryStrategy: "none" | "short-term" | "summarized" | "long-term";
  memoryWindowSize: number;
}

// ===== Conversation Types =====
export interface Conversation {
  id: string;
  chatbotId: string;
  title: string;
  lastMessage: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  metadata?: MessageMetadata;
  createdAt: string;
}

export interface Citation {
  id: string;
  documentName: string;
  chunkText: string;
  page?: number;
  relevanceScore: number;
  source: string;
}

export interface MessageMetadata {
  tokensUsed: number;
  latencyMs: number;
  cacheHit: boolean;
  cacheType?: "exact" | "semantic";
  chunksRetrieved: number;
  model: string;
}

// ===== Knowledge Base Types =====
export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  totalChunks: number;
  status: "ready" | "processing" | "error";
  createdAt: string;
  updatedAt: string;
  chunkingStrategy: string;
  chunkSize: number;
  chunkOverlap: number;
}

export interface Document {
  id: string;
  knowledgeBaseId: string;
  name: string;
  type: "pdf" | "docx" | "txt" | "md" | "html" | "csv";
  size: number;
  status: "uploaded" | "queued" | "processing" | "ready" | "failed";
  chunks: number;
  uploadedAt: string;
  processedAt?: string;
  error?: string;
}

// ===== Evaluation Types =====
export interface EvaluationDataset {
  id: string;
  name: string;
  questionCount: number;
  createdAt: string;
}

export interface EvaluationRun {
  id: string;
  datasetId: string;
  datasetName: string;
  chatbotId: string;
  chatbotName: string;
  configVersion: number;
  status: "pending" | "running" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
  metrics?: EvaluationMetrics;
}

export interface EvaluationMetrics {
  recall1: number;
  recall5: number;
  recall10: number;
  mrr: number;
  ndcg: number;
  faithfulness: number;
  answerRelevance: number;
  contextRelevance: number;
  citationCorrectness: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  totalTokens: number;
  estimatedCost: number;
  cacheHitRate: number;
}

// ===== Analytics Types =====
export interface AnalyticsData {
  totalRequests: number;
  requestsTrend: number;
  errorRate: number;
  errorTrend: number;
  avgLatency: number;
  latencyTrend: number;
  cacheHitRate: number;
  cacheTrend: number;
  estimatedCost: number;
  costTrend: number;
  requestsOverTime: TimeSeriesPoint[];
  latencyBreakdown: LatencyBreakdown[];
  cachePerformance: TimeSeriesPoint[];
  tokenUsage: TokenUsagePoint[];
  errorDistribution: ErrorDistribution[];
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface LatencyBreakdown {
  date: string;
  embedding: number;
  retrieval: number;
  reranking: number;
  llm: number;
}

export interface TokenUsagePoint {
  date: string;
  input: number;
  output: number;
}

export interface ErrorDistribution {
  type: string;
  count: number;
  percentage: number;
}

// ===== Settings Types =====
export interface AppSettings {
  theme: "light" | "dark" | "system";
  backendUrl: string;
  connectionStatus: "connected" | "disconnected" | "checking";
  providers: ProviderConfig[];
}

export interface ProviderConfig {
  id: string;
  name: string;
  type: "llm" | "embedding" | "reranking";
  provider: string;
  apiKey: string;
  baseUrl?: string;
  enabled: boolean;
}

// ===== Navigation =====
export type NavSection =
  | "chat"
  | "chatbots"
  | "knowledge"
  | "evaluation"
  | "analytics"
  | "settings";
