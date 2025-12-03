'use client';

import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";

interface MeaningCardProps {
  title: string;
  content: string;
  sources?: string[];
}

export function MeaningCard({ title, content, sources }: MeaningCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card border rounded-lg p-4"
    >
      <div className="flex items-center space-x-2 mb-3">
        <BookOpen className="w-4 h-4 text-blue-500" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">{content}</p>
      
      {sources && sources.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-muted-foreground">Sources:</h4>
          {sources.map((source, index) => (
            <a
              key={index}
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-xs text-blue-500 hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{source}</span>
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}
