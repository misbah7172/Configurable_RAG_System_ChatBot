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
} from "lucide-react";
import type { Message, Citation } from "@/types";

export function ChatView() {
  const { activeChatbotId, activeConversationId, setActiveConversationId } = useAppStore();
  const [inputValue, setInputValue] = useState("");
  const [showCitations, setShowCitations] = useState<string | null>(null);

  const activeChatbot = mockChatbots.find((c) => c.id === activeChatbotId);
  const conversations = mockConversations.filter((c) => c.chatbotId === activeChatbotId);
  const messages = mockMessages.filter((m) => m.conversationId === activeConversationId);

  return (
    <div className="flex h-full">
      {/* Conversation List */}
      <div className="w-72 border-r border-[hsl(var(--border))] flex flex-col bg-[hsl(var(--background))]">
        {/* Chatbot Selector */}
        <div className="p-3 border-b border-[hsl(var(--border))]">
          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors">
            <span className="text-lg">{activeChatbot?.avatar || "🤖"}</span>
            <span className="font-medium text-[hsl(var(--foreground))] truncate flex-1 text-left">
              {activeChatbot?.name || "Select Chatbot"}
            </span>
            <ChevronDown size={14} className="text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>

        {/* Search + New */}
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))]">
              <Search size={14} className="text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-[hsl(var(--muted-foreground))]"
              />
            </div>
            <button className="p-2 rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors">
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <div className="px-2 pb-1">
            <span className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
              Today
            </span>
          </div>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversationId(conv.id)}
              className={cn(
                "flex flex-col w-full px-3 py-2.5 rounded-md text-left transition-colors mb-0.5",
                activeConversationId === conv.id
                  ? "bg-[hsl(var(--accent))]"
                  : "hover:bg-[hsl(var(--accent))]"
              )}
            >
              <span className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                {conv.title}
              </span>
              <span className="text-xs text-[hsl(var(--muted-foreground))] truncate mt-0.5">
                {conv.lastMessage}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  {conv.messageCount} messages
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 h-14 border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-3">
            <Bot size={18} className="text-[hsl(var(--muted-foreground))]" />
            <div>
              <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">
                {conversations.find((c) => c.id === activeConversationId)?.title || "New Conversation"}
              </h2>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {activeChatbot?.name} · v{activeChatbot?.configVersion}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-md hover:bg-[hsl(var(--accent))] transition-colors text-[hsl(var(--muted-foreground))]">
              <Trash2 size={16} />
            </button>
            <button className="p-2 rounded-md hover:bg-[hsl(var(--accent))] transition-colors text-[hsl(var(--muted-foreground))]">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {messages.length === 0 ? (
            <EmptyChat chatbotName={activeChatbot?.name || "Chatbot"} />
          ) : (
            messages.map((msg, idx) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                showCitations={showCitations === msg.id}
                onToggleCitations={() =>
                  setShowCitations(showCitations === msg.id ? null : msg.id)
                }
                animationDelay={idx * 50}
              />
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="px-6 pb-4 pt-2">
          <div className="flex items-end gap-2 p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-sm focus-within:ring-1 focus-within:ring-[hsl(var(--ring))]">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-sm placeholder:text-[hsl(var(--muted-foreground))] text-[hsl(var(--foreground))] max-h-32"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  // send message
                }
              }}
            />
            <button
              className={cn(
                "p-2 rounded-md transition-colors",
                inputValue.trim()
                  ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90"
                  : "text-[hsl(var(--muted-foreground))]"
              )}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] text-center mt-2">
            Responses are generated using RAG with your configured knowledge bases
          </p>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  showCitations,
  onToggleCitations,
  animationDelay,
}: {
  message: Message;
  showCitations: boolean;
  onToggleCitations: () => void;
  animationDelay: number;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up",
        isUser ? "justify-end" : "justify-start"
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center">
          <Bot size={16} className="text-[hsl(var(--muted-foreground))]" />
        </div>
      )}
      <div className={cn("max-w-[70%] space-y-2", isUser && "text-right")}>
        <div
          className={cn(
            "px-4 py-3 rounded-xl text-sm leading-relaxed",
            isUser
              ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-tr-sm"
              : "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-tl-sm"
          )}
        >
          <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
            __html: message.content
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n/g, '<br/>')
          }} />
        </div>

        {/* Citations & Actions (assistant only) */}
        {!isUser && (
          <div className="flex items-center gap-2 text-xs">
            {message.citations && message.citations.length > 0 && (
              <button
                onClick={onToggleCitations}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
              >
                <FileText size={12} />
                <span>{message.citations.length} sources</span>
                <ChevronDown
                  size={12}
                  className={cn(
                    "transition-transform",
                    showCitations && "rotate-180"
                  )}
                />
              </button>
            )}
            <button className="p-1 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
              <Copy size={12} />
            </button>
            <button className="p-1 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
              <RefreshCw size={12} />
            </button>
            {message.metadata && (
              <div className="flex items-center gap-2 ml-auto text-[hsl(var(--muted-foreground))]">
                <span className="flex items-center gap-1">
                  <Clock size={10} /> {message.metadata.latencyMs}ms
                </span>
                <span className="flex items-center gap-1">
                  <Zap size={10} /> {message.metadata.tokensUsed} tokens
                </span>
              </div>
            )}
          </div>
        )}

        {/* Citations Panel */}
        {showCitations && message.citations && (
          <div className="space-y-2 animate-slide-up">
            {message.citations.map((citation) => (
              <CitationCard key={citation.id} citation={citation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CitationCard({ citation }: { citation: Citation }) {
  return (
    <div className="p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-left">
      <div className="flex items-center gap-2 mb-1.5">
        <FileText size={12} className="text-[hsl(var(--muted-foreground))]" />
        <span className="text-xs font-medium text-[hsl(var(--foreground))]">
          {citation.documentName}
        </span>
        {citation.page && (
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            p.{citation.page}
          </span>
        )}
        <span className="ml-auto text-xs text-[hsl(var(--muted-foreground))] font-mono">
          {(citation.relevanceScore * 100).toFixed(0)}%
        </span>
      </div>
      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-2">
        {citation.chunkText}
      </p>
    </div>
  );
}

function EmptyChat({ chatbotName }: { chatbotName: string }) {
  const suggestions = [
    "What can you help me with?",
    "Tell me about the return policy",
    "How do I track my order?",
    "What are the shipping options?",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--muted))] flex items-center justify-center mb-4">
        <Bot size={28} className="text-[hsl(var(--muted-foreground))]" />
      </div>
      <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-1">
        Start a conversation
      </h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6 max-w-md">
        Ask {chatbotName} anything. Responses are grounded in your knowledge base with source citations.
      </p>
      <div className="grid grid-cols-2 gap-2 max-w-lg">
        {suggestions.map((s) => (
          <button
            key={s}
            className="px-4 py-3 text-sm text-left rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors text-[hsl(var(--foreground))]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
