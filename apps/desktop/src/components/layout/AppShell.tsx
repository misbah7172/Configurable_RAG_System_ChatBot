import { useAppStore } from "@/store/appStore";
import { Sidebar } from "./Sidebar";
import { ChatView } from "@/components/chat/ChatView";
import { ChatbotList } from "@/components/chatbots/ChatbotList";
import { KnowledgeBaseList } from "@/components/knowledge/KnowledgeBaseList";
import { EvaluationView } from "@/components/evaluation/EvaluationView";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { SettingsView } from "@/components/settings/SettingsView";

const sectionComponents = {
  chat: ChatView,
  chatbots: ChatbotList,
  knowledge: KnowledgeBaseList,
  evaluation: EvaluationView,
  analytics: AnalyticsDashboard,
  settings: SettingsView,
};

export function AppShell() {
  const { activeSection } = useAppStore();
  const ActiveComponent = sectionComponents[activeSection];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[hsl(var(--background))]">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <ActiveComponent />
      </main>
    </div>
  );
}
