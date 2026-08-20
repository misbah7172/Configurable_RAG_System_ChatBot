import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import type { NavSection } from "@/types";
import {
  MessageSquare,
  Bot,
  Database,
  FlaskConical,
  BarChart3,
  Settings,
  Search,
  HelpCircle,
  PanelLeftClose,
  PanelLeft,
  Plus,
  Mail,
  ChevronDown,
  MoreVertical,
  Layers,
  Sparkles,
} from "lucide-react";

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ReactNode;
}

const platformNavItems: NavItem[] = [
  { id: "chat", label: "Dashboard / Chat", icon: <MessageSquare size={17} /> },
  { id: "chatbots", label: "Chatbot Builder", icon: <Bot size={17} /> },
  { id: "analytics", label: "Analytics & Stats", icon: <BarChart3 size={17} /> },
];

const documentsNavItems: NavItem[] = [
  { id: "knowledge", label: "Data Library / KBs", icon: <Database size={17} /> },
  { id: "evaluation", label: "Reports & Evaluation", icon: <FlaskConical size={17} /> },
];

export function Sidebar() {
  const { sidebarCollapsed, activeSection, setActiveSection, toggleSidebar } =
    useAppStore();

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-sidebar-border bg-sidebar transition-sidebar select-none shrink-0 z-10",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header / Brand */}
      <div className={cn(
        "flex items-center h-14 px-3.5 border-b border-sidebar-border/80",
        sidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-semibold shrink-0 shadow-xs">
            <Sparkles size={16} />
          </div>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-1.5 min-w-0 animate-fade-in">
              <span className="text-sm font-semibold text-foreground truncate tracking-tight">
                RAG Studio
              </span>
              <ChevronDown size={13} className="text-muted-foreground shrink-0" />
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Button (Matching reference UI) */}
      {!sidebarCollapsed && (
        <div className="p-3 pb-1.5">
          <button
            onClick={() => setActiveSection("chatbots")}
            className="flex items-center justify-center gap-2 w-full px-3.5 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 shadow-xs transition-all"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>Quick Create</span>
            <Mail size={13} className="ml-auto opacity-70" />
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-2 space-y-5">
        {/* Section 1: Platform */}
        <div>
          {!sidebarCollapsed && (
            <div className="px-2.5 pb-1.5">
              <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
                Platform
              </span>
            </div>
          )}
          <div className="space-y-0.5">
            {platformNavItems.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                isActive={activeSection === item.id}
                isCollapsed={sidebarCollapsed}
                onClick={() => setActiveSection(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Section 2: Documents */}
        <div>
          {!sidebarCollapsed && (
            <div className="px-2.5 pb-1.5">
              <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
                Documents & Data
              </span>
            </div>
          )}
          <div className="space-y-0.5">
            {documentsNavItems.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                isActive={activeSection === item.id}
                isCollapsed={sidebarCollapsed}
                onClick={() => setActiveSection(item.id)}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer Navigation */}
      <div className="p-2.5 border-t border-sidebar-border space-y-0.5">
        <NavButton
          item={{ id: "settings", label: "Settings", icon: <Settings size={17} /> }}
          isActive={activeSection === "settings"}
          isCollapsed={sidebarCollapsed}
          onClick={() => setActiveSection("settings")}
        />

        {!sidebarCollapsed && (
          <button
            onClick={() => setActiveSection("settings")}
            className="flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <HelpCircle size={17} className="text-muted-foreground" />
            <span>Get Help</span>
          </button>
        )}

        {/* Sidebar Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-medium rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          title="Toggle Sidebar"
        >
          {sidebarCollapsed ? <PanelLeft size={17} /> : <PanelLeftClose size={17} />}
          {!sidebarCollapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>

      {/* User Card (Matching reference UI) */}
      <div className="p-2 border-t border-sidebar-border bg-sidebar/50">
        <div className={cn(
          "flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors",
          sidebarCollapsed && "justify-center p-1"
        )}>
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0 shadow-xs">
            M
          </div>
          {!sidebarCollapsed && (
            <>
              <div className="flex flex-col min-w-0 flex-1 leading-tight">
                <span className="text-xs font-semibold text-foreground truncate">
                  Misbah
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  admin@platform.io
                </span>
              </div>
              <MoreVertical size={13} className="text-muted-foreground shrink-0" />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

function NavButton({
  item,
  isActive,
  isCollapsed,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-2.5 w-full px-2.5 py-2 text-xs font-medium rounded-lg transition-colors text-left",
        isCollapsed && "justify-center px-0 py-2.5",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-2xs"
          : "text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground"
      )}
    >
      <span className={cn("shrink-0", isActive ? "text-primary" : "text-muted-foreground")}>
        {item.icon}
      </span>
      {!isCollapsed && <span className="truncate">{item.label}</span>}
    </button>
  );
}
