"use client";

import { useMultiAgentStore, Message } from "./use-multi-agent-store";

interface AgentSkills {
  [key: string]: string[];
}

const agentSkills: AgentSkills = {
  "alic3x-pro": ["reasoning", "planning", "analysis", "code", "general"],
  "agent-2": ["music", "production", "lyrics", "creative", "audio"],
  "agent-3": ["research", "data", "analysis", "insights", "web"]
};

/**
 * Determines the best agent to handle a given message based on content analysis
 */
export function selectBestAgent(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Music/Audio related
  if (
    lowerMessage.includes("beat") ||
    lowerMessage.includes("song") ||
    lowerMessage.includes("music") ||
    lowerMessage.includes("lyric") ||
    lowerMessage.includes("audio") ||
    lowerMessage.includes("melody")
  ) {
    return "middle"; // Beat Studio
  }

  // Research/Data related
  if (
    lowerMessage.includes("research") ||
    lowerMessage.includes("data") ||
    lowerMessage.includes("analyze") ||
    lowerMessage.includes("study") ||
    lowerMessage.includes("find") ||
    lowerMessage.includes("search")
  ) {
    return "right"; // Research Agent
  }

  // Code/Technical
  if (
    lowerMessage.includes("code") ||
    lowerMessage.includes("deploy") ||
    lowerMessage.includes("docker") ||
    lowerMessage.includes("database") ||
    lowerMessage.includes("api")
  ) {
    return "right"; // Research Agent (can handle technical)
  }

  // Default to Alic3X PRO for general queries
  return "left";
}

/**
 * Orchestrates message routing to appropriate agents
 */
export async function orchestrateMessage(
  message: string,
  mode: "auto" | "broadcast" | "specific" = "auto",
  specificPanel?: string
): Promise<void> {
  const store = useMultiAgentStore.getState();

  if (mode === "broadcast") {
    // Send to all active panels
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date()
    };
    store.broadcastMessage(userMessage);
    
    // Simulate AI responses for all panels
    simulateAgentResponses(message);
  } else if (mode === "specific" && specificPanel) {
    // Send to specific panel
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date()
    };
    store.sendToPanel(specificPanel, userMessage);
    simulateAgentResponse(specificPanel, message);
  } else {
    // Auto-select best agent
    const bestPanel = selectBestAgent(message);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date()
    };
    store.sendToPanel(bestPanel, userMessage);
    simulateAgentResponse(bestPanel, message);
  }
}

/**
 * Simulates AI response for a specific panel
 */
async function simulateAgentResponse(panel: string, userMessage: string) {
  const store = useMultiAgentStore.getState();
  const agent = store.panels[panel as keyof typeof store.panels].agent;

  // Set typing indicator
  store.setTyping(panel, true);

  // Simulate thinking time
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate contextual response
  let response = "";
  
  if (panel === "middle") {
    // Beat Studio responses
    response = `🎵 **${agent.name} Analysis**\n\nI've analyzed your music-related query. Based on the content, I can help with:\n\n• Lyrical structure and flow patterns\n• Melodic composition suggestions\n• Beat production techniques\n• Audio mixing recommendations\n\nWhat specific aspect would you like me to focus on?`;
  } else if (panel === "right") {
    // Research Agent responses
    response = `🔍 **${agent.name} Insights**\n\nI've researched your query and found relevant information:\n\n• Key data points and statistics\n• Related research findings\n• Analytical insights\n• Recommended resources\n\nWould you like me to dive deeper into any particular area?`;
  } else {
    // Alic3X PRO responses
    response = `🤖 **${agent.name} Response**\n\nI understand your request. Let me help you with a comprehensive analysis:\n\n• Logical breakdown of the problem\n• Strategic recommendations\n• Implementation steps\n• Potential considerations\n\nHow would you like to proceed?`;
  }

  const aiMessage: Message = {
    id: (Date.now() + 1).toString(),
    role: "assistant",
    content: response,
    timestamp: new Date(),
    agentId: agent.id,
    metadata: {
      model: agent.model
    }
  };

  store.sendToPanel(panel, aiMessage);
  store.setTyping(panel, false);
}

/**
 * Simulates AI responses for all panels (broadcast mode)
 */
async function simulateAgentResponses(userMessage: string) {
  const store = useMultiAgentStore.getState();
  const panels = ["left", "middle", "right"];

  // Set all typing indicators
  panels.forEach(panel => store.setTyping(panel, true));

  // Stagger responses for realism
  for (let i = 0; i < panels.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000 + i * 500));
    await simulateAgentResponse(panels[i], userMessage);
  }
}

/**
 * Enables agent-to-agent collaboration
 */
export async function agentCollaborate(
  fromPanel: string,
  toPanel: string,
  message: string
): Promise<void> {
  const store = useMultiAgentStore.getState();
  const fromAgent = store.panels[fromPanel as keyof typeof store.panels].agent;

  const collaborationMessage: Message = {
    id: Date.now().toString(),
    role: "assistant",
    content: `[From ${fromAgent.name}] ${message}`,
    timestamp: new Date(),
    agentId: fromAgent.id
  };

  store.sendToPanel(toPanel, collaborationMessage);
  simulateAgentResponse(toPanel, message);
}
