"use client";

import { MultiAgentWorkspace } from "@/components/ui/multi-agent-workspace";

/**
 * Alic3X Pro Multi-Agent Chat Interface
 * 
 * Features:
 * - Tri-panel agent workspace (Alic3X PRO, Beat Studio, Research Agent)
 * - Resizable panels with VS Code-style drag handles
 * - Shared input broadcasting to multiple agents
 * - Agent-specific typing indicators and avatars
 * - Comparison view for side-by-side analysis
 * - Voice input/output support
 * - Intelligent agent orchestration
 * - Real-time agent-to-agent collaboration
 */
export default function Alic3XProChat() {
  return (
    <div className="h-full w-full">
      <MultiAgentWorkspace />
    </div>
  );
}
