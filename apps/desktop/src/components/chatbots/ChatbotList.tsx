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
  Sliders,
  Cpu,
  Layers,
  Sparkles,
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
    <div className="flex flex-col h-full overflow-y-auto bg-background p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">
            Chatbot Builder & Fleet
          </h1>
          <p className="text-xs lg:text-sm text-muted-foreground mt-1">
            Configure prompt templates, retrieval algorithms, LLMs, and multi-level caching
          </p>
        </div>
        <button
          onClick={() => setSelectedChatbot(mockChatbots[0])}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Create New Chatbot</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search chatbots by name or role..."
          className="w-full pl-9 pr-4 py-2 text-xs lg:text-sm rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
        />
      </div>

      {/* Chatbots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredChatbots.map((cb) => (
          <div
            key={cb.id}
            onClick={() => setSelectedChatbot(cb)}
            className="group p-5 rounded-2xl border border-border bg-card hover:border-border/80 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-muted text-2xl shrink-0">
                    {cb.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {cb.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Config v{cb.configVersion}</p>
                  </div>
                </div>
                <ChatbotStatusBadge status={cb.status} />
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                {cb.description}
              </p>

              {/* Badges and summary specs */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                  {cb.config.llmModel}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase">
                  {cb.config.retrievalStrategy}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                  Top-K: {cb.config.topK}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Database size={13} />
                {cb.knowledgeBaseIds.length} Knowledge Bases
              </span>
              <span className="flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Configure <ChevronRight size={13} />
              </span>
            </div>
          </div>
        ))}

        {/* Create Card */}
        <div
          onClick={() => setSelectedChatbot(mockChatbots[0])}
          className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 cursor-pointer transition-all min-h-[200px] text-center"
        >
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3 text-muted-foreground">
            <Plus size={20} />
          </div>
          <span className="text-xs lg:text-sm font-semibold text-foreground">
            Create Custom Chatbot
          </span>
          <span className="text-[11px] text-muted-foreground mt-1 max-w-[200px]">
            Set up system prompt, LLM temperature, grounding, and memory
          </span>
        </div>
      </div>
    </div>
  );
}

function ChatbotStatusBadge({ status }: { status: Chatbot["status"] }) {
  const config = {
    active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200/50",
    draft: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200/50",
    archived: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium border capitalize", config[status])}>
      {status}
    </span>
  );
}

