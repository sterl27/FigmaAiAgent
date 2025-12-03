"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Volume2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentAvatar } from "./agent-avatar";
import { TypingIndicator } from "./typing-indicator";
import { Message, PanelState } from "@/lib/use-multi-agent-store";

interface AgentPanelProps {
  panel: PanelState;
  panelId: string;
  className?: string;
}

export function AgentPanel({ panel, panelId, className }: AgentPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, isTyping, agent } = panel;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className={cn("flex flex-col h-full bg-card/50 backdrop-blur-sm rounded-xl border", className)} style={{ borderColor: `${agent.color}20` }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: `${agent.color}20` }}>
        <AgentAvatar agent={agent} size={40} showGlow />
        <div className="flex-1">
          <h2 className="text-lg font-bold">{agent.name}</h2>
          <p className="text-xs text-muted-foreground">{agent.description}</p>
        </div>
        <Badge variant="outline" className="text-xs" style={{ borderColor: agent.color, color: agent.color }}>
          {agent.model}
        </Badge>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef} className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl p-4 space-y-2 shadow-md",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border-2"
                )}
                style={message.role === "assistant" ? { borderColor: `${agent.color}40` } : undefined}
              >
                {/* Message Content */}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>

                {/* Voice Message Player */}
                {message.metadata?.voice_message && (
                  <div className="flex items-center space-x-2 p-2 bg-background/20 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speakMessage(message.metadata!.voice_message!.transcript)}
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    <div className="flex-1">
                      <div className="text-xs opacity-70">
                        Voice message • {message.metadata.voice_message.duration}s
                      </div>
                    </div>
                  </div>
                )}

                {/* File Attachments */}
                {message.metadata?.attachments?.map((attachment, index) => (
                  <div key={index} className="p-2 bg-background/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <div className="flex-1">
                        <div className="text-xs font-medium">{attachment.name}</div>
                        {attachment.size && (
                          <div className="text-xs opacity-70">
                            {(attachment.size / 1024).toFixed(1)} KB
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Message Footer */}
                <div className="flex items-center justify-between text-xs opacity-70">
                  <div className="flex items-center space-x-2">
                    <span>{formatTimestamp(message.timestamp)}</span>
                    {message.metadata?.model && (
                      <Badge variant="outline" className="text-xs">
                        {message.metadata.model}
                      </Badge>
                    )}
                  </div>

                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => speakMessage(message.content)}
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(message.content)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card border-2 rounded-2xl p-4" style={{ borderColor: `${agent.color}40` }}>
                <TypingIndicator agent={agent} />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
