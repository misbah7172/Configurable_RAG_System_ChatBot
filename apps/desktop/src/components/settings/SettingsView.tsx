import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import {
  Settings,
  Globe,
  Key,
  Cpu,
  Layers,
  HardDrive,
  Database,
  Wrench,
  CheckCircle2,
  XCircle,
  Loader2,
  Sun,
  Moon,
  Monitor,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General & Appearance", icon: <Settings size={15} /> },
    { id: "connection", label: "API Connection", icon: <Globe size={15} /> },
    { id: "llm", label: "LLM Provider Keys", icon: <Cpu size={15} /> },
    { id: "embedding", label: "Embedding Engine", icon: <Layers size={15} /> },
    { id: "storage", label: "Object Storage (MinIO/S3)", icon: <HardDrive size={15} /> },
    { id: "cache", label: "Redis State & Caches", icon: <Database size={15} /> },
  ];

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Settings Navigation Sidebar */}
      <div className="w-64 border-r border-border bg-sidebar/40 p-4 space-y-1 shrink-0 overflow-y-auto">
        <div className="px-2 pb-2">
          <h2 className="text-xs font-bold text-foreground">Preferences</h2>
          <p className="text-[10px] text-muted-foreground">Manage your desktop and cloud settings</p>
        </div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2.5 w-full px-3 py-2 text-xs rounded-xl font-medium transition-colors text-left",
              activeTab === tab.id
                ? "bg-card border border-border text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
            )}
          >
            <span className={cn(activeTab === tab.id ? "text-primary" : "text-muted-foreground")}>
              {tab.icon}
            </span>
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="max-w-2xl space-y-6">
          {activeTab === "general" && <GeneralSettings />}
          {activeTab === "connection" && <ConnectionSettings />}
          {activeTab === "llm" && <LLMProviderSettings />}
          {activeTab === "embedding" && <EmbeddingSettings />}
          {activeTab === "storage" && <StorageSettings />}
          {activeTab === "cache" && <CacheSettings />}
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  const { theme, setTheme } = useAppStore();

  return (
    <div className="space-y-5 animate-fade-in text-xs">
      <div>
        <h3 className="text-sm font-bold text-foreground">Appearance & Desktop Shell</h3>
        <p className="text-muted-foreground text-[11px]">Customize desktop theme and interface</p>
      </div>

      <div className="p-5 rounded-2xl border border-border bg-card shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-foreground">Color Theme</span>
            <p className="text-[11px] text-muted-foreground">Select interface color palette</p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted border border-border">
            {[
              { id: "light" as const, label: "Light", icon: <Sun size={13} /> },
              { id: "dark" as const, label: "Dark", icon: <Moon size={13} /> },
              { id: "system" as const, label: "System", icon: <Monitor size={13} /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium transition-colors",
                  theme === t.id
                    ? "bg-card text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectionSettings() {
  const [status, setStatus] = useState<"connected" | "checking">("connected");

  return (
    <div className="space-y-5 animate-fade-in text-xs">
      <div>
        <h3 className="text-sm font-bold text-foreground">FastAPI Backend Connection</h3>
        <p className="text-muted-foreground text-[11px]">Configure URL endpoint and verify connectivity</p>
      </div>

      <div className="p-5 rounded-2xl border border-border bg-card shadow-2xs space-y-4">
        <div className="space-y-1.5">
          <label className="font-semibold text-foreground">API Server URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              defaultValue="http://localhost:8000"
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-border bg-background font-mono text-foreground outline-none"
            />
            <button
              onClick={() => {
                setStatus("checking");
                setTimeout(() => setStatus("connected"), 800);
              }}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-border bg-card hover:bg-muted transition-colors"
            >
              {status === "checking" ? <Loader2 size={13} className="animate-spin" /> : "Test Ping"}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50">
          <CheckCircle2 size={15} />
          <span className="font-medium text-[11px]">FastAPI v1 Gateway Online (200 OK)</span>
        </div>
      </div>
    </div>
  );
}

function LLMProviderSettings() {
  return (
    <div className="space-y-5 animate-fade-in text-xs">
      <div>
        <h3 className="text-sm font-bold text-foreground">LLM Provider Credentials</h3>
        <p className="text-muted-foreground text-[11px]">Secure API keys stored locally in desktop vault</p>
      </div>

      <div className="space-y-3">
        <KeyInputCard name="OpenAI API Key" defaultValue="sk-proj-****...****7f3A" isConfigured />
        <KeyInputCard name="Anthropic API Key" defaultValue="" isConfigured={false} />
        <KeyInputCard name="Google Gemini API Key" defaultValue="AIza****...****Nw" isConfigured />
      </div>
    </div>
  );
}

function KeyInputCard({ name, defaultValue, isConfigured }: { name: string; defaultValue: string; isConfigured: boolean }) {
  const [show, setShow] = useState(false);

  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-2xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground text-xs">{name}</span>
        {isConfigured ? (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 font-medium">Configured</span>
        ) : (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Not set</span>
        )}
      </div>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          defaultValue={defaultValue}
          placeholder={`Enter your ${name}`}
          className="w-full pl-3 pr-8 py-2 rounded-lg border border-border bg-background font-mono text-xs text-foreground outline-none"
        />
        <button
          onClick={() => setShow(!show)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>
    </div>
  );
}

function EmbeddingSettings() {
  return (
    <div className="space-y-5 animate-fade-in text-xs">
      <div>
        <h3 className="text-sm font-bold text-foreground">Embedding Service</h3>
        <p className="text-muted-foreground text-[11px]">Local BGE-M3 model status and parameters</p>
      </div>
      <div className="p-5 rounded-2xl border border-border bg-card shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground">Local BGE-M3 Inference</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 font-medium">Active (CPU/GPU)</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-lg bg-muted/60">
            <span className="text-muted-foreground">Vector Dimensions</span>
            <div className="font-mono font-bold mt-0.5">1024</div>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/60">
            <span className="text-muted-foreground">Max Sequence Length</span>
            <div className="font-mono font-bold mt-0.5">8192 tokens</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StorageSettings() {
  return (
    <div className="space-y-5 animate-fade-in text-xs">
      <div>
        <h3 className="text-sm font-bold text-foreground">Object Storage</h3>
        <p className="text-muted-foreground text-[11px]">S3-compatible raw document storage configuration</p>
      </div>
      <div className="p-5 rounded-2xl border border-border bg-card shadow-2xs space-y-3">
        <div>
          <label className="block font-semibold mb-1">MinIO / S3 Endpoint</label>
          <input type="text" defaultValue="http://localhost:9000" className="w-full px-3 py-2 rounded-lg border border-border bg-background font-mono outline-none" />
        </div>
      </div>
    </div>
  );
}

function CacheSettings() {
  return (
    <div className="space-y-5 animate-fade-in text-xs">
      <div>
        <h3 className="text-sm font-bold text-foreground">Redis Cache & State</h3>
        <p className="text-muted-foreground text-[11px]">Fast in-memory cache and distributed queues</p>
      </div>
      <div className="p-5 rounded-2xl border border-border bg-card shadow-2xs space-y-3">
        <div>
          <label className="block font-semibold mb-1">Redis URI</label>
          <input type="text" defaultValue="redis://localhost:6379" className="w-full px-3 py-2 rounded-lg border border-border bg-background font-mono outline-none" />
        </div>
      </div>
    </div>
  );
}
