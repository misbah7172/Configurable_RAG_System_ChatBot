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
  Sparkles,
} from "lucide-react";

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ReactNode;
  group?: string;
}

const mainNavItems: NavItem[] = [
  { id: "chat", label: "Chat", icon: <MessageSquare size={18} /> },
  { id: "chatbots", label: "Chatbots", icon: <Bot size={18} /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
];

const dataNavItems: NavItem[] = [
  { id: "knowledge", label: "Knowledge Bases", icon: <Database size={18} /> },
  { id: "evaluation", label: "Evaluation", icon: <FlaskConical size={18} /> },
];

export function Sidebar() {
  const { sidebarCollapsed, activeSection, setActiveSection, toggleSidebar } =
    useAppStore();

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] transition-sidebar select-none",
        sidebarCollapsed ? "w-[var(--sidebar-width-collapsed)]" : "w-[var(--sidebar-width)]"
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center h-14 px-3 border-b border-[hsl(var(--sidebar-border))]",
        sidebarCollapsed ? "justify-center" : "gap-2"
      )}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[hsl(var(--foreground))] text-[hsl(var(--background))]">
          <Sparkles size={16} />
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col min-w-0 animate-fade-in">
            <span className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
              RAG Platform
            </span>
          </div>
        )}
      </div>

      {/* Search (only when expanded) */}
      {!sidebarCollapsed && (
        <div className="px-3 pt-3 animate-fade-in">
          <button className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[hsl(var(--muted-foreground))] rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--sidebar-accent))] transition-colors">
            <Search size={14} />
            <span>Search...</span>
            <kbd className="ml-auto text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {/* Main */}
        {!sidebarCollapsed && (
          <div className="px-2 pb-1">
            <span className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
              Main
            </span>
          </div>
        )}
        <div className="space-y-0.5">
          {mainNavItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              isCollapsed={sidebarCollapsed}
              onClick={() => setActiveSection(item.id)}
            />
          ))}
        </div>

        {/* Data section */}
        <div className="mt-5">
          {!sidebarCollapsed && (
            <div className="px-2 pb-1">
              <span className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                Data
              </span>
            </div>
          )}
          <div className="space-y-0.5">
            {dataNavItems.map((item) => (
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

      {/* Bottom section */}
      <div className="border-t border-[hsl(var(--sidebar-border))] py-2 px-2 space-y-0.5">
        <NavButton
          item={{ id: "settings", label: "Settings", icon: <Settings size={18} /> }}
          isActive={activeSection === "settings"}
          isCollapsed={sidebarCollapsed}
          onClick={() => setActiveSection("settings")}
        />
        {!sidebarCollapsed && (
          <button
            className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] transition-colors"
          >
            <HelpCircle size={18} />
            <span>Get Help</span>
          </button>
        )}

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))] transition-colors"
        >
          {sidebarCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>

      {/* User */}
      <div className={cn(
        "border-t border-[hsl(var(--sidebar-border))] p-3",
        sidebarCollapsed ? "flex justify-center" : ""
      )}>
        <div className={cn(
          "flex items-center gap-2",
          sidebarCollapsed && "justify-center"
        )}>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium">
            M
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0 animate-fade-in">
              <span className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                Misbah
              </span>
              <span className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                admin@platform.io
              </span>
            </div>
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
        "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors",
        isCollapsed && "justify-center px-0",
        isActive
          ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))] font-medium"
          : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
      )}
    >
      <span className={cn(isActive && "text-[hsl(var(--sidebar-primary))]")}>
        {item.icon}
      </span>
      {!isCollapsed && <span>{item.label}</span>}
    </button>
  );
}