// ===== Full-screen Chatbot Builder =====
function ChatbotBuilder({ chatbot, onBack }: { chatbot: Chatbot; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General Information" },
    { id: "knowledge", label: "Grounding & Knowledge Bases" },
    { id: "prompt", label: "System Instructions" },
    { id: "llm", label: "LLM Model & Hyperparameters" },
    { id: "embedding", label: "Embedding Provider" },
    { id: "retrieval", label: "Retrieval & Reranking" },
    { id: "cache", label: "Multi-Level Caching" },
    { id: "memory", label: "Conversation Memory" },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Builder Top Bar */}
      <div className="h-14 px-6 border-b border-border bg-card flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">{chatbot.avatar}</span>
            <div>
              <h1 className="text-sm font-bold text-foreground">{chatbot.name}</h1>
              <p className="text-[10px] text-muted-foreground">Editing Configuration v{chatbot.configVersion}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors"
          >
            Discard
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-2xs"
          >
            <Save size={13} />
            <span>Save & Publish v{chatbot.configVersion + 1}</span>
          </button>
        </div>
      </div>

      {/* Builder Main Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Vertical Tabs */}
        <div className="w-60 border-r border-border bg-sidebar/50 p-3 space-y-1 overflow-y-auto shrink-0">
          <div className="px-2 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Configuration Steps
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center w-full px-3 py-2 text-xs rounded-xl text-left transition-colors font-medium",
                activeTab === tab.id
                  ? "bg-card border border-border text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
              )}
            >
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Form Editor Panel */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-2xl space-y-6">
            {activeTab === "general" && (
              <div className="space-y-4 animate-fade-in text-xs">
                <h3 className="text-sm font-bold text-foreground">General Metadata</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block font-medium text-foreground mb-1">Chatbot Name</label>
                    <input type="text" defaultValue={chatbot.name} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground outline-none" />
                  </div>
                  <div>
                    <label className="block font-medium text-foreground mb-1">Description</label>
                    <textarea defaultValue={chatbot.description} rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground outline-none resize-none" />
                  </div>
                  <div>
                    <label className="block font-medium text-foreground mb-1.5">Avatar Emoji</label>
                    <div className="flex gap-2">
                      {["🤖", "🔬", "📚", "💡", "🎯", "🧠", "⚡"].map((emoji) => (
                        <button
                          key={emoji}
                          className={cn(
                            "w-9 h-9 rounded-lg border flex items-center justify-center text-lg transition-all",
                            chatbot.avatar === emoji
                              ? "border-primary bg-primary/10 shadow-2xs"
                              : "border-border hover:bg-muted"
                          )}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "knowledge" && (
              <div className="space-y-4 animate-fade-in text-xs">
                <h3 className="text-sm font-bold text-foreground">Grounding Knowledge Bases</h3>
                <p className="text-muted-foreground text-[11px]">Select which document collections this bot can retrieve from</p>
                <div className="space-y-2">
                  {mockKnowledgeBases.map((kb) => (
                    <label
                      key={kb.id}
                      className={cn(
                        "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all",
                        chatbot.knowledgeBaseIds.includes(kb.id)
                          ? "border-primary bg-primary/5 shadow-2xs"
                          : "border-border hover:bg-muted/40"
                      )}
                    >
                      <input
                        type="checkbox"
                        defaultChecked={chatbot.knowledgeBaseIds.includes(kb.id)}
                        className="rounded border-border accent-primary"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-foreground text-xs">{kb.name}</span>
                        <span className="block text-[11px] text-muted-foreground">{kb.documentCount} docs · {kb.totalChunks} chunks</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "prompt" && (
              <div className="space-y-4 animate-fade-in text-xs">
                <h3 className="text-sm font-bold text-foreground">System Prompt Template</h3>
                <textarea
                  defaultValue={chatbot.config.systemPrompt}
                  rows={8}
                  className="w-full p-3.5 rounded-xl border border-border bg-card text-foreground font-mono text-xs leading-relaxed outline-none focus:border-primary"
                />
                <p className="text-[11px] text-muted-foreground">
                  Variables injected at runtime: <code className="bg-muted px-1.5 py-0.5 rounded font-mono">{"{{context}}"}</code>, <code className="bg-muted px-1.5 py-0.5 rounded font-mono">{"{{conversation_history}}"}</code>
                </p>
              </div>
            )}

            {activeTab === "llm" && (
              <div className="space-y-4 animate-fade-in text-xs">
                <h3 className="text-sm font-bold text-foreground">LLM Provider & Settings</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-foreground mb-1">Provider</label>
                    <select defaultValue={chatbot.config.llmProvider} className="w-full px-3 py-2 rounded-lg border border-border bg-card outline-none">
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="gemini">Google Gemini</option>
                      <option value="ollama">Local Ollama</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-foreground mb-1">Model</label>
                    <input type="text" defaultValue={chatbot.config.llmModel} className="w-full px-3 py-2 rounded-lg border border-border bg-card outline-none font-mono" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span>Temperature</span>
                    <span className="font-mono text-muted-foreground">{chatbot.config.temperature}</span>
                  </div>
                  <input type="range" defaultValue={chatbot.config.temperature} min={0} max={1} step={0.05} className="w-full accent-primary" />
                </div>
              </div>
            )}

            {activeTab === "cache" && (
              <div className="space-y-4 animate-fade-in text-xs">
                <h3 className="text-sm font-bold text-foreground">Multi-Level Cache Policies</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Level 1: Exact Response Cache</span>
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Enabled</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Zero LLM/vector calls on identical normalized queries (TTL: 3600s)</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Level 2: Semantic Cache</span>
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Threshold: 0.92</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Returns cached responses for semantically equivalent queries using vector cosine similarity</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Level 3: Embedding Cache</span>
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Enabled</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Caches raw query vectors in Redis to skip BGE-M3 model re-computation</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
