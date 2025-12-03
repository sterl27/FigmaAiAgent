'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BeatGeneratorProps {
  onBeatGenerated?: (beatData: any) => void;
}

export interface BeatData {
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

export default function BeatGeneratorSimple({ onBeatGenerated }: BeatGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentBeat, setCurrentBeat] = useState<BeatData | null>(null);

  const generateBeat = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newBeat: BeatData = {
      id: Date.now().toString(),
      genre: 'Hip-Hop',
      tempo: 120,
      complexity: 'Medium',
      pattern: {
        kick: [0, 4, 8, 12],
        snare: [4, 12],
        hihat: [2, 6, 10, 14]
      },
      abletonInstructions: [
        'Create new Live set at 120 BPM',
        'Add drum rack to track 1',
        'Load hip-hop samples',
        'Program pattern as shown'
      ],
      description: 'Classic hip-hop beat with trap influences',
      timestamp: new Date().toISOString()
    };
    
    setCurrentBeat(newBeat);
    setIsGenerating(false);
    onBeatGenerated?.(newBeat);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Beat Generator</CardTitle>
        <CardDescription>Generate AI-powered drum patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={generateBeat} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? 'Generating...' : 'Generate Beat'}
        </Button>
        
        {currentBeat && (
          <div className="space-y-2">
            <h3 className="font-medium">Generated Beat:</h3>
            <p className="text-sm text-gray-600">
              {currentBeat.genre} • {currentBeat.tempo} BPM • {currentBeat.complexity}
            </p>
            <p className="text-sm">{currentBeat.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
