'use client';

import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputBarProps {
  onSubmit: (query: string) => void;
  loading: boolean;
}

export function InputBar({ onSubmit, loading }: InputBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    onSubmit(query);
    setQuery("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background border-t border-border p-4"
    >
      <div className="flex items-center space-x-2 bg-muted rounded-full px-4 py-2">
        <button
          type="button"
          title="Attach file"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        
        <input
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-2"
          placeholder="Ask about lyrics, analyze a song, or enhance your writing..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        
        <button
          type="submit"
          title="Send"
          disabled={loading || !query.trim()}
          className={cn(
            "p-2 rounded-full transition-all duration-200",
            loading || !query.trim()
              ? "text-muted-foreground cursor-not-allowed"
              : "text-primary hover:bg-primary hover:text-white"
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
