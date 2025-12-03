'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LyricsAnalysisProps {
  onAnalysisComplete?: (analysis: any) => void;
}

export default function LyricsAnalyzer({ onAnalysisComplete }: LyricsAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [searchParams, setSearchParams] = useState({
    title: '',
    artist: ''
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
    } catch (error) {
      console.error('Error analyzing lyrics:', error);
      setAnalysisResult({
        success: false,
        error: 'Failed to analyze song. Please try again.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Song Lyrics Analyzer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <Button 
          onClick={analyzeLyrics} 
          disabled={isAnalyzing || !searchParams.title || !searchParams.artist}
          className="w-full"
        >
          {isAnalyzing ? 'Analyzing Song...' : 'Analyze Song'}
        </Button>

        {analysisResult && (
          <div className="mt-6 p-4 border rounded-lg">
            {analysisResult.success ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">Analysis Complete</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">{analysisResult.analysis.song.title}</h4>
                    <p className="text-gray-600">by {analysisResult.analysis.song.artist}</p>
                  </div>
                  
                  {analysisResult.analysis.themes && (
                    <div>
                      <h4 className="font-medium mb-2">Primary Themes</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis.themes.primary.map((theme: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysisResult.analysis.sentiment && (
                    <div>
                      <h4 className="font-medium mb-2">Sentiment</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {analysisResult.analysis.sentiment.overall}
                      </span>
                    </div>
                  )}
                  
                  {analysisResult.analysis.summary && (
                    <div>
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-gray-700">{analysisResult.analysis.summary}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-red-600">
                <h3 className="font-semibold">Analysis Failed</h3>
                <p>{analysisResult.error}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
