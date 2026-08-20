import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { Sidebar } from "./Sidebar";
import { DebugPanel } from "./DebugPanel";
import { ChatView } from "@/components/chat/ChatView";
import { ChatbotList } from "@/components/chatbots/ChatbotList";
import { KnowledgeBaseList } from "@/components/knowledge/KnowledgeBaseList";
import { EvaluationView } from "@/components/evaluation/EvaluationView";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { SettingsView } from "@/components/settings/SettingsView";
import {
  Sidebar as SidebarIcon,
  Sun,
  Moon,
  Terminal,
  Search,
  Bell,
  ChevronRight,
} from "lucide-react";

const sectionComponents = {
  chat: ChatView,
  chatbots: ChatbotList,
  knowledge: KnowledgeBaseList,
  evaluation: EvaluationView,
  analytics: AnalyticsDashboard,
  settings: SettingsView,
};

const sectionTitles = {
  chat: "Chat & Conversations",
  chatbots: "Chatbot Builder",
  knowledge: "Knowledge Bases & Documents",
  evaluation: "RAG Evaluation & Benchmarks",
  analytics: "System Analytics & Latency",
  settings: "Platform Settings",
};

export function AppShell() {
  const {
    activeSection,
    toggleSidebar,
    theme,
    setTheme,
    debugPanelOpen,
    toggleDebugPanel,
  } = useAppStore();

  const ActiveComponent = sectionComponents[activeSection];

  // Keyboard shortcut: Ctrl+D / Cmd+D to toggle debug panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        toggleDebugPanel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleDebugPanel]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground select-none">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
        {/* Top App Header / Breadcrumbs Bar (Matching Reference Layout) */}
        <header className="h-12 border-b border-border bg-card/60 backdrop-blur-xs flex items-center justify-between px-4 shrink-0 z-10">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Toggle sidebar"
            >
              <SidebarIcon size={15} />
            </button>
            <span className="text-border">/</span>
            <span className="font-medium text-foreground tracking-tight">
              {sectionTitles[activeSection]}
            </span>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-1.5">
            {/* Quick Search */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 text-muted-foreground text-xs hover:bg-muted transition-colors cursor-pointer border border-border/50">
              <Search size={12} />
              <span>Search platform...</span>
              <kbd className="text-[10px] bg-background px-1.5 py-0.5 rounded border border-border font-mono ml-2">
                ⌘K
              </kbd>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Notifications */}
            <button
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative"
              title="Notifications"
            >
              <Bell size={15} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
            </button>

            {/* Debug Panel Toggle (Matching reference UI) */}
            <button
              onClick={toggleDebugPanel}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors border ${
                debugPanelOpen
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground hover:text-foreground border-border hover:bg-muted/80"
              }`}
              title="Toggle Developer Debug Panel (Ctrl+D)"
            >
              <Terminal size={13} />
              <span className="hidden sm:inline">Debug</span>
            </button>
          </div>
        </header>

        {/* Dynamic Main Page Content */}
        <main className="flex-1 overflow-hidden relative">
          <ActiveComponent />
        </main>
      </div>

      {/* Right Developer Debug Panel */}
      <DebugPanel />
    </div>
  );
}
