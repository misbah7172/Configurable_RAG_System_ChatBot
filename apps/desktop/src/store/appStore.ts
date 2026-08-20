import { create } from "zustand";
import type { NavSection } from "@/types";

interface AppState {
  // Sidebar
  sidebarCollapsed: boolean;
  activeSection: NavSection;
  toggleSidebar: () => void;
  setActiveSection: (section: NavSection) => void;

  // Theme
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Active chatbot for chat
  activeChatbotId: string | null;
  setActiveChatbotId: (id: string | null) => void;

  // Active conversation
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;

  // Active knowledge base
  activeKnowledgeBaseId: string | null;
  setActiveKnowledgeBaseId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  activeSection: "chat",
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setActiveSection: (section) => set({ activeSection: section }),

  theme: "light",
  setTheme: (theme) => {
    set({ theme });
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  },

  activeChatbotId: "cb-1",
  setActiveChatbotId: (id) => set({ activeChatbotId: id }),

  activeConversationId: "conv-1",
  setActiveConversationId: (id) => set({ activeConversationId: id }),

  activeKnowledgeBaseId: null,
  setActiveKnowledgeBaseId: (id) => set({ activeKnowledgeBaseId: id }),
}));
