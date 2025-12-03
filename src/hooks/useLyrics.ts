'use client';

import { useState, useCallback } from 'react';

export interface LyricAnalysis {
  complexity: { score: number; confidence: number; details: string };
  rhyme: { score: number; confidence: number; details: string };
  flow: { score: number; confidence: number; details: string };
  energy: { score: number; confidence: number; details: string };
  structure: { score: number; confidence: number; details: string };
}

export interface LibraryItem {
  id: number;
  title: string;
  artist?: string;
  content: string;
  type: 'original' | 'enhanced';
  style?: string;
  createdAt: string;
  analysis?: LyricAnalysis;
  isBookmarked?: boolean;
}

export interface LyricsState {
  isAnalyzing: boolean;
  isEnhancing: boolean;
  isLoadingLibrary: boolean;
  error: string | null;
  library: LibraryItem[];
}

export interface UseLyricsReturn extends LyricsState {
  analyzeLyrics: (content: string, title?: string, artist?: string) => Promise<LyricAnalysis | null>;
  enhanceLyrics: (content: string, style: string, customPrompt?: string) => Promise<string | null>;
  loadLibrary: () => Promise<void>;
  clearError: () => void;
}

const ENHANCEMENT_STYLES = {
  'tyler-creator': 'Tyler, The Creator style with unique metaphors and vivid imagery',
  'kendrick': 'Kendrick Lamar style with complex narratives and social commentary',
  'drake': 'Drake style with melodic flow and emotional vulnerability',
  'j-cole': 'J. Cole style with introspective storytelling',
  'eminem': 'Eminem style with rapid flow and wordplay',
  'custom': 'Custom style based on user prompt'
};

export function useLyrics(): UseLyricsReturn {
  const [state, setState] = useState<LyricsState>({
    isAnalyzing: false,
    isEnhancing: false,
    isLoadingLibrary: false,
    error: null,
    library: []
  });

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const analyzeLyrics = useCallback(async (
    content: string, 
    title = 'Untitled', 
    artist = 'Unknown'
  ): Promise<LyricAnalysis | null> => {
    if (!content.trim()) {
      setState(prev => ({ ...prev, error: 'Please provide lyrics to analyze' }));
      return null;
    }

    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      // Generate a user ID (in a real app, this would come from authentication)
      const userId = 'demo-user';

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lyrics: content,
          title,
          artist,
          userId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze lyrics');
      }

      const { analysis } = await response.json();
      
      setState(prev => ({ ...prev, isAnalyzing: false }));
      return analysis;

    } catch (error) {
      console.error('Error analyzing lyrics:', error);
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: error instanceof Error ? error.message : 'Failed to analyze lyrics'
      }));
      return null;
    }
  }, []);

  const enhanceLyrics = useCallback(async (
    content: string, 
    style: string, 
    customPrompt?: string
  ): Promise<string | null> => {
    if (!content.trim()) {
      setState(prev => ({ ...prev, error: 'Please provide lyrics to enhance' }));
      return null;
    }

    setState(prev => ({ ...prev, isEnhancing: true, error: null }));

    try {
      const userId = 'demo-user';

      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalLyrics: content,
          style,
          customPrompt,
          userId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to enhance lyrics');
      }

      const { enhancedLyrics } = await response.json();
      
      setState(prev => ({ ...prev, isEnhancing: false }));
      return enhancedLyrics;

    } catch (error) {
      console.error('Error enhancing lyrics:', error);
      setState(prev => ({ 
        ...prev, 
        isEnhancing: false, 
        error: error instanceof Error ? error.message : 'Failed to enhance lyrics'
      }));
      return null;
    }
  }, []);

  const loadLibrary = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoadingLibrary: true, error: null }));

    try {
      const userId = 'demo-user';
      
      const response = await fetch(`/api/library?userId=${userId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load library');
      }

      const { items } = await response.json();
      
      setState(prev => ({ 
        ...prev, 
        isLoadingLibrary: false, 
        library: items 
      }));

    } catch (error) {
      console.error('Error loading library:', error);
      setState(prev => ({ 
        ...prev, 
        isLoadingLibrary: false, 
        error: error instanceof Error ? error.message : 'Failed to load library'
      }));
    }
  }, []);

  return {
    ...state,
    analyzeLyrics,
    enhanceLyrics,
    loadLibrary,
    clearError
  };
}

export { ENHANCEMENT_STYLES };
