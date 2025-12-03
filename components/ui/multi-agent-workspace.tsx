"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Layout, LayoutGrid, Columns2, Columns3, GitCompare, Settings } from "lucide-react";
import { useMultiAgentStore } from "@/lib/use-multi-agent-store";
import { AgentPanel } from "./agent-panel";
import { SharedInput } from "./shared-input";
import { ComparisonView } from "./comparison-view";
import { cn } from "@/lib/utils";

export function MultiAgentWorkspace() {
  const { panels, mode, setMode } = useMultiAgentStore();
  const [sizes, setSizes] = useState({
    left: 33.33,
    middle: 33.33,
    right: 33.34,
  });

  const [showComparison, setShowComparison] = useState(false);

  const handleResize = (divider: "left" | "middle", e: React.MouseEvent) => {
    const startX = e.clientX;
    const startSizes = { ...sizes };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const containerWidth = window.innerWidth;
      const deltaPercent = (deltaX / containerWidth) * 100;

      if (divider === "left") {
        const newLeft = Math.max(15, Math.min(70, startSizes.left + deltaPercent));
        const newMiddle = Math.max(15, startSizes.middle - deltaPercent);
        setSizes({ ...sizes, left: newLeft, middle: newMiddle });
      } else if (divider === "middle") {
        const newMiddle = Math.max(15, Math.min(70, startSizes.middle + deltaPercent));
        const newRight = Math.max(15, startSizes.right - deltaPercent);
        setSizes({ ...sizes, middle: newMiddle, right: newRight });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (showComparison) {
    return <ComparisonView onBack={() => setShowComparison(false)} />;
  }

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-primary/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Alic3X PRO Multi-Agent Workspace
              </h1>
              <p className="text-xs text-muted-foreground">
                {mode === "tri" ? "3 Agents Active" : mode === "dual" ? "2 Agents Active" : "1 Agent Active"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Layout Mode Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Layout className="w-4 h-4 mr-2" />
                  Layout
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setMode("solo")}>
                  <Layout className="w-4 h-4 mr-2" />
                  Solo Mode
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("dual")}>
                  <Columns2 className="w-4 h-4 mr-2" />
                  Dual Mode
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("tri")}>
                  <Columns3 className="w-4 h-4 mr-2" />
                  Tri Mode
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={() => setShowComparison(true)}>
              <GitCompare className="w-4 h-4 mr-2" />
              Compare
            </Button>

            <Badge variant="outline" className="capitalize">
              {mode} Mode
            </Badge>
          </div>
        </div>
      </div>

      {/* Panels Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile: Tabs */}
        <div className="lg:hidden flex-1 p-4">
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" className="flex-1">
              Alic3X PRO
            </Button>
            {mode !== "solo" && (
              <Button variant="outline" size="sm" className="flex-1">
                Beat Studio
              </Button>
            )}
            {mode === "tri" && (
              <Button variant="outline" size="sm" className="flex-1">
                Research Agent
              </Button>
            )}
          </div>
          <AgentPanel panel={panels.left} panelId="left" />
        </div>

        {/* Desktop: Side by Side */}
        <div className="hidden lg:flex flex-1 p-4 gap-4">
          {/* Left Panel */}
          {mode !== "solo" && (
            <>
              <div style={{ width: `${sizes.left}%` }} className="relative">
                <AgentPanel panel={panels.left} panelId="left" className="h-full" />
                
                {/* Resize Handle */}
                {(mode === "dual" || mode === "tri") && (
                  <div
                    className="absolute right-0 top-0 w-1 h-full cursor-col-resize bg-border/40 hover:bg-primary/50 transition-colors z-10"
                    onMouseDown={(e) => handleResize("left", e)}
                  />
                )}
              </div>
            </>
          )}

          {/* Middle Panel */}
          {mode === "tri" && (
            <>
              <div style={{ width: `${sizes.middle}%` }} className="relative">
                <AgentPanel panel={panels.middle} panelId="middle" className="h-full" />
                
                {/* Resize Handle */}
                <div
                  className="absolute right-0 top-0 w-1 h-full cursor-col-resize bg-border/40 hover:bg-primary/50 transition-colors z-10"
                  onMouseDown={(e) => handleResize("middle", e)}
                />
              </div>
            </>
          )}

          {/* Right Panel */}
          {(mode === "dual" || mode === "tri") && (
            <div style={{ width: `${sizes.right}%` }}>
              <AgentPanel panel={panels.right} panelId="right" className="h-full" />
            </div>
          )}

          {/* Solo Panel */}
          {mode === "solo" && (
            <div className="flex-1">
              <AgentPanel panel={panels.left} panelId="left" className="h-full" />
            </div>
          )}
        </div>
      </div>

      {/* Shared Input */}
      <SharedInput />
    </div>
  );
}
