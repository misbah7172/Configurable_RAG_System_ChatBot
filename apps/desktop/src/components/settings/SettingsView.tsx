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
} from "lucide-react";

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: <Settings size={16} /> },
    { id: "connection", label: "API Connection", icon: <Globe size={16} /> },
    { id: "llm", label: "LLM Providers", icon: <Cpu size={16} /> },
    { id: "embedding", label: "Embedding", icon: <Layers size={16} /> },
    { id: "reranking", label: "Reranking", icon: <Wrench size={16} /> },
    { id: "storage", label: "Storage", icon: <HardDrive size={16} /> },
    { id: "cache", label: "Cache", icon: <Database size={16} /> },
    { id: "advanced", label: "Advanced", icon: <Key size={16} /> },
  ];

  return (
    <div className="flex h-full">
      {/* Settings Sidebar */}
      <div className="w-56 border-r border-[hsl(var(--border))] py-4 px-2">
        <div className="px-3 pb-3">
          <h1 className="text-sm font-semibold text-[hsl(var(--foreground))]">Settings</h1>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Manage your platform configuration</p>
        </div>
        <div className="space-y-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-md transition-colors",
                activeTab === tab.id
                  ? "bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] font-medium"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl">
          {activeTab === "general" && <GeneralSettings />}
          {activeTab === "connection" && <ConnectionSettings />}
          {activeTab === "llm" && <LLMProviderSettings />}
          {activeTab === "embedding" && <EmbeddingSettings />}
          {activeTab === "reranking" && <RerankingSettings />}
          {activeTab === "storage" && <StorageSettings />}
          {activeTab === "cache" && <CacheSettings />}
          {activeTab === "advanced" && <AdvancedSettings />}
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">{title}</h2>
        {description && <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SettingsField({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[hsl(var(--border))] last:border-0">
      <div className="flex-1 mr-4">
        <label className="text-sm font-medium text-[hsl(var(--foreground))]">{label}</label>
        {description && <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function GeneralSettings() {
  const { theme, setTheme } = useAppStore();

  return (
    <SettingsSection title="General" description="Application appearance and behavior">
      <SettingsField label="Theme" description="Choose your preferred color scheme">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[hsl(var(--muted))]">
          {([
            { value: "light" as const, icon: <Sun size={14} />, label: "Light" },
            { value: "dark" as const, icon: <Moon size={14} />, label: "Dark" },
            { value: "system" as const, icon: <Monitor size={14} />, label: "System" },
          ]).map(({ value, icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors",
                theme === value
                  ? "bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm font-medium"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              )}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </SettingsField>
      <SettingsField label="Language" description="Display language">
        <select className="px-3 py-1.5 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none">
          <option>English</option>
        </select>
      </SettingsField>
    </SettingsSection>
  );
}

function ConnectionSettings() {
  const [status, setStatus] = useState<"connected" | "disconnected" | "checking">("connected");

  return (
    <SettingsSection title="API Connection" description="Configure the backend API connection">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">Backend URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              defaultValue="http://localhost:8000"
              className="flex-1 px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none focus:ring-1 focus:ring-[hsl(var(--ring))] font-mono"
            />
            <button
              onClick={() => {
                setStatus("checking");
                setTimeout(() => setStatus("connected"), 1500);
              }}
              className="px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors"
            >
              Test
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-[hsl(var(--muted))]">
          {status === "connected" && (
            <>
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span className="text-sm text-emerald-600 font-medium">Connected</span>
            </>
          )}
          {status === "disconnected" && (
            <>
              <XCircle size={16} className="text-red-500" />
              <span className="text-sm text-red-500 font-medium">Disconnected</span>
            </>
          )}
          {status === "checking" && (
            <>
              <Loader2 size={16} className="text-blue-500 animate-spin" />
              <span className="text-sm text-blue-500 font-medium">Checking connection...</span>
            </>
          )}
        </div>
      </div>
    </SettingsSection>
  );
}

function LLMProviderSettings() {
  return (
    <SettingsSection title="LLM Providers" description="Configure API keys for language model providers">
      <div className="space-y-4">
        <ProviderKeyField name="OpenAI" keyValue="sk-proj-****...****7f3A" isConfigured />
        <ProviderKeyField name="Anthropic" keyValue="" isConfigured={false} />
        <ProviderKeyField name="Google Gemini" keyValue="AIza****...****Nw" isConfigured />
        <div className="space-y-1.5 p-4 rounded-lg border border-[hsl(var(--border))]">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">Ollama</label>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Local LLM provider</p>
          <input
            type="text"
            defaultValue="http://localhost:11434"
            className="w-full px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none font-mono mt-2"
          />
        </div>
      </div>
    </SettingsSection>
  );
}

function ProviderKeyField({ name, keyValue, isConfigured }: { name: string; keyValue: string; isConfigured: boolean }) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="p-4 rounded-lg border border-[hsl(var(--border))]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[hsl(var(--foreground))]">{name}</span>
          {isConfigured ? (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-medium">
              Configured
            </span>
          ) : (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 font-medium">
              Not configured
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={showKey ? "text" : "password"}
            defaultValue={keyValue}
            placeholder={`Enter ${name} API key`}
            className="w-full px-3 py-2 pr-10 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none font-mono"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          >
            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <button className="px-3 py-2 text-sm rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity">
          Save
        </button>
      </div>
    </div>
  );
}

function EmbeddingSettings() {
  return (
    <SettingsSection title="Embedding" description="Configure embedding model providers">
      <div className="p-4 rounded-lg border border-[hsl(var(--border))]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-medium text-[hsl(var(--foreground))]">Local BGE-M3</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Default local embedding model</p>
          </div>
          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-medium">
            <CheckCircle2 size={12} /> Running
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-2 rounded bg-[hsl(var(--muted))]">
            <span className="text-xs text-[hsl(var(--muted-foreground))]">Model</span>
            <p className="font-mono text-[hsl(var(--foreground))]">BGE-M3</p>
          </div>
          <div className="p-2 rounded bg-[hsl(var(--muted))]">
            <span className="text-xs text-[hsl(var(--muted-foreground))]">Dimensions</span>
            <p className="font-mono text-[hsl(var(--foreground))]">1024</p>
          </div>
        </div>
      </div>

      <ProviderKeyField name="Voyage AI" keyValue="" isConfigured={false} />
    </SettingsSection>
  );
}

function RerankingSettings() {
  return (
    <SettingsSection title="Reranking" description="Configure reranking model providers">
      <ProviderKeyField name="Voyage Reranker" keyValue="" isConfigured={false} />
      <ProviderKeyField name="Cohere Reranker" keyValue="" isConfigured={false} />
    </SettingsSection>
  );
}

function StorageSettings() {
  return (
    <SettingsSection title="Object Storage" description="Configure storage for document files">
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">Provider</label>
          <select className="w-full px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none">
            <option>MinIO (Local)</option>
            <option>Amazon S3</option>
            <option>Cloudflare R2</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">Endpoint</label>
          <input
            type="text"
            defaultValue="http://localhost:9000"
            className="w-full px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none font-mono"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">Access Key</label>
            <input
              type="password"
              defaultValue="minioadmin"
              className="w-full px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">Secret Key</label>
            <input
              type="password"
              defaultValue="minioadmin"
              className="w-full px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none font-mono"
            />
          </div>
        </div>
        <button className="px-3 py-2 text-sm rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity">
          Save & Test Connection
        </button>
      </div>
    </SettingsSection>
  );
}

function CacheSettings() {
  return (
    <SettingsSection title="Cache" description="Configure Redis connection and default cache settings">
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">Redis URL</label>
          <input
            type="text"
            defaultValue="redis://localhost:6379"
            className="w-full px-3 py-2 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none font-mono"
          />
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[hsl(var(--muted))]">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span className="text-sm text-emerald-600 font-medium">Redis Connected</span>
        </div>
      </div>
    </SettingsSection>
  );
}

function AdvancedSettings() {
  return (
    <SettingsSection title="Advanced" description="Advanced configuration options">
      <SettingsField label="Debug Mode" description="Show detailed request/response logs">
        <ToggleButton defaultEnabled={false} />
      </SettingsField>
      <SettingsField label="Telemetry" description="Send anonymous usage data to improve the platform">
        <ToggleButton defaultEnabled={true} />
      </SettingsField>
      <SettingsField label="Log Level" description="Minimum log level for output">
        <select className="px-3 py-1.5 text-sm rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] outline-none">
          <option>INFO</option>
          <option>DEBUG</option>
          <option>WARNING</option>
          <option>ERROR</option>
        </select>
      </SettingsField>
    </SettingsSection>
  );
}

function ToggleButton({ defaultEnabled }: { defaultEnabled: boolean }) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={cn(
        "relative w-9 h-5 rounded-full transition-colors",
        enabled ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--muted))]"
      )}
    >
      <div className={cn(
        "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
        enabled ? "left-[18px]" : "left-0.5"
      )} />
    </button>
  );
}
