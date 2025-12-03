'use client';

import { motion } from "framer-motion";
import { User } from "lucide-react";

interface ChatMessageProps {
  content: string;
  timestamp?: Date;
}

export function ChatMessage({ content, timestamp }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-end mb-4"
    >
      <div className="flex items-start space-x-3 max-w-[80%]">
        <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
          <p className="text-sm whitespace-pre-wrap">{content}</p>
          {timestamp && (
            <span className="text-xs opacity-70 mt-1 block">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
    </motion.div>
  );
}
