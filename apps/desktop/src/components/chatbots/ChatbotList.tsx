import { useState } from "react";
import { cn } from "@/lib/utils";
import { mockChatbots, mockKnowledgeBases } from "@/mock/data";
import type { Chatbot } from "@/types";
import {
  Plus,
  Search,
  Settings,
  MoreHorizontal,
  Bot,
  Database,
  MessageSquare,
  Clock,
  ChevronRight,
  X,
  Save,
  ArrowLeft,
} from "lucide-react";

export function ChatbotList() {
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChatbots = mockChatbots.filter(
    (cb) =>
      cb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cb.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedChatbot) {
    return (
      <ChatbotBuilder
        chatbot={selectedChatbot}
        onBack={() => setSelectedChatbot(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-14 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-3">
          <Bot size={18} className="text-[hsl(var(--muted-foreground))]" />
          <h1 className="text-sm font-semibold text-[hsl(var(--foreground))]">
            Chatbots
          </h1>
          <span className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-0.5 rounded-full">
            {mockChatbots.length}
          </span>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity">
          <Plus size={14} />
          <span>Create Chatbot</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-[hsl(var(--border))]">
          <Search size={14} className="text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chatbots..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
      </div>

      {/* Chatbot Cards Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredChatbots.map((chatbot, idx) => (
            <div
              key={chatbot.id}
              className={cn(
                "group p-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:shadow-md transition-all cursor-pointer animate-slide-up",
                `stagger-${idx + 1}`
              )}
              onClick={() => setSelectedChatbot(chatbot)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[hsl(var(--muted))] text-xl">
                    {chatbot.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">
                      {chatbot.name}
                    </h3>
                    <StatusBadge status={chatbot.status} />
                  </div>
                </div>
                <button
                  className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-[hsl(var(--accent))] transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal size={14} className="text-[hsl(var(--muted-foreground))]" />
                </button>
              </div>

              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4 line-clamp-2">
                {chatbot.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
                <span className="flex items-center gap-1">
                  <Database size={12} /> {chatbot.knowledgeBaseIds.length} KBs
                </span>
                <span className="flex items-center gap-1">
                  <Settings size={12} /> v{chatbot.configVersion}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} /> {chatbot.config.llmModel}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[hsl(var(--border))]">
                <span className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                  <Clock size={11} />
                  Updated {new Date(chatbot.updatedAt).toLocaleDateString()}
                </span>
                <ChevronRight
                  size={14}
                  className="text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}

          {/* Create New Card */}
          <div className="flex flex-col items-center justify-center p-5 rounded-lg border-2 border-dashed border-[hsl(var(--border))] hover:border-[hsl(var(--muted-foreground))] cursor-pointer transition-colors min-h-[200px]">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--muted))] flex items-center justify-center mb-3">
              <Plus size={20} className="text-[hsl(var(--muted-foreground))]" />
            </div>
            <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
              Create New Chatbot
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Chatbot["status"] }) {
  const styles = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    draft: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    archived: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium", styles[status])}>
      {status}
    </span>
  );
}

// ===== Chatbot Builder =====
function ChatbotBuilder({ chatbot, onBack }: { chatbot: Chatbot; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General" },
    { id: "knowledge", label: "Knowledge Bases" },
    { id: "prompt", label: "System Prompt" },
    { id: "llm", label: "LLM" },
    { id: "embedding", label: "Embedding" },
    { id: "retrieval", label: "Retrieval" },
    { id: "cache", label: "Cache" },
    { id: "memory", label: "Memory" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-14 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-md hover:bg-[hsl(var(--accent))] transition-colors"
          >
            <ArrowLeft size={16} className="text-[hsl(var(--muted-foreground))]" />
          </button>
          <span className="text-lg">{chatbot.avatar}</span>
          <div>
            <h1 className="text-sm font-semibold text-[hsl(var(--foreground))]">
              {chatbot.name}
            </h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Configuration v{chatbot.configVersion}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors text-[hsl(var(--foreground))]">
            <X size={14} />
            Discard
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity">
            <Save size={14} />
            Save Configuration
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Vertical Tabs */}
        <div className="w-48 border-r border-[hsl(var(--border))] py-3 px-2 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors mb-0.5",
                activeTab === tab.id
                  ? "bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] font-medium"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Config Panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "general" && <GeneralConfig chatbot={chatbot} />}
          {activeTab === "knowledge" && <KnowledgeConfig chatbot={chatbot} />}
          {activeTab === "prompt" && <PromptConfig chatbot={chatbot} />}
          {activeTab === "llm" && <LLMConfig chatbot={chatbot} />}
          {activeTab === "embedding" && <EmbeddingConfig chatbot={chatbot} />}
          {activeTab === "retrieval" && <RetrievalConfig chatbot={chatbot} />}
          {activeTab === "cache" && <CacheConfig chatbot={chatbot} />}
          {activeTab === "memory" && <MemoryConfig chatbot={chatbot} />}
        </div>
      </div>
    </div>
  );
}

