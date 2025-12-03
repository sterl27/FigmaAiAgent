'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './LyricsAnalyzer.module.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Music, 
  Heart, 
  Brain, 
  Sparkles,
  Loader2,
  Save,
  BookOpen,
  TrendingUp,
  Users
} from 'lucide-react';

interface LyricsAnalysisProps {
  onAnalysisComplete?: (analysis: any) => void;
}

interface AnalysisResult {
  success: boolean;
  analysis: {
    song: {
      title: string;
      artist: string;
      album?: string;
      year?: string;
      genre?: string;
    };
    themes: {
      primary: string[];
      secondary: string[];
      emotions: string[];
      subjects: string[];
    };
    sentiment: {
      overall: 'positive' | 'negative' | 'neutral' | 'mixed';
      intensity: number;
      confidence: number;
    };
    musicalElements: {
      structure: string[];
      lyricStyle: string[];
      literaryDevices: string[];
      narrative: string;
    };
    metadata: {
      language: string;
      explicitContent: boolean;
      complexity: 'simple' | 'medium' | 'complex';
      wordCount?: number;
    };
    summary: string;
    culturalContext?: string;
    recommendations: {
      similarArtists: string[];
      relatedThemes: string[];
      musicalInfluences: string[];
    };
  };
  confidence: number;
  error?: string;
}

