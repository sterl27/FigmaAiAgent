'use client';

import { motion } from "framer-motion";
import { Bot, BarChart3, Sparkles, Copy, Heart, Share } from "lucide-react";
import { AnalysisCard } from "../cards/AnalysisCard";
import { MeaningCard } from "../cards/MeaningCard";
import { Skeleton } from "../feedback/Skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AIResponseProps {
  content?: any;
  loading?: boolean;
  timestamp?: Date;
  messageType?: 'analysis' | 'enhancement' | 'general';
}

export function AIResponse({ content, loading = false, timestamp, messageType = 'general' }: AIResponseProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex mb-4"
      >
        <div className="flex items-start space-x-3 max-w-[85%]">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-muted-foreground animate-pulse" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-32 w-80 rounded-lg" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Handle different message types
  if (messageType === 'analysis' && content?.analysis) {
    const { analysis, title, artist } = content;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex mb-4"
      >
        <div className="flex items-start space-x-3 max-w-[85%]">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-4 p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">Analysis Complete</Badge>
              {title && artist && (
                <span className="text-sm text-muted-foreground">
                  &ldquo;{title}&rdquo; by {artist}
                </span>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              I&apos;ve analyzed your lyrics across 5 key dimensions:
            </p>
            
            <div className="grid gap-3">
              {Object.entries(analysis).map(([key, data]: [string, any]) => (
                <AnalysisCard
                  key={key}
                  type={key}
                  score={data.score}
                  confidence={data.confidence}
                  details={data.details}
                />
              ))}
            </div>
            
            <MeaningCard 
              title="Overall Assessment"
              content="This analysis provides insights into the technical and artistic qualities of your lyrics. Use these scores to identify strengths and areas for improvement in your songwriting."
            />
          </div>
        </div>
      </motion.div>
    );
  }

  if (messageType === 'enhancement' && content?.enhanced) {
    const { enhanced, style, originalLyrics } = content;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex mb-4"
      >
        <div className="flex items-start space-x-3 max-w-[85%]">
          <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">Enhanced Lyrics</Badge>
              <Badge variant="outline">{style}</Badge>
            </div>
            
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">Enhanced Version</h4>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-foreground bg-transparent border-none p-0">
                  {enhanced}
                </pre>
              </div>
            </Card>

            {originalLyrics && (
              <MeaningCard 
                title="Enhancement Notes"
                content={`I've enhanced your lyrics using ${style} style, focusing on improving flow, wordplay, and overall impact while maintaining the original message and emotion.`}
              />
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Handle general streaming content or text responses
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex mb-4"
    >
      <div className="flex items-start space-x-3 max-w-[85%]">
        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none p-3 rounded-lg bg-muted/30">
          <div className="whitespace-pre-wrap text-foreground">
            {typeof content === 'string' ? content : JSON.stringify(content)}
          </div>
          {timestamp && (
            <p className="text-xs text-muted-foreground mt-2">
              {timestamp.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
