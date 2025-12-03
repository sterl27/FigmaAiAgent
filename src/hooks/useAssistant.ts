'use client';

import { useState, useCallback } from "react";
import { streamOpenAIResponse } from "../lib/openai";
import { useLyrics, LyricAnalysis } from "./useLyrics";

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: any;
  timestamp: Date;
  type?: 'analysis' | 'enhancement' | 'general';
}

interface UseAssistantProps {
  onMessage?: (message: Message) => void;
}

export const useAssistant = ({ onMessage }: UseAssistantProps = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { analyzeLyrics, enhanceLyrics, isAnalyzing, isEnhancing, error } = useLyrics();

  const sendMessage = useCallback(async (query: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    onMessage?.(userMessage);
    setLoading(true);

    try {
      // Enhanced query parsing for better detection
      const queryLower = query.toLowerCase();
      const containsLyrics = queryLower.includes('lyrics') || queryLower.includes('verse') || queryLower.includes('chorus');
      const isAnalysisRequest = (queryLower.includes('analyze') || queryLower.includes('analysis')) && containsLyrics;
      const isEnhancementRequest = (queryLower.includes('enhance') || queryLower.includes('improve') || queryLower.includes('style') || queryLower.includes('rewrite')) && containsLyrics;
      
      // Extract potential song title and artist from query
      const extractSongInfo = (text: string) => {
        const patterns = [
          /'([^']+)'\s*by\s*([^,\n]+)/i,
          /"([^"]+)"\s*by\s*([^,\n]+)/i,
          /analyze\s*['"]?([^'"]+)['"]?\s*by\s*([^,\n]+)/i,
          /enhance\s*['"]?([^'"]+)['"]?\s*by\s*([^,\n]+)/i,
        ];
        
        for (const pattern of patterns) {
          const match = text.match(pattern);
          if (match) {
            return { title: match[1].trim(), artist: match[2].trim() };
          }
        }
        return { title: 'Untitled', artist: 'Unknown' };
      };

      if (isAnalysisRequest) {
        const { title, artist } = extractSongInfo(query);
        
        // For analysis, we expect the user to provide lyrics content
        // In a real app, you might fetch lyrics from a service
        const lyricsContent = query.replace(/analyze|analysis|the lyrics of|by .+/gi, '').trim();
        
        if (lyricsContent.length < 20) {
          throw new Error('Please provide the lyrics content to analyze, or specify which song you\'d like analyzed.');
        }

        const analysis = await analyzeLyrics(lyricsContent, title, artist);
        
        if (analysis) {
          const aiMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: { analysis, title, artist },
            timestamp: new Date(),
            type: 'analysis'
          };
          setMessages(prev => [...prev, aiMessage]);
          onMessage?.(aiMessage);
        }
        
      } else if (isEnhancementRequest) {
        // Extract style and lyrics content
        const stylePatterns = [
          /in\s+the\s+style\s+of\s+([^,\n]+)/i,
          /like\s+([^,\n]+)/i,
          /as\s+([^,\n]+)/i,
        ];
        
        let style = 'custom';
        let customPrompt = '';
        
        for (const pattern of stylePatterns) {
          const match = query.match(pattern);
          if (match) {
            const styleText = match[1].toLowerCase().trim();
            if (styleText.includes('kendrick') || styleText.includes('lamar')) {
              style = 'kendrick';
            } else if (styleText.includes('drake')) {
              style = 'drake';
            } else if (styleText.includes('tyler') || styleText.includes('creator')) {
              style = 'tyler-creator';
            } else if (styleText.includes('cole')) {
              style = 'j-cole';
            } else if (styleText.includes('eminem')) {
              style = 'eminem';
            } else {
              customPrompt = `Enhance in the style of ${styleText}`;
            }
            break;
          }
        }
        
        const lyricsContent = query.replace(/enhance|improve|rewrite|in\s+the\s+style\s+of.+|like.+|as.+/gi, '').trim();
        
        if (lyricsContent.length < 10) {
          throw new Error('Please provide the lyrics content to enhance.');
        }

        const enhanced = await enhanceLyrics(lyricsContent, style, customPrompt);
        
        if (enhanced) {
          const aiMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: { enhanced, style, originalLyrics: lyricsContent },
            timestamp: new Date(),
            type: 'enhancement'
          };
          setMessages(prev => [...prev, aiMessage]);
          onMessage?.(aiMessage);
        }
        
      } else {
        // General chat response using streaming
        const stream = streamOpenAIResponse(query);
        let aiContent = "";
        
        const aiMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "",
          timestamp: new Date(),
          type: 'general'
        };

        // Add the message immediately for real-time updates
        setMessages(prev => [...prev, aiMessage]);

        for await (const chunk of stream) {
          aiContent += chunk;
          
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessage.id 
                ? { ...msg, content: aiContent }
                : msg
            )
          );
        }
        
        onMessage?.({ ...aiMessage, content: aiContent });
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: error instanceof Error ? error.message : "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        type: 'general'
      };
      setMessages(prev => [...prev, errorMessage]);
      onMessage?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onMessage, analyzeLyrics, enhanceLyrics]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    loading: loading || isAnalyzing || isEnhancing,
    sendMessage,
    clearMessages,
    error,
  };
};