export default function LyricsAnalyzer({ onAnalysisComplete }: LyricsAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [searchParams, setSearchParams] = useState({
    title: '',
    artist: '',
    includeThemes: true,
    includeSentiment: true,
    includeMusicalElements: true
  });

  const analyzeLyrics = async () => {
    if (!searchParams.title || !searchParams.artist) {
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/music/analyze-lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze lyrics');
      }

      const result = await response.json();
      setAnalysisResult(result);
      onAnalysisComplete?.(result);

      // Auto-save to memory if successful
      if (result.success) {
        await saveAnalysisToMemory(result);
      }
    } catch (error) {
      console.error('Error analyzing lyrics:', error);
      setAnalysisResult({
        success: false,
        error: 'Failed to analyze song. Please try again.',
        analysis: {} as any,
        confidence: 0
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveAnalysisToMemory = async (analysis: AnalysisResult) => {
    setIsSaving(true);
    try {
      const analysisId = `lyrics-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      await fetch('/api/memory/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: analysisId,
          text: JSON.stringify(analysis),
          namespace: 'lyrics-analysis',
          metadata: {
            title: analysis.analysis.song.title,
            artist: analysis.analysis.song.artist,
            genre: analysis.analysis.song.genre || 'unknown',
            sentiment: analysis.analysis.sentiment.overall,
            complexity: analysis.analysis.metadata.complexity,
            confidence: analysis.confidence.toString(),
            type: 'lyrics-analysis'
          }
        })
      });
    } catch (error) {
      console.error('Failed to save analysis:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      case 'mixed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-purple-100 text-purple-800';
      case 'complex': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          Song Lyrics Analyzer
          <div className="ml-auto">
            {analysisResult?.success && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => saveAnalysisToMemory(analysisResult)}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Analysis
              </Button>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Copyright-compliant analysis of song themes, sentiment, and musical elements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="elements">Musical Elements</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Search Form */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="song-title" className="block text-sm font-medium mb-2">Song Title</label>
                <input
                  id="song-title"
                  type="text"
                  value={searchParams.title}
                  onChange={(e) => setSearchParams({ ...searchParams, title: e.target.value })}
                  placeholder="Enter song title"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="artist-name" className="block text-sm font-medium mb-2">Artist</label>
                <input
                  id="artist-name"
                  type="text"
                  value={searchParams.artist}
                  onChange={(e) => setSearchParams({ ...searchParams, artist: e.target.value })}
                  placeholder="Enter artist name"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            {/* Analysis Options */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Analysis Options</h3>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={searchParams.includeThemes}
                    onChange={(e) => setSearchParams({ ...searchParams, includeThemes: e.target.checked })}
                  />
                  <span className="text-sm">Include Themes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={searchParams.includeSentiment}
                    onChange={(e) => setSearchParams({ ...searchParams, includeSentiment: e.target.checked })}
                  />
                  <span className="text-sm">Include Sentiment</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={searchParams.includeMusicalElements}
                    onChange={(e) => setSearchParams({ ...searchParams, includeMusicalElements: e.target.checked })}
                  />
                  <span className="text-sm">Include Musical Elements</span>
                </label>
              </div>
            </div>

            {/* Analyze Button */}
            <Button 
              onClick={analyzeLyrics} 
              disabled={isAnalyzing || !searchParams.title || !searchParams.artist}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Song...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze Song
                </>
              )}
            </Button>

            {/* Analysis Overview */}
            {analysisResult && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                {analysisResult.success ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-lg font-semibold">Analysis Complete</h3>
                      <Badge className="bg-green-100 text-green-800">
                        {(analysisResult.confidence * 100).toFixed(0)}% Confidence
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{analysisResult.analysis.song.title}</h4>
                        <p className="text-gray-600">by {analysisResult.analysis.song.artist}</p>
                        {analysisResult.analysis.song.album && (
                          <p className="text-sm text-gray-500">
                            Album: {analysisResult.analysis.song.album}
                            {analysisResult.analysis.song.year && ` (${analysisResult.analysis.song.year})`}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis.song.genre && (
                          <Badge variant="outline">{analysisResult.analysis.song.genre}</Badge>
                        )}
                        <Badge className={getSentimentColor(analysisResult.analysis.sentiment.overall)}>
                          {analysisResult.analysis.sentiment.overall}
                        </Badge>
                        <Badge className={getComplexityColor(analysisResult.analysis.metadata.complexity)}>
                          {analysisResult.analysis.metadata.complexity}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-700">{analysisResult.analysis.summary}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600">
                    <h3 className="font-semibold">Analysis Failed</h3>
                    <p className="text-sm">{analysisResult.error}</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="themes" className="space-y-4">
            {analysisResult?.success ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Thematic Analysis
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Primary Themes</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis.themes.primary.map((theme, index) => (
                          <Badge key={index} className="bg-purple-100 text-purple-800">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Secondary Themes</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis.themes.secondary.map((theme, index) => (
                          <Badge key={index} variant="outline">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Emotions</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis.themes.emotions.map((emotion, index) => (
                          <Badge key={index} className="bg-pink-100 text-pink-800">
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis.themes.subjects.map((subject, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {analysisResult.analysis.culturalContext && (
                  <div>
                    <h4 className="font-medium mb-2">Cultural Context</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">
                      {analysisResult.analysis.culturalContext}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Analyze a song first to see thematic analysis
              </div>
            )}
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-4">
            {analysisResult?.success ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    Sentiment Analysis
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(analysisResult.analysis.sentiment.overall)}`}>
                            {analysisResult.analysis.sentiment.overall}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Overall Sentiment</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {(analysisResult.analysis.sentiment.intensity * 100).toFixed(0)}%
                          </div>
                          <p className="text-sm text-gray-600">Intensity</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {(analysisResult.analysis.sentiment.confidence * 100).toFixed(0)}%
                          </div>
                          <p className="text-sm text-gray-600">Confidence</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Sentiment Breakdown</h4>
                    <div className="bg-gray-50 p-4 rounded">
                        <div 
                          className={`h-4 rounded-full transition-all duration-500 sentiment-bar-width ${
                            analysisResult.analysis.sentiment.overall === 'positive' ? 'bg-green-500' :
                            analysisResult.analysis.sentiment.overall === 'negative' ? 'bg-red-500' :
                            analysisResult.analysis.sentiment.overall === 'mixed' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`}
                          data-width={analysisResult.analysis.sentiment.intensity * 100}
                        ></div>
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        The song exhibits {analysisResult.analysis.sentiment.overall} sentiment with {
                          analysisResult.analysis.sentiment.intensity > 0.7 ? 'high' :
                          analysisResult.analysis.sentiment.intensity > 0.4 ? 'moderate' : 'low'
                        } intensity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Analyze a song first to see sentiment analysis
              </div>
            )}
          </TabsContent>

          <TabsContent value="elements" className="space-y-4">
            {analysisResult?.success ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Music className="h-5 w-5 text-blue-600" />
                    Musical Elements
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Song Structure</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis.musicalElements.structure.map((element, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800">
                            {element}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Lyrical Style</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis.musicalElements.lyricStyle.map((style, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800">
                            {style}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Literary Devices</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis.musicalElements.literaryDevices.map((device, index) => (
                          <Badge key={index} className="bg-purple-100 text-purple-800">
                            {device}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Language & Complexity</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{analysisResult.analysis.metadata.language}</Badge>
                        <Badge className={getComplexityColor(analysisResult.analysis.metadata.complexity)}>
                          {analysisResult.analysis.metadata.complexity}
                        </Badge>
                        {analysisResult.analysis.metadata.explicitContent && (
                          <Badge className="bg-red-100 text-red-800">Explicit</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {analysisResult.analysis.musicalElements.narrative && (
                    <div>
                      <h4 className="font-medium mb-2">Narrative Structure</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded">
                        {analysisResult.analysis.musicalElements.narrative}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Recommendations
                    </h4>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Similar Artists</h5>
                        <div className="space-y-1">
                          {analysisResult.analysis.recommendations.similarArtists.map((artist, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {artist}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-2">Related Themes</h5>
                        <div className="space-y-1">
                          {analysisResult.analysis.recommendations.relatedThemes.map((theme, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              {theme}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-2">Musical Influences</h5>
                        <div className="space-y-1">
                          {analysisResult.analysis.recommendations.musicalInfluences.map((influence, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center gap-1">
                              <Music className="h-3 w-3" />
                              {influence}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Analyze a song first to see musical elements analysis
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