// ===== Config Sections =====
function ConfigSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">{title}</h2>
        {description && (
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FormField({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[hsl(var(--foreground))]">{label}</label>
      {description && <p className="text-xs text-[hsl(var(--muted-foreground))]">{description}</p>}
      {children}
    </div>
  );
}

function TextInput({ value, placeholder }: { value: string; placeholder?: string }) {
  return (
    <input
      type="text"
      defaultValue={value}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none focus:ring-1 focus:ring-[hsl(var(--ring))] placeholder:text-[hsl(var(--muted-foreground))]"
    />
  );
}

function SelectInput({ value, options }: { value: string; options: string[] }) {
  return (
    <select
      defaultValue={value}
      className="w-full px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

function SliderInput({ value, min, max, step, unit }: { value: number; min: number; max: number; step: number; unit?: string }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        defaultValue={value}
        min={min}
        max={max}
        step={step}
        className="flex-1 h-1.5 rounded-full appearance-none bg-[hsl(var(--muted))] accent-[hsl(var(--primary))]"
      />
      <span className="text-sm font-mono text-[hsl(var(--muted-foreground))] w-16 text-right">
        {value}{unit || ""}
      </span>
    </div>
  );
}

function ToggleSwitch({ enabled, label }: { enabled: boolean; label: string }) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <span className="text-sm text-[hsl(var(--foreground))]">{label}</span>
      <div className={cn(
        "relative w-9 h-5 rounded-full transition-colors",
        enabled ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--muted))]"
      )}>
        <div className={cn(
          "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
          enabled ? "left-[18px]" : "left-0.5"
        )} />
      </div>
    </label>
  );
}

function GeneralConfig({ chatbot }: { chatbot: Chatbot }) {
  return (
    <ConfigSection title="General" description="Basic chatbot information">
      <FormField label="Name">
        <TextInput value={chatbot.name} />
      </FormField>
      <FormField label="Description">
        <textarea
          defaultValue={chatbot.description}
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none focus:ring-1 focus:ring-[hsl(var(--ring))] resize-none"
        />
      </FormField>
      <FormField label="Avatar">
        <div className="flex gap-2">
          {["🤖", "🔬", "📚", "💡", "🎯", "🧠", "⚡", "🌐"].map((emoji) => (
            <button
              key={emoji}
              className={cn(
                "w-10 h-10 rounded-lg border text-xl flex items-center justify-center transition-colors",
                chatbot.avatar === emoji
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--accent))]"
                  : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]"
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </FormField>
    </ConfigSection>
  );
}

function KnowledgeConfig({ chatbot }: { chatbot: Chatbot }) {
  return (
    <ConfigSection title="Knowledge Bases" description="Select knowledge bases for this chatbot to use as context">
      <div className="space-y-2">
        {mockKnowledgeBases.map((kb) => (
          <label
            key={kb.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
              chatbot.knowledgeBaseIds.includes(kb.id)
                ? "border-[hsl(var(--primary))] bg-[hsl(var(--accent))]"
                : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]"
            )}
          >
            <input
              type="checkbox"
              defaultChecked={chatbot.knowledgeBaseIds.includes(kb.id)}
              className="rounded border-[hsl(var(--border))]"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-[hsl(var(--foreground))]">{kb.name}</span>
              <span className="text-xs text-[hsl(var(--muted-foreground))] block">
                {kb.documentCount} docs · {kb.totalChunks} chunks
              </span>
            </div>
            <StatusBadge status={kb.status === "ready" ? "active" : kb.status === "processing" ? "draft" : "archived"} />
          </label>
        ))}
      </div>
    </ConfigSection>
  );
}

function PromptConfig({ chatbot }: { chatbot: Chatbot }) {
  return (
    <ConfigSection title="System Prompt" description="Instructions that define the chatbot's behavior and personality">
      <textarea
        defaultValue={chatbot.config.systemPrompt}
        rows={10}
        className="w-full px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none focus:ring-1 focus:ring-[hsl(var(--ring))] resize-none font-mono"
      />
      <p className="text-xs text-[hsl(var(--muted-foreground))]">
        Available variables: {"{{context}}"}, {"{{user_name}}"}, {"{{chatbot_name}}"}
      </p>
    </ConfigSection>
  );
}

