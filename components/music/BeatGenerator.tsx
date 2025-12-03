'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Music, 
  Search, 
  Save, 
  Loader2,
  Play,
  Pause,
  History,
  Sparkles
} from 'lucide-react';

interface BeatGeneratorProps {
  onBeatGenerated?: (beatData: any) => void;
}

interface BeatData {
  id?: string;
  genre: string;
  tempo: number;
  complexity: string;
  pattern: {
    kick: number[];
    snare: number[];
    hihat: number[];
  };
  abletonInstructions: string[];
  description?: string;
  timestamp?: string;
}

export type { BeatData };

interface SimilarBeat {
  id: string;
  metadata: {
    genre: string;
    tempo: number;
    description: string;
  };
  score: number;
}

export default function BeatGenerator({ onBeatGenerated }: BeatGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedBeat, setGeneratedBeat] = useState<BeatData | null>(null);
  const [similarBeats, setSimilarBeats] = useState<SimilarBeat[]>([]);
  const [beatHistory, setBeatHistory] = useState<BeatData[]>([]);
  const [settings, setSettings] = useState({
    genre: 'hip-hop',
    tempo: 120,
    complexity: 'medium',
    description: ''
  });

  const genres = ['hip-hop', 'house', 'techno', 'trap', 'drum-and-bass', 'ambient'];
  const complexityLevels = ['simple', 'medium', 'complex'];

  // Load beat history on component mount
  useEffect(() => {
    loadBeatHistory();
  }, []);

  useEffect(() => {
    if (!isPlaying || !generatedBeat) return;

    const bpm = generatedBeat.tempo;
    const stepTime = (60 / bpm / 4) * 1000; // Time per 16th note in ms
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

    const playSound = (type: string) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      let frequency = 440;
      let decay = 0.1;
      switch (type) {
        case 'kick':
          frequency = 60; // Low frequency for kick
          decay = 0.2;
          break;
        case 'snare':
          frequency = 200; // Mid for snare
          decay = 0.15;
          break;
        case 'hihat':
          frequency = 800; // High for hihat
          decay = 0.05;
          osc.type = 'sawtooth'; // Rougher sound
          break;
      }
      osc.frequency.value = frequency;

      gain.gain.setValueAtTime(1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + decay);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + decay);
    };

    let currentStep = 0;
    const interval = setInterval(() => {
      if (generatedBeat.pattern.kick[currentStep]) playSound('kick');
      if (generatedBeat.pattern.snare[currentStep]) playSound('snare');
      if (generatedBeat.pattern.hihat[currentStep]) playSound('hihat');
      currentStep = (currentStep + 1) % 16;
    }, stepTime);

    return () => {
      clearInterval(interval);
      audioCtx.close();
    };
  }, [isPlaying, generatedBeat]);

  const loadBeatHistory = async () => {
    try {
      const response = await fetch('/api/memory/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'beat history',
          namespace: 'beats',
          topK: 10
        })
      });
      
      if (response.ok) {
        const { matches } = await response.json();
        const history = matches?.map((match: any) => {
          try {
            return JSON.parse(match.metadata.text);
          } catch {
            return null;
          }
        }).filter(Boolean) || [];
        setBeatHistory(history.slice(0, 5)); // Keep last 5
      }
    } catch (error) {
      console.error('Failed to load beat history:', error);
    }
  };

  const saveBeatToMemory = async (beatData: BeatData) => {
    setIsSaving(true);
    try {
      const beatId = `beat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      const beatWithId = { ...beatData, id: beatId, timestamp: new Date().toISOString() };
      
      await fetch('/api/memory/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: beatId,
          text: JSON.stringify(beatWithId),
          namespace: 'beats',
          metadata: {
            genre: beatData.genre,
            tempo: beatData.tempo.toString(),
            complexity: beatData.complexity,
            description: beatData.description || '',
            type: 'beat-pattern'
          }
        })
      });
      
      // Update local history
      setBeatHistory((prev: BeatData[]) => [beatWithId, ...prev.slice(0, 4)]);
      setGeneratedBeat(beatWithId);
      
    } catch (error) {
      console.error('Failed to save beat:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const findSimilarBeats = async (currentBeat: BeatData) => {
    setIsLoadingSimilar(true);
    try {
      const searchQuery = `${currentBeat.genre} beat ${currentBeat.tempo} BPM ${currentBeat.complexity} ${currentBeat.description || ''}`;
      
      const response = await fetch('/api/memory/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          namespace: 'beats',
          topK: 5
        })
      });
      
      if (response.ok) {
        const { matches } = await response.json();
        const similar = matches?.map((match: any) => ({
          id: match.id,
          metadata: match.metadata,
          score: match.score
        })) || [];
        setSimilarBeats(similar);
      }
    } catch (error) {
      console.error('Failed to find similar beats:', error);
    } finally {
      setIsLoadingSimilar(false);
    }
  };



  const generateBeat = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/music/beats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to generate beat');
      }

      const result = await response.json();
      if (result.success) {
        const beatData = {
          ...result.beatData,
          description: settings.description
        };
        
        setGeneratedBeat(beatData);
        onBeatGenerated?.(beatData);
        
        // Auto-save to Pinecone memory
        await saveBeatToMemory(beatData);
        
        // Find similar beats for recommendations
        await findSimilarBeats(beatData);
      }
    } catch (error) {
      console.error('Error generating beat:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderPattern = (pattern: number[], name: string, color: string) => (
    <div className="mb-4">
      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        {name}
      </h4>
      <div className="grid grid-cols-16 gap-1">
        {pattern.map((hit, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded ${
              hit ? 'bg-blue-500' : 'bg-gray-200'
            } flex items-center justify-center text-xs font-bold ${
              hit ? 'text-white' : 'text-gray-400'
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );

  // Export beat functionality
  const exportBeat = async (format: 'midi' | 'ableton') => {
    if (!generatedBeat) return;
    
    setIsExporting(true);
    try {
      const response = await fetch('/api/music/export', { // Changed endpoint to /api/music/export for consistency
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beat: generatedBeat,
          format
        }),
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `beat-${generatedBeat.id || 'generated'}.${format === 'midi' ? 'mid' : 'als'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Load a similar beat (updated to use new /api/memory/fetch endpoint)
  const loadSimilarBeat = async (beatId: string) => {
    try {
      const response = await fetch(`/api/memory/fetch?id=${beatId}&namespace=beats`);
      
      if (!response.ok) throw new Error('Failed to load beat');
      
      const data = await response.json();
      const beat = data.vector ? JSON.parse(data.vector.metadata.text) : null;
      
      if (beat) {
        setGeneratedBeat(beat);
        onBeatGenerated?.(beat);
      }
    } catch (error) {
      console.error('Error loading beat:', error);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          Alic3X Beat Generator
          <div className="ml-auto flex gap-2">
            {generatedBeat && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportBeat('midi')}
                  disabled={isExporting}
                >
                  {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Export MIDI
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportBeat('ableton')}
                  disabled={isExporting}
                >
                  {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Music className="h-4 w-4" />}
                  Export Ableton
                </Button>
              </>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Generate AI-powered beats with Pinecone memory, similarity matching, and direct Ableton Live export
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generator">Generator</TabsTrigger>
            <TabsTrigger value="pattern">Pattern</TabsTrigger>
            <TabsTrigger value="similar">Similar</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            {/* Beat Settings */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="genre-select" className="block text-sm font-medium mb-2">Genre</label>
                <select
                  id="genre-select"
                  value={settings.genre}
                  onChange={(e) => setSettings({ ...settings, genre: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="tempo-input" className="block text-sm font-medium mb-2">Tempo (BPM)</label>
                <input
                  id="tempo-input"
                  type="number"
                  min="60"
                  max="200"
                  value={settings.tempo}
                  onChange={(e) => setSettings({ ...settings, tempo: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="complexity-select" className="block text-sm font-medium mb-2">Complexity</label>
                <select
                  id="complexity-select"
                  value={settings.complexity}
                  onChange={(e) => setSettings({ ...settings, complexity: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  {complexityLevels.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="description-input" className="block text-sm font-medium mb-2">Description (Optional)</label>
                <input
                  id="description-input"
                  type="text"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  placeholder="e.g., dark atmospheric beat"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            {/* Generate Button */}
            <Button 
              onClick={generateBeat} 
              disabled={isGenerating || isSaving}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Beat...
                </>
              ) : isSaving ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Saving to Memory...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Beat with Alic3X
                </>
              )}
            </Button>

            {/* Beat Overview */}
            {generatedBeat && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">Generated Beat</h3>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                    {generatedBeat.genre}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {generatedBeat.tempo} BPM
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    {generatedBeat.complexity}
                  </span>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => findSimilarBeats(generatedBeat)}
                    disabled={isLoadingSimilar}
                  >
                    {isLoadingSimilar ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Find Similar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveBeatToMemory(generatedBeat)}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save to Memory
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pattern" className="space-y-4">
            {generatedBeat ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Beat Pattern Visualization</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-4">Pattern (16 steps)</h4>
                  {renderPattern(generatedBeat.pattern.kick, 'Kick', 'bg-red-500')}
                  {renderPattern(generatedBeat.pattern.snare, 'Snare', 'bg-green-500')}
                  {renderPattern(generatedBeat.pattern.hihat, 'Hi-Hat', 'bg-blue-500')}
                </div>

                {/* Ableton Instructions */}
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Ableton Live Implementation</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm bg-gray-50 p-4 rounded">
                    {generatedBeat.abletonInstructions.map((instruction: string, index: number) => (
                      <li key={index} className="text-gray-700">
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Generate a beat first to see the pattern visualization
              </div>
            )}
          </TabsContent>

          <TabsContent value="similar" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Similar Beats</h3>
              {generatedBeat && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => findSimilarBeats(generatedBeat)}
                  disabled={isLoadingSimilar}
                >
                  {isLoadingSimilar ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Refresh
                </Button>
              )}
            </div>
            
            {similarBeats.length > 0 ? (
              <div className="grid gap-3">
                {similarBeats.map((beat: SimilarBeat) => (
                  <div key={beat.id} className="border rounded-lg p-4 hover:bg-gray-50 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{beat.metadata.genre} Beat</h4>
                        <p className="text-sm text-gray-600">
                          {beat.metadata.tempo} BPM • {beat.metadata.description || 'No description'}
                        </p>
                        <span className="text-xs text-blue-600">
                          Similarity: {(beat.score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadSimilarBeat(beat.id)}
                      >
                        Load
                      </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {generatedBeat ? 'No similar beats found' : 'Generate a beat to find similar patterns'}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Beat History</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={loadBeatHistory}
              >
                <History className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            {beatHistory.length > 0 ? (
              <div className="grid gap-3">
                {beatHistory.map((beat: BeatData, index: number) => (
                  <div key={beat.id || index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{beat.genre} Beat</h4>
                        <p className="text-sm text-gray-600">
                          {beat.tempo} BPM • {beat.complexity} • {beat.description || 'No description'}
                        </p>
                        {beat.timestamp && (
                          <span className="text-xs text-gray-400">
                            {new Date(beat.timestamp).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setGeneratedBeat(beat);
                          onBeatGenerated?.(beat);
                        }}
                      >
                        Load
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No beat history found. Generate some beats to build your library!
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
