import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import {
  X,
  MoreHorizontal,
  Pin,
  Maximize2,
  Terminal,
  Activity,
  Layers,
  AlertTriangle,
} from "lucide-react";

export function DebugPanel() {
  const { debugPanelOpen, toggleDebugPanel, activeSection, theme } = useAppStore();
  const [activeTab, setActiveTab] = useState<"overview" | "runtime" | "system" | "errors">("overview");

  if (!debugPanelOpen) return null;

  return (
    <aside className="w-80 lg:w-96 border-l border-border bg-card flex flex-col h-full overflow-hidden select-none animate-fade-in shadow-lg z-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-border bg-sidebar">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Terminal size={14} className="text-primary" />
          <span>Development Debug Panel</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Pin panel">
            <Pin size={13} />
          </button>
          <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="More options">
            <MoreHorizontal size={13} />
          </button>
          <button
            onClick={toggleDebugPanel}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Close panel (Ctrl+D)"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-border bg-sidebar px-2">
        {(
          [
            { id: "overview", label: "Overview" },
            { id: "runtime", label: "Runtime", count: 12 },
            { id: "system", label: "System" },
            { id: "errors", label: "Errors" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-foreground bg-card"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab.label}</span>
            {"count" in tab && (
              <span className="text-[10px] bg-muted px-1.5 py-0.2 rounded-full font-mono">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {activeTab === "overview" && (
          <>
            {/* App Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">App</span>
                <span className="text-[11px] text-muted-foreground">Static application metadata</span>
              </div>
              <div className="rounded-lg border border-border bg-sidebar overflow-hidden divide-y divide-border">
                <Row label="Route" value={`/${activeSection}`} />
                <Row label="URL" value="http://localhost:1420/" />
                <Row label="Bridge" value="Tauri v2" />
                <Row label="Name" value="rag-platform" />
                <Row label="Version" value="0.1.0" />
                <Row label="Identifier" value="com.ragplatform.desktop" />
                <Row label="Theme" value={theme} />
                <Row label="Shortcut" value="Ctrl / Cmd + D" />
              </div>
            </div>

            {/* Window Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Window</span>
                <span className="text-[11px] text-muted-foreground">Tauri window & monitor state</span>
              </div>
              <div className="rounded-lg border border-border bg-sidebar overflow-hidden divide-y divide-border">
                <Row label="Label" value="main" />
                <Row label="Title" value="RAG Chatbot Platform" />
                <Row label="Viewport" value="1400 x 900" />
                <Row label="Focused" value="true" />
                <Row label="Visible" value="true" />
                <Row label="Maximized" value="false" />
                <Row label="Scale" value="1.0" />
              </div>
            </div>
          </>
        )}

        {activeTab === "runtime" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Activity size={14} className="text-emerald-500" />
              <span>Active Background Services</span>
            </div>
            <div className="rounded-lg border border-border bg-sidebar p-3 space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-medium">Embedding Service</span>
                <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">Running</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-medium">Redis Stream Consumer</span>
                <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-medium">Qdrant Vector Engine</span>
                <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">Connected</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Layers size={14} className="text-blue-500" />
              <span>System Resources</span>
            </div>
            <div className="rounded-lg border border-border bg-sidebar divide-y divide-border">
              <Row label="CPU Architecture" value="x86_64" />
              <Row label="OS Platform" value="Windows" />
              <Row label="RAM Allocated" value="142 MB" />
              <Row label="Vector Index Cache" value="28 MB" />
            </div>
          </div>
        )}

        {activeTab === "errors" && (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <AlertTriangle size={24} className="text-muted-foreground/50 mb-2" />
            <p>No active runtime errors</p>
          </div>
        )}
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 font-mono text-[11px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium truncate max-w-[180px]">{value}</span>
    </div>
  );
}