function LLMConfig({ chatbot }: { chatbot: Chatbot }) {
  return (
    <ConfigSection title="LLM Configuration" description="Configure the language model for response generation">
      <FormField label="Provider">
        <SelectInput value={chatbot.config.llmProvider} options={["openai", "anthropic", "gemini", "ollama"]} />
      </FormField>
      <FormField label="Model">
        <SelectInput value={chatbot.config.llmModel} options={["gpt-4o", "gpt-4o-mini", "claude-sonnet-4-20250514", "gemini-2.5-pro", "llama3.1:8b"]} />
      </FormField>
      <FormField label="Temperature" description="Controls randomness (0 = deterministic, 1 = creative)">
        <SliderInput value={chatbot.config.temperature} min={0} max={1} step={0.1} />
      </FormField>
      <FormField label="Max Tokens">
        <SliderInput value={chatbot.config.maxTokens} min={256} max={4096} step={256} />
      </FormField>
      <FormField label="Top P">
        <SliderInput value={chatbot.config.topP} min={0} max={1} step={0.05} />
      </FormField>
    </ConfigSection>
  );
}

function EmbeddingConfig({ chatbot }: { chatbot: Chatbot }) {
  return (
    <ConfigSection title="Embedding Configuration" description="Configure the embedding model for document and query encoding">
      <FormField label="Provider">
        <SelectInput value={chatbot.config.embeddingProvider} options={["local", "voyage"]} />
      </FormField>
      <FormField label="Model">
        <SelectInput value={chatbot.config.embeddingModel} options={["bge-m3", "voyage-3"]} />
      </FormField>
    </ConfigSection>
  );
}

function RetrievalConfig({ chatbot }: { chatbot: Chatbot }) {
  return (
    <ConfigSection title="Retrieval Strategy" description="Configure how documents are retrieved for context">
      <FormField label="Strategy">
        <SelectInput value={chatbot.config.retrievalStrategy} options={["vector", "keyword", "hybrid"]} />
      </FormField>
      <FormField label="Top K" description="Number of chunks to retrieve">
        <SliderInput value={chatbot.config.topK} min={1} max={30} step={1} />
      </FormField>
      <FormField label="RRF Weight" description="Weight for Reciprocal Rank Fusion (hybrid only)">
        <SliderInput value={chatbot.config.rrfWeight} min={0} max={1} step={0.1} />
      </FormField>
      <div className="border-t border-[hsl(var(--border))] pt-4 mt-4">
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">Reranking</h3>
        <ToggleSwitch enabled={chatbot.config.rerankingEnabled} label="Enable reranking" />
        {chatbot.config.rerankingEnabled && (
          <div className="space-y-4 mt-3">
            <FormField label="Provider">
              <SelectInput value={chatbot.config.rerankingProvider} options={["local", "voyage", "cohere"]} />
            </FormField>
            <FormField label="Top N" description="Number of chunks after reranking">
              <SliderInput value={chatbot.config.rerankingTopN} min={1} max={20} step={1} />
            </FormField>
          </div>
        )}
      </div>
    </ConfigSection>
  );
}

function CacheConfig({ chatbot }: { chatbot: Chatbot }) {
  return (
    <ConfigSection title="Cache Configuration" description="Configure multi-level caching for response performance">
      <div className="space-y-5">
        <div className="p-4 rounded-lg border border-[hsl(var(--border))]">
          <ToggleSwitch enabled={chatbot.config.exactCacheEnabled} label="Exact Response Cache" />
          <FormField label="TTL (seconds)">
            <SliderInput value={chatbot.config.exactCacheTTL} min={60} max={86400} step={60} unit="s" />
          </FormField>
        </div>
        <div className="p-4 rounded-lg border border-[hsl(var(--border))]">
          <ToggleSwitch enabled={chatbot.config.semanticCacheEnabled} label="Semantic Cache" />
          <FormField label="TTL (seconds)">
            <SliderInput value={chatbot.config.semanticCacheTTL} min={60} max={86400} step={60} unit="s" />
          </FormField>
          <FormField label="Similarity Threshold">
            <SliderInput value={chatbot.config.semanticCacheThreshold} min={0.8} max={1} step={0.01} />
          </FormField>
        </div>
        <div className="p-4 rounded-lg border border-[hsl(var(--border))]">
          <ToggleSwitch enabled={chatbot.config.embeddingCacheEnabled} label="Embedding Cache" />
          <FormField label="TTL (seconds)">
            <SliderInput value={chatbot.config.embeddingCacheTTL} min={60} max={604800} step={3600} unit="s" />
          </FormField>
        </div>
      </div>
    </ConfigSection>
  );
}

function MemoryConfig({ chatbot }: { chatbot: Chatbot }) {
  return (
    <ConfigSection title="Conversation Memory" description="Configure how conversation context is managed">
      <FormField label="Memory Strategy">
        <SelectInput value={chatbot.config.memoryStrategy} options={["none", "short-term", "summarized", "long-term"]} />
      </FormField>
      {chatbot.config.memoryStrategy !== "none" && (
        <FormField label="Window Size" description="Number of recent messages to include">
          <SliderInput value={chatbot.config.memoryWindowSize} min={1} max={50} step={1} />
        </FormField>
      )}
    </ConfigSection>
  );
}
