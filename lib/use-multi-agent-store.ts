"use client";

import { create } from "zustand";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  agentId?: string;
  metadata?: {
    model?: string;
    attachments?: Array<{
      type: "image" | "audio" | "file";
      url: string;
      name: string;
      size?: number;
    }>;
    voice_message?: {
      url: string;
      duration: number;
      transcript: string;
    };
  };
}

export interface AgentConfig {
  id: string;
  name: string;
  color: string;
  avatar: string;
  model: string;
  capabilities: string[];
  description: string;
}

export interface PanelState {
  messages: Message[];
  isTyping: boolean;
  agent: AgentConfig;
}

interface MultiAgentStore {
  panels: {
    left: PanelState;
    middle: PanelState;
    right: PanelState;
  };
  panelOrder: string[];
  mode: "solo" | "dual" | "tri" | "compare";
  sharedInput: string;
  
  // Actions
  sendToPanel: (panel: string, message: Message) => void;
  setTyping: (panel: string, isTyping: boolean) => void;
  setPanelOrder: (order: string[]) => void;
  setMode: (mode: "solo" | "dual" | "tri" | "compare") => void;
  setSharedInput: (input: string) => void;
  broadcastMessage: (message: Message) => void;
  clearPanel: (panel: string) => void;
  updateAgent: (panel: string, agent: AgentConfig) => void;
}

const defaultAgents: Record<string, AgentConfig> = {
  left: {
    id: "alic3x-pro",
    name: "Alic3X PRO",
    color: "hsl(262, 83%, 65%)",
    avatar: "AP",
    model: "gpt-4o",
    capabilities: ["reasoning", "analysis", "planning", "code"],
    description: "Advanced AI reasoning and analysis"
  },
  middle: {
    id: "agent-2",
    name: "Beat Studio",
    color: "hsl(280, 100%, 70%)",
    avatar: "BS",
    model: "claude-3.5-sonnet",
    capabilities: ["music", "production", "lyrics", "creative"],
    description: "Music production and creative assistant"
  },
  right: {
    id: "agent-3",
    name: "Research Agent",
    color: "hsl(200, 100%, 60%)",
    avatar: "RA",
    model: "gemini-pro",
    capabilities: ["research", "data", "analysis", "insights"],
    description: "Research and data analysis specialist"
  }
};

export const useMultiAgentStore = create<MultiAgentStore>((set, get) => ({
  panels: {
    left: {
      messages: [],
      isTyping: false,
      agent: defaultAgents.left
    },
    middle: {
      messages: [],
      isTyping: false,
      agent: defaultAgents.middle
    },
    right: {
      messages: [],
      isTyping: false,
      agent: defaultAgents.right
    }
  },
  panelOrder: ["left", "middle", "right"],
  mode: "tri",
  sharedInput: "",

  sendToPanel: (panel, message) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [panel]: {
          ...state.panels[panel as keyof typeof state.panels],
          messages: [...state.panels[panel as keyof typeof state.panels].messages, message]
        }
      }
    })),

  setTyping: (panel, isTyping) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [panel]: {
          ...state.panels[panel as keyof typeof state.panels],
          isTyping
        }
      }
    })),

  setPanelOrder: (order) => set({ panelOrder: order }),

  setMode: (mode) => set({ mode }),

  setSharedInput: (input) => set({ sharedInput: input }),

  broadcastMessage: (message) => {
    const { panels, mode } = get();
    const activePanels = mode === "tri" ? ["left", "middle", "right"] : mode === "dual" ? ["left", "right"] : ["left"];
    
    activePanels.forEach((panel) => {
      get().sendToPanel(panel, message);
    });
  },

  clearPanel: (panel) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [panel]: {
          ...state.panels[panel as keyof typeof state.panels],
          messages: []
        }
      }
    })),

  updateAgent: (panel, agent) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [panel]: {
          ...state.panels[panel as keyof typeof state.panels],
          agent
        }
      }
    }))
}));
