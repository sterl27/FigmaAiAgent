"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send, Paperclip } from "lucide-react";
import { useMultiAgentStore } from "@/lib/use-multi-agent-store";
import { cn } from "@/lib/utils";

interface SharedInputProps {
  className?: string;
}

export function SharedInput({ className }: SharedInputProps) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { broadcastMessage, mode } = useMultiAgentStore();

  const handleSend = () => {
    if (!text.trim()) return;

    const message = {
      id: Date.now().toString(),
      role: "user" as const,
      content: text,
      timestamp: new Date()
    };

    broadcastMessage(message);
    setText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual voice recording
  };

  return (
    <div className={cn("border-t border-border bg-background/50 backdrop-blur-sm p-4", className)}>
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Input
            className="pr-12 bg-background border-border min-h-[44px]"
            placeholder={`Message ${mode === "tri" ? "all agents" : mode === "dual" ? "both agents" : "agent"}...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button
          variant={isRecording ? "destructive" : "outline"}
          size="sm"
          onClick={toggleRecording}
          className="h-11 w-11 p-0"
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>

        <Button
          onClick={handleSend}
          disabled={!text.trim()}
          className="h-11 w-11 p-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <div>Press Enter to send to all agents, Shift+Enter for new line</div>
        <div>{text.length}/2000</div>
      </div>
    </div>
  );
}
