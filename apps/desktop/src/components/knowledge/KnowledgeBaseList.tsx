import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { mockKnowledgeBases, mockDocuments } from "@/mock/data";
import type { KnowledgeBase, Document } from "@/types";
import {
  Database,
  Plus,
  Search,
  Upload,
  FileText,
  File,
  ArrowLeft,
  MoreHorizontal,
  RefreshCw,
  Trash2,
  Clock,
  HardDrive,
  Layers,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileUp,
} from "lucide-react";

export function KnowledgeBaseList() {
  const { activeKnowledgeBaseId, setActiveKnowledgeBaseId } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");

  const selectedKB = mockKnowledgeBases.find((kb) => kb.id === activeKnowledgeBaseId);

  if (selectedKB) {
    return (
      <KnowledgeBaseDetail
        knowledgeBase={selectedKB}
        onBack={() => setActiveKnowledgeBaseId(null)}
      />
    );
  }

  const filtered = mockKnowledgeBases.filter(
    (kb) =>
      kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kb.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-14 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-3">
          <Database size={18} className="text-[hsl(var(--muted-foreground))]" />
          <h1 className="text-sm font-semibold text-[hsl(var(--foreground))]">Knowledge Bases</h1>
          <span className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-0.5 rounded-full">
            {mockKnowledgeBases.length}
          </span>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity">
          <Plus size={14} />
          <span>Create Knowledge Base</span>
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
            placeholder="Search knowledge bases..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[hsl(var(--muted-foreground))]"
          />
        </div>
      </div>

      {/* KB Cards */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((kb, idx) => (
            <div
              key={kb.id}
              onClick={() => setActiveKnowledgeBaseId(kb.id)}
              className={cn(
                "group p-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:shadow-md transition-all cursor-pointer animate-slide-up",
                `stagger-${idx + 1}`
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[hsl(var(--muted))]">
                    <Database size={18} className="text-[hsl(var(--muted-foreground))]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{kb.name}</h3>
                    <KBStatusBadge status={kb.status} />
                  </div>
                </div>
              </div>

              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4 line-clamp-2">
                {kb.description}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <StatMini icon={<FileText size={12} />} label="Docs" value={kb.documentCount} />
                <StatMini icon={<Layers size={12} />} label="Chunks" value={kb.totalChunks.toLocaleString()} />
                <StatMini icon={<HardDrive size={12} />} label="Strategy" value={kb.chunkingStrategy} />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--border))]">
                <span className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                  <Clock size={11} />
                  {new Date(kb.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}

          {/* Create New */}
          <div className="flex flex-col items-center justify-center p-5 rounded-lg border-2 border-dashed border-[hsl(var(--border))] hover:border-[hsl(var(--muted-foreground))] cursor-pointer transition-colors min-h-[200px]">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--muted))] flex items-center justify-center mb-3">
              <Plus size={20} className="text-[hsl(var(--muted-foreground))]" />
            </div>
            <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
              Create Knowledge Base
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatMini({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-[hsl(var(--muted-foreground))] mb-0.5">
        {icon}
      </div>
      <div className="text-sm font-semibold text-[hsl(var(--foreground))]">{value}</div>
      <div className="text-xs text-[hsl(var(--muted-foreground))]">{label}</div>
    </div>
  );
}

function KBStatusBadge({ status }: { status: KnowledgeBase["status"] }) {
  const styles = {
    ready: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    processing: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    error: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  };
  return (
    <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium", styles[status])}>
      {status}
    </span>
  );
}

// ===== Knowledge Base Detail =====
function KnowledgeBaseDetail({ knowledgeBase, onBack }: { knowledgeBase: KnowledgeBase; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"documents" | "search" | "settings">("documents");
  const documents = mockDocuments.filter((d) => d.knowledgeBaseId === knowledgeBase.id);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-14 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-md hover:bg-[hsl(var(--accent))] transition-colors">
            <ArrowLeft size={16} className="text-[hsl(var(--muted-foreground))]" />
          </button>
          <Database size={18} className="text-[hsl(var(--muted-foreground))]" />
          <div>
            <h1 className="text-sm font-semibold text-[hsl(var(--foreground))]">{knowledgeBase.name}</h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">{knowledgeBase.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors text-[hsl(var(--foreground))]">
            <RefreshCw size={14} />
            Re-index All
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity">
            <Upload size={14} />
            Upload Documents
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 px-6 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
        <div className="text-sm">
          <span className="text-[hsl(var(--muted-foreground))]">Documents: </span>
          <span className="font-semibold text-[hsl(var(--foreground))]">{knowledgeBase.documentCount}</span>
        </div>
        <div className="text-sm">
          <span className="text-[hsl(var(--muted-foreground))]">Chunks: </span>
          <span className="font-semibold text-[hsl(var(--foreground))]">{knowledgeBase.totalChunks.toLocaleString()}</span>
        </div>
        <div className="text-sm">
          <span className="text-[hsl(var(--muted-foreground))]">Strategy: </span>
          <span className="font-semibold text-[hsl(var(--foreground))] capitalize">{knowledgeBase.chunkingStrategy}</span>
        </div>
        <div className="text-sm">
          <span className="text-[hsl(var(--muted-foreground))]">Chunk size: </span>
          <span className="font-semibold text-[hsl(var(--foreground))]">{knowledgeBase.chunkSize}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-6 pt-3 border-b border-[hsl(var(--border))]">
        {(["documents", "search", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-3 py-2 text-sm capitalize rounded-t-md transition-colors -mb-px",
              activeTab === tab
                ? "border-b-2 border-[hsl(var(--primary))] text-[hsl(var(--foreground))] font-medium"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "documents" && <DocumentsTab documents={documents} />}
        {activeTab === "search" && <SearchTab />}
        {activeTab === "settings" && <KBSettingsTab knowledgeBase={knowledgeBase} />}
      </div>
    </div>
  );
}

function DocumentsTab({ documents }: { documents: Document[] }) {
  return (
    <div className="p-6 space-y-4 animate-fade-in">
      {/* Upload zone */}
      <div className="flex items-center justify-center p-8 rounded-lg border-2 border-dashed border-[hsl(var(--border))] hover:border-[hsl(var(--muted-foreground))] transition-colors cursor-pointer">
        <div className="text-center">
          <FileUp size={28} className="mx-auto text-[hsl(var(--muted-foreground))] mb-2" />
          <p className="text-sm font-medium text-[hsl(var(--foreground))]">Drop files here or click to upload</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Supports PDF, DOCX, TXT, Markdown, HTML, CSV
          </p>
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
              <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Name</th>
              <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Type</th>
              <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Size</th>
              <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Status</th>
              <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Chunks</th>
              <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Uploaded</th>
              <th className="text-right px-4 py-2.5 font-medium text-[hsl(var(--muted-foreground))]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <DocIcon type={doc.type} />
                    <span className="font-medium text-[hsl(var(--foreground))]">{doc.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono uppercase px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                    {doc.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{formatSize(doc.size)}</td>
                <td className="px-4 py-3"><DocStatusBadge status={doc.status} /></td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))] font-mono">{doc.chunks || "—"}</td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 rounded-md hover:bg-[hsl(var(--accent))] transition-colors text-[hsl(var(--muted-foreground))]">
                      <RefreshCw size={13} />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-[hsl(var(--accent))] transition-colors text-[hsl(var(--muted-foreground))] hover:text-red-500">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DocIcon({ type }: { type: Document["type"] }) {
  const colors: Record<string, string> = {
    pdf: "text-red-500",
    docx: "text-blue-500",
    txt: "text-gray-500",
    md: "text-purple-500",
    html: "text-orange-500",
    csv: "text-green-500",
  };
  return <File size={16} className={colors[type] || "text-gray-500"} />;
}

function DocStatusBadge({ status }: { status: Document["status"] }) {
  const config: Record<string, { icon: React.ReactNode; className: string }> = {
    ready: { icon: <CheckCircle2 size={12} />, className: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400" },
    processing: { icon: <Loader2 size={12} className="animate-spin" />, className: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400" },
    queued: { icon: <Clock size={12} />, className: "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400" },
    uploaded: { icon: <FileUp size={12} />, className: "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400" },
    failed: { icon: <AlertCircle size={12} />, className: "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400" },
  };
  const c = config[status] || config.uploaded;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium", c.className)}>
      {c.icon} {status}
    </span>
  );
}

function SearchTab() {
  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-[hsl(var(--border))] mb-4">
        <Search size={14} className="text-[hsl(var(--muted-foreground))]" />
        <input
          type="text"
          placeholder="Search documents in this knowledge base..."
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-[hsl(var(--muted-foreground))]"
        />
      </div>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Search size={32} className="text-[hsl(var(--muted-foreground))] mb-3" />
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Search across all documents and chunks in this knowledge base
        </p>
      </div>
    </div>
  );
}

function KBSettingsTab({ knowledgeBase }: { knowledgeBase: KnowledgeBase }) {
  return (
    <div className="p-6 max-w-lg space-y-4 animate-fade-in">
      <div>
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">Chunking Configuration</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">Strategy</label>
            <select
              defaultValue={knowledgeBase.chunkingStrategy}
              className="w-full px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none"
            >
              <option value="recursive">Recursive</option>
              <option value="sentence">Sentence</option>
              <option value="markdown">Markdown-aware</option>
              <option value="semantic">Semantic</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">Chunk Size</label>
            <input
              type="number"
              defaultValue={knowledgeBase.chunkSize}
              className="w-full px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">Chunk Overlap</label>
            <input
              type="number"
              defaultValue={knowledgeBase.chunkOverlap}
              className="w-full px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
