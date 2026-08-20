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
  RefreshCw,
  Trash2,
  Clock,
  HardDrive,
  Layers,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileUp,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";

export function KnowledgeBaseList() {
  const { activeKnowledgeBaseId, setActiveKnowledgeBaseId } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const selectedKB = mockKnowledgeBases.find((kb) => kb.id === activeKnowledgeBaseId);

  if (selectedKB) {
    return (
      <KnowledgeBaseDetail
        knowledgeBase={selectedKB}
        onBack={() => setActiveKnowledgeBaseId(null)}
      />
    );
  }

  const filtered = mockKnowledgeBases.filter((kb) => {
    const matchesSearch =
      kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kb.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || kb.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">
            Knowledge Bases
          </h1>
          <p className="text-xs lg:text-sm text-muted-foreground mt-1">
            Manage your document collections, chunking rules, and vector indexing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 shadow-xs transition-all">
            <Plus size={15} />
            <span>Create Knowledge Base</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search knowledge bases by title or description..."
            className="w-full pl-9 pr-4 py-2 text-xs lg:text-sm rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border bg-muted/40 self-start sm:self-auto">
          {["all", "ready", "processing", "error"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                "px-2.5 py-1 text-xs rounded-md capitalize font-medium transition-colors",
                statusFilter === st
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((kb) => (
          <div
            key={kb.id}
            onClick={() => setActiveKnowledgeBaseId(kb.id)}
            className="group p-5 rounded-xl border border-border bg-card hover:border-border/80 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-primary shrink-0">
                    <Database size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {kb.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">ID: {kb.id}</p>
                  </div>
                </div>
                <KBStatusBadge status={kb.status} />
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                {kb.description}
              </p>

              {/* Stats Box */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/50 border border-border/50 text-center mb-4">
                <div>
                  <div className="text-xs font-bold text-foreground">{kb.documentCount}</div>
                  <div className="text-[10px] text-muted-foreground">Docs</div>
                </div>
                <div className="border-x border-border/60">
                  <div className="text-xs font-bold text-foreground">{kb.totalChunks.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground">Chunks</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground capitalize truncate">{kb.chunkingStrategy}</div>
                  <div className="text-[10px] text-muted-foreground">Strategy</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                Updated {new Date(kb.updatedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Manage <ChevronRight size={13} />
              </span>
            </div>
          </div>
        ))}

        {/* Create Card */}
        <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 cursor-pointer transition-all min-h-[200px] text-center">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3 text-muted-foreground">
            <Plus size={20} />
          </div>
          <span className="text-xs lg:text-sm font-semibold text-foreground">
            Create Knowledge Base
          </span>
          <span className="text-[11px] text-muted-foreground mt-1 max-w-[200px]">
            Set up chunking strategy, embeddings, and upload documents
          </span>
        </div>
      </div>
    </div>
  );
}

function KBStatusBadge({ status }: { status: KnowledgeBase["status"] }) {
  const config = {
    ready: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200/50",
    processing: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200/50",
    error: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border-red-200/50",
  };
  return (
    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium border capitalize", config[status])}>
      {status}
    </span>
  );
}

function KnowledgeBaseDetail({ knowledgeBase, onBack }: { knowledgeBase: KnowledgeBase; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"documents" | "search" | "settings">("documents");
  const documents = mockDocuments.filter((d) => d.knowledgeBaseId === knowledgeBase.id);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background p-6 lg:p-8 space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-bold text-foreground">{knowledgeBase.name}</h1>
              <KBStatusBadge status={knowledgeBase.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{knowledgeBase.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-muted transition-colors">
            <RefreshCw size={13} />
            <span>Re-index All</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            <Upload size={13} />
            <span>Upload Documents</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-border bg-card">
        <div className="space-y-0.5">
          <span className="text-[11px] text-muted-foreground">Total Documents</span>
          <div className="text-base font-bold text-foreground">{knowledgeBase.documentCount}</div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] text-muted-foreground">Indexed Chunks</span>
          <div className="text-base font-bold text-foreground">{knowledgeBase.totalChunks.toLocaleString()}</div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] text-muted-foreground">Chunking Strategy</span>
          <div className="text-base font-bold text-foreground capitalize">{knowledgeBase.chunkingStrategy}</div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] text-muted-foreground">Chunk Size / Overlap</span>
          <div className="text-base font-bold text-foreground">{knowledgeBase.chunkSize} / {knowledgeBase.chunkOverlap}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        {(["documents", "search", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-3 py-2 text-xs font-medium capitalize border-b-2 transition-colors -mb-px",
              activeTab === tab
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "documents" && (
        <div className="space-y-5 animate-fade-in">
          {/* Upload Dropzone */}
          <div className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 cursor-pointer transition-all text-center">
            <FileUp size={28} className="text-muted-foreground mb-2" />
            <p className="text-xs lg:text-sm font-semibold text-foreground">
              Click to browse or drag and drop files here
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Supports PDF, DOCX, TXT, Markdown, HTML, CSV (Max 50MB)
            </p>
          </div>

          {/* Documents Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/60 border-b border-border font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Document</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Chunks</th>
                  <th className="px-4 py-3">Uploaded</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <FileText size={15} className="text-muted-foreground" />
                        <span className="truncate max-w-xs">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatSize(doc.size)}</td>
                    <td className="px-4 py-3">
                      <DocStatusBadge status={doc.status} />
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{doc.chunks || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Re-index">
                          <RefreshCw size={13} />
                        </button>
                        <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors" title="Delete">
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
      )}

      {activeTab === "search" && (
        <div className="space-y-4 animate-fade-in">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search across all chunks and documents in this knowledge base..."
              className="w-full pl-9 pr-4 py-2 text-xs lg:text-sm rounded-lg border border-border bg-card text-foreground outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <Search size={32} className="opacity-40 mb-2" />
            <p className="text-xs">Type a query above to test hybrid semantic & keyword retrieval</p>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="max-w-xl space-y-4 p-4 rounded-xl border border-border bg-card animate-fade-in text-xs">
          <h3 className="font-semibold text-foreground text-sm">Chunking Engine Configuration</h3>
          <div className="space-y-3">
            <div>
              <label className="block font-medium text-foreground mb-1">Strategy</label>
              <select defaultValue={knowledgeBase.chunkingStrategy} className="w-full px-3 py-2 rounded-lg border border-border bg-background outline-none">
                <option value="recursive">Recursive Chunking</option>
                <option value="sentence">Sentence Chunking</option>
                <option value="markdown">Markdown-aware Chunking</option>
                <option value="semantic">Semantic Chunking</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-foreground mb-1">Chunk Size (tokens/chars)</label>
              <input type="number" defaultValue={knowledgeBase.chunkSize} className="w-full px-3 py-2 rounded-lg border border-border bg-background outline-none font-mono" />
            </div>
            <div>
              <label className="block font-medium text-foreground mb-1">Chunk Overlap</label>
              <input type="number" defaultValue={knowledgeBase.chunkOverlap} className="w-full px-3 py-2 rounded-lg border border-border bg-background outline-none font-mono" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DocStatusBadge({ status }: { status: Document["status"] }) {
  const config = {
    ready: { label: "Ready", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400" },
    processing: { label: "Processing", className: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400" },
    queued: { label: "Queued", className: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400" },
    uploaded: { label: "Uploaded", className: "bg-muted text-muted-foreground" },
    failed: { label: "Failed", className: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400" },
  };
  const item = config[status] || config.uploaded;
  return (
    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", item.className)}>
      {item.label}
    </span>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
