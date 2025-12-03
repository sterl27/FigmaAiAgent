'use client';

import React, { useState, useCallback } from 'react';
import { Music, Upload, Mic, FileText, BarChart3, Brain, Zap, Volume2, Layers, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLyrics, LyricAnalysis } from '@/src/hooks/useLyrics';
import { cn } from '@/lib/utils';

interface AnalysisResult {
  complexity: { score: number; confidence: number; details: string };
  rhyme: { score: number; confidence: number; details: string };
  flow: { score: number; confidence: number; details: string };
  energy: { score: number; confidence: number; details: string };
  structure: { score: number; confidence: number; details: string };
}

const analysisCategories = [
  {
    key: 'complexity' as const,
    label: 'Complexity',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    description: 'AI-powered semantic analysis'
  },
  {
    key: 'rhyme' as const,
    label: 'Rhyme',
    icon: Volume2,
    color: 'from-blue-500 to-cyan-500',
    description: 'Rhyme scheme and patterns'
  },
  {
    key: 'flow' as const,
    label: 'Flow',
    icon: Zap,
    color: 'from-green-500 to-emerald-500',
    description: 'Rhythmic flow analysis'
  },
  {
    key: 'energy' as const,
    label: 'Energy',
    icon: BarChart3,
    color: 'from-orange-500 to-red-500',
    description: 'Emotional intensity levels'
  },
  {
    key: 'structure' as const,
    label: 'Structure',
    icon: Layers,
    color: 'from-indigo-500 to-purple-500',
    description: 'Song structure analysis'
  }
];

export function UnifiedAnalysisDashboard() {
  const [inputText, setInputText] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const { analyzeLyrics, isAnalyzing, error } = useLyrics();

  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim()) return;
    
    const result = await analyzeLyrics(inputText, 'Untitled Track', 'Unknown Artist');
    if (result) {
      setCurrentAnalysis(result);
    }
  }, [inputText, analyzeLyrics]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col h-full bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Music className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Lyric Analysis
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          AI-powered comprehensive music analysis
        </p>
      </div>

      {/* Input Section */}
      <Card className="p-4 space-y-4 bg-card/50 backdrop-blur-sm border-primary/20">
        <div className="space-y-4">
          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex space-x-2">
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={() => setIsRecording(!isRecording)}
                className="flex items-center space-x-2"
              >
                <Mic className={cn(
                  "w-4 h-4",
                  isRecording && "animate-pulse"
                )} />
                <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
              </Button>
              
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
              </Button>
            </div>
          </div>

          {/* Text Input */}
          <div className="space-y-3">
            <textarea
              className="w-full h-32 p-3 bg-background/50 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
              placeholder="Paste your lyrics here or use voice recording..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            
            <div className="flex justify-center">
              <Button
                onClick={handleAnalyze}
                disabled={!inputText.trim() || isAnalyzing}
                className="px-8 py-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Analyze Lyrics</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {currentAnalysis && (
        <div className="space-y-6">
          {/* Analysis Categories Grid */}
          <div className="grid grid-cols-2 gap-4">
            {analysisCategories.map((category, index) => {
              const Icon = category.icon;
              const result = currentAnalysis[category.key];
              
              return (
                <div
                  key={category.key}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    activeCategory === category.key
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-border bg-card/50 hover:border-primary/50 hover:bg-card/70"
                  )}
                  onClick={() => setActiveCategory(category.key)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r",
                          category.color
                        )}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{category.label}</h3>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          "text-2xl font-bold",
                          getScoreColor(result.score)
                        )}>
                          {result.score}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {result.confidence}% confidence
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Score</span>
                        <span>{result.score}/100</span>
                      </div>
                      <Progress 
                        value={result.score} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Analysis */}
          {activeCategory && (
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r",
                    analysisCategories.find(c => c.key === activeCategory)?.color
                  )}>
                    {React.createElement(
                      analysisCategories.find(c => c.key === activeCategory)!.icon,
                      { className: "w-4 h-4 text-white" }
                    )}
                  </div>
                  <h2 className="text-xl font-bold">
                    {analysisCategories.find(c => c.key === activeCategory)?.label} Analysis
                  </h2>
                </div>
                
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Overall Score:</span>
                      <div className={cn(
                        "text-2xl font-bold",
                        getScoreColor(currentAnalysis[activeCategory as keyof AnalysisResult].score)
                      )}>
                        {currentAnalysis[activeCategory as keyof AnalysisResult].score}/100
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Confidence Level</span>
                        <span>{currentAnalysis[activeCategory as keyof AnalysisResult].confidence}%</span>
                      </div>
                      <Progress 
                        value={currentAnalysis[activeCategory as keyof AnalysisResult].confidence} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <h3 className="font-semibold mb-2">Detailed Analysis:</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {currentAnalysis[activeCategory as keyof AnalysisResult].details}
                      </p>
                    </div>
                  </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
