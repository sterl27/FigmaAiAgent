"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useMultiAgentStore } from "@/lib/use-multi-agent-store";
import { AgentAvatar } from "./agent-avatar";

interface ComparisonViewProps {
  onBack: () => void;
}

export function ComparisonView({ onBack }: ComparisonViewProps) {
  const { panels } = useMultiAgentStore();

  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Multi-Agent Comparison
          </h1>
        </div>
        <Badge variant="outline">Synchronized View</Badge>
      </div>

      {/* Comparison Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {Object.entries(panels).map(([panelId, panel]) => (
          <ComparisonColumn key={panelId} panel={panel} panelId={panelId} />
        ))}
      </div>
    </div>
  );
}

function ComparisonColumn({ panel, panelId }: { panel: any; panelId: string }) {
  const { agent, messages } = panel;

  return (
    <div
      className="border-2 rounded-xl p-4 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col"
      style={{ borderColor: `${agent.color}40` }}
    >
      {/* Agent Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b" style={{ borderColor: `${agent.color}20` }}>
        <AgentAvatar agent={agent} size={36} showGlow />
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{agent.name}</h2>
          <p className="text-xs text-muted-foreground">{agent.model}</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {messages.map((message: any, index: number) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg text-sm ${
                message.role === "user"
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-card border-2"
              }`}
              style={message.role === "assistant" ? { borderColor: `${agent.color}40` } : undefined}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {message.role}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="whitespace-pre-wrap opacity-90">{message.content}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
