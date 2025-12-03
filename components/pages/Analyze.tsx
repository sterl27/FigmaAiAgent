'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textArea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Brain, Music, Zap, Target, BarChart3 } from 'lucide-react';

interface AnalysisResult {
  type: string;
  score: number;
  confidence: number;
  details: string;
  icon: React.ComponentType<any>;
  color: string;
}

export function Analyze() {
  const [lyrics, setLyrics] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);

  const handleAnalyze = async () => {
    if (!lyrics.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock results
      const mockResults: AnalysisResult[] = [
        { type: 'Complexity', score: 85, confidence: 92, details: 'Rich metaphors and intricate wordplay detected', icon: Brain, color: 'text-purple-500' },
        { type: 'Rhyme', score: 78, confidence: 88, details: 'Strong rhyme scheme with creative internal rhymes', icon: Music, color: 'text-blue-500' },
        { type: 'Flow', score: 92, confidence: 95, details: 'Excellent rhythm and natural syllable patterns', icon: Zap, color: 'text-green-500' },
        { type: 'Energy', score: 76, confidence: 83, details: 'Moderate energy with dynamic emotional shifts', icon: Target, color: 'text-orange-500' },
        { type: 'Structure', score: 89, confidence: 91, details: 'Well-organized verses with clear progression', icon: BarChart3, color: 'text-red-500' },
      ];
      
      setAnalysisResults(mockResults);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-2">Analyze Lyrics 🔍</h2>
        <p className="text-muted-foreground">
          Get AI-powered insights into your lyrical content
        </p>
      </motion.div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Song Details</CardTitle>
            <CardDescription>Enter your lyrics for analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Song title"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  placeholder="Artist name"
                  value={artist}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArtist(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lyrics">Lyrics</Label>
              <Textarea
                id="lyrics"
                placeholder="Paste your lyrics here..."
                className="min-h-[200px] resize-none"
                value={lyrics}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLyrics(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleAnalyze} 
              disabled={!lyrics.trim() || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze Lyrics
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>AI-powered lyrical insights</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="detailed">Detailed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4 mt-4">
                  {analysisResults.map((result, index) => {
                    const Icon = result.icon;
                    return (
                      <motion.div
                        key={result.type}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className={`w-5 h-5 ${result.color}`} />
                            <span className="font-medium">{result.type}</span>
                          </div>
                          <span className="text-2xl font-bold">{result.score}%</span>
                        </div>
                        <Progress value={result.score} className="h-2" />
                        <p className="text-sm text-muted-foreground">{result.details}</p>
                      </motion.div>
                    );
                  })}
                </TabsContent>
                
                <TabsContent value="detailed" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 gap-4">
                    {analysisResults.map((result, index) => {
                      const Icon = result.icon;
                      return (
                        <Card key={result.type}>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <Icon className={`w-6 h-6 ${result.color}`} />
                              <div>
                                <h4 className="font-semibold">{result.type}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Confidence: {result.confidence}%
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Score</span>
                                <span className="font-bold">{result.score}%</span>
                              </div>
                              <Progress value={result.score} className="h-2" />
                              <p className="text-sm mt-2">{result.details}</p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
