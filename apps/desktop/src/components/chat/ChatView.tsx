import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { mockConversations, mockMessages, mockChatbots } from "@/mock/data";
import {
  Send,
  Plus,
  Search,
  MoreHorizontal,
  Copy,
  RefreshCw,
  ChevronDown,
  FileText,
  Clock,
  Zap,
  Trash2,
  Bot,
  Sparkles,
  Paperclip,
  Check,
} from "lucide-react";
import type { Message, Citation } from "@/types";

export function ChatView() {
  const { activeChatbotId, activeConversationId, setActiveConversationId } = useAppStore();
  const [inputValue, setInputValue] = useState("");
  const [showCitations, setShowCitations] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeChatbot = mockChatbots.find((c) => c.id === activeChatbotId);
  const conversations = mockConversations.filter((c) => c.chatbotId === activeChatbotId);
  const messages = mockMessages.filter((m) => m.conversationId === activeConversationId);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Left Conversations Sidebar */}
      <div className="w-72 lg:w-80 border-r border-border bg-sidebar/40 flex flex-col h-full shrink-0">
        {/* Active Chatbot Selector */}
        <div className="p-3.5 border-b border-border">
          <button className="flex items-center gap-2.5 w-full p-2 rounded-xl border border-border bg-card shadow-2xs hover:border-border/80 transition-all text-left">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-base shrink-0">
              {activeChatbot?.avatar || "🤖"}
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-semibold text-foreground truncate">
                {activeChatbot?.name || "Select Chatbot"}
              </span>
              <span className="block text-[10px] text-muted-foreground truncate">
                {activeChatbot?.config.llmModel} · Hybrid RAG
              </span>
            </div>
            <ChevronDown size={14} className="text-muted-foreground shrink-0" />
          </button>
        </div>

        {/* Search & New Conversation */}
        <div className="p-3 pb-2 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search history..."
              className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            />
          </div>
          <button
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0 shadow-2xs"
            title="New Conversation"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-1 space-y-1">
          <div className="px-2 py-1">
            <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
              Recent Conversations
            </span>
          </div>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversationId(conv.id)}
              className={cn(
                "flex flex-col w-full p-2.5 rounded-xl text-left transition-all border",
                activeConversationId === conv.id
                  ? "bg-card border-border shadow-xs text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:bg-card/60 hover:text-foreground"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold text-foreground truncate">
                  {conv.title}
                </span>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {new Date(conv.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                {conv.lastMessage}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-background">
        {/* Chat Header Bar */}
        <div className="h-13 px-6 border-b border-border bg-card flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <div className="min-w-0">
              <h2 className="text-xs font-semibold text-foreground truncate">
                {conversations.find((c) => c.id === activeConversationId)?.title || "Active Session"}
              </h2>
              <p className="text-[10px] text-muted-foreground">
                Grounding: {activeChatbot?.knowledgeBaseIds.length || 0} Knowledge Bases active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Clear chat">
              <Trash2 size={14} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <EmptyChatState chatbotName={activeChatbot?.name || "Chatbot"} />
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3.5 animate-fade-in",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={16} />
                    </div>
                  )}

                  <div className={cn("max-w-2xl space-y-2.5", msg.role === "user" && "items-end")}>
                    {/* Message Bubble Card */}
                    <div
                      className={cn(
                        "p-4 rounded-2xl text-xs lg:text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-xs shadow-xs ml-auto"
                          : "bg-card border border-border text-foreground rounded-tl-xs shadow-xs"
                      )}
                    >
                      <div className="whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>

                    {/* Citations & Metadata (Assistant Only) */}
                    {msg.role === "assistant" && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          {msg.citations && msg.citations.length > 0 && (
                            <button
                              onClick={() => setShowCitations(showCitations === msg.id ? null : msg.id)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors font-medium border border-border/50"
                            >
                              <FileText size={12} className="text-primary" />
                              <span>{msg.citations.length} Sources</span>
                              <ChevronDown
                                size={12}
                                className={cn("transition-transform", showCitations === msg.id && "rotate-180")}
                              />
                            </button>
                          )}

                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                          </button>
                          <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Regenerate">
                            <RefreshCw size={13} />
                          </button>

                          {msg.metadata && (
                            <div className="flex items-center gap-3 ml-auto text-[10px] text-muted-foreground/80 font-mono">
                              <span className="flex items-center gap-1">
                                <Clock size={10} /> {msg.metadata.latencyMs}ms
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap size={10} /> {msg.metadata.tokensUsed} tokens
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Expandable Citations Dropdown */}
                        {showCitations === msg.id && msg.citations && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 animate-fade-in">
                            {msg.citations.map((c) => (
                              <div key={c.id} className="p-3 rounded-xl border border-border bg-muted/40 space-y-1 text-left">
                                <div className="flex items-center justify-between text-[11px] font-semibold text-foreground">
                                  <span className="truncate">{c.documentName}</span>
                                  <span className="text-primary font-mono text-[10px]">
                                    {(c.relevanceScore * 100).toFixed(0)}% Match
                                  </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground line-clamp-3 leading-relaxed">
                                  "{c.chunkText}"
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Floating Input Area */}
        <div className="p-4 lg:pb-6 shrink-0 bg-background">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2 p-3 rounded-2xl border border-border bg-card shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0" title="Attach file">
                <Paperclip size={16} />
              </button>

              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Ask ${activeChatbot?.name || "assistant"} anything about your indexed knowledge...`}
                rows={1}
                className="flex-1 max-h-32 bg-transparent text-xs lg:text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none py-1.5 leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                  }
                }}
              />

              <button
                className={cn(
                  "p-2 rounded-xl transition-all shrink-0",
                  inputValue.trim()
                    ? "bg-primary text-primary-foreground shadow-xs hover:opacity-90 cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
                disabled={!inputValue.trim()}
              >
                <Send size={15} />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground/70 px-2 mt-2">
              <span>Shift + Enter for new line</span>
              <span>Isolated tenant-scoped RAG retrieval</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyChatState({ chatbotName }: { chatbotName: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 animate-fade-in">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
        <Sparkles size={22} />
      </div>
      <div>
        <h3 className="text-sm lg:text-base font-semibold text-foreground">
          How can {chatbotName} assist you today?
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Responses are generated with hybrid retrieval and verified against your documents.
        </p>
      </div>
    </div>
  );
}
