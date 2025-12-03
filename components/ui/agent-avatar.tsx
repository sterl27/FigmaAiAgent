"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AgentAvatarProps {
  agent: {
    name: string;
    avatar: string;
    color: string;
  };
  size?: number;
  className?: string;
  showGlow?: boolean;
}

export function AgentAvatar({ agent, size = 32, className, showGlow = false }: AgentAvatarProps) {
  return (
    <Avatar
      className={cn(
        "border-2 transition-all duration-300",
        showGlow && "shadow-lg",
        className
      )}
      style={{
        width: size,
        height: size,
        borderColor: agent.color,
        boxShadow: showGlow ? `0 0 20px ${agent.color}40` : undefined
      }}
    >
      <AvatarFallback
        className="font-bold text-white"
        style={{
          background: `linear-gradient(135deg, ${agent.color}, ${agent.color}dd)`
        }}
      >
        {agent.avatar}
      </AvatarFallback>
    </Avatar>
  );
}
