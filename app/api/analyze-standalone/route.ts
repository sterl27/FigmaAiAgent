import { NextRequest, NextResponse } from 'next/server';
import { syllable } from 'syllable';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { lyrics } = await request.json();

    if (!lyrics || typeof lyrics !== 'string') {
      return NextResponse.json({ error: 'Invalid lyrics input' }, { status: 400 });
    }

    const result = await analyzeLyricsStandalone(lyrics);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze lyrics' },
      { status: 500 }
    );
  }
}

async function analyzeLyricsStandalone(lyrics: string) {
  // Basic text analysis
  const words = lyrics.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
  const lexicalDiversity = +(uniqueWords / wordCount * 100).toFixed(1);
  
  // Syllable analysis
  const totalSyllables = words.reduce((sum, word) => {
    const cleanWord = word.replace(/[^\w]/g, '');
    return sum + syllable(cleanWord);
  }, 0);
  const avgSyllables = +(totalSyllables / wordCount).toFixed(2);
  
  // Energy indicators
  const exclamationCount = (lyrics.match(/[!]/g) || []).length;
  const capsWords = (lyrics.match(/\b[A-Z]{2,}\b/g) || []).length;
  const questionMarks = (lyrics.match(/[?]/g) || []).length;
  const energyLevel = Math.min(100, exclamationCount * 8 + capsWords * 5 + questionMarks * 3 + (avgSyllables > 2.5 ? 15 : 0));
  
  // Rhyme detection (basic)
  const lines = lyrics.split('\n').filter(line => line.trim().length > 0);
  const endWords = lines.map(line => {
    const words = line.trim().split(/\s+/);
    return words[words.length - 1]?.replace(/[^\w]/g, '').toLowerCase() || '';
  });
  
  // Simple rhyme detection
  const rhymeCount = endWords.reduce((count, word, index) => {
    if (index === 0) return count;
    const prev = endWords[index - 1];
    if (word.length > 2 && prev.length > 2) {
      const wordSuffix = word.slice(-2);
      const prevSuffix = prev.slice(-2);
      if (wordSuffix === prevSuffix) return count + 1;
    }
    return count;
  }, 0);
  
  const rhymeScore = Math.min(100, (rhymeCount / Math.max(lines.length - 1, 1)) * 100);
  
  // Emotion indicators
  const emotionalWords = [
    'love', 'hate', 'pain', 'joy', 'sad', 'happy', 'angry', 'mad', 'heart', 'soul',
    'cry', 'laugh', 'dream', 'hope', 'fear', 'tears', 'smile', 'dark', 'light', 'fire'
  ];
  const emotionCount = emotionalWords.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return count + (lyrics.match(regex) || []).length;
  }, 0);
  const emotionScore = Math.min(100, emotionCount * 10 + (exclamationCount * 5));
  
  // Complexity based on vocabulary diversity and sentence structure
  const complexityScore = Math.min(100, 
    lexicalDiversity * 0.6 + 
    (avgSyllables > 2 ? 20 : avgSyllables > 1.5 ? 10 : 0) +
    (uniqueWords > wordCount * 0.7 ? 20 : 0)
  );
  
  // Flow consistency (based on syllable patterns)
  const syllableCounts = lines.map(line => {
    const lineWords = line.split(/\s+/).filter(w => w.length > 0);
    return lineWords.reduce((sum, word) => sum + syllable(word.replace(/[^\w]/g, '')), 0);
  });
  
  const avgLineSyllables = syllableCounts.length > 0 ? 
    syllableCounts.reduce((sum, count) => sum + count, 0) / syllableCounts.length : 0;
  
  const syllableVariance = syllableCounts.length > 1 ? 
    syllableCounts.reduce((sum, count) => sum + Math.pow(count - avgLineSyllables, 2), 0) / syllableCounts.length : 0;
  
  const flowConsistency = Math.max(0, 100 - (syllableVariance * 2));
  
  // Determine persona
  let persona = 'Balanced';
  if (energyLevel > 80) persona = 'Energetic';
  else if (energyLevel < 30) persona = 'Calm';
  else if (emotionScore > 70) persona = 'Emotional';
  else if (complexityScore > 80) persona = 'Intellectual';
  
  // Determine intensity
  let intensity = 'Moderate';
  if (energyLevel > 85) intensity = 'High';
  else if (energyLevel > 60) intensity = 'Moderate';
  else intensity = 'Low';
  
  // Rhyme variety assessment
  let rhymeVariety = 'Simple';
  if (rhymeScore > 70) rhymeVariety = 'Complex';
  else if (rhymeScore > 40) rhymeVariety = 'Moderate';
  
  return {
    complexity: {
      creativity: Math.round(complexityScore * 0.8 + (uniqueWords / wordCount * 100) * 0.2),
      diversity: Math.round(lexicalDiversity),
      emotion: Math.round(emotionScore),
      structure: Math.round(flowConsistency * 0.7 + (lines.length > 4 ? 20 : lines.length * 5)),
    },
    energy: {
      persona,
      level: Math.round(energyLevel),
      intensity,
    },
    flow: {
      consistency: Math.round(flowConsistency),
      avgSyllables,
      stressPoints: Math.floor(avgSyllables * 1.4),
      rhymeVariety,
    },
    dashboard: {
      sessions: 1,
      words: wordCount,
      minutes: Math.ceil(wordCount / 150), // Average reading speed
      avgEnergy: Math.round(energyLevel),
      favoritePersona: persona,
      lexicalDiversity: Math.round(lexicalDiversity),
      uniqueWords,
      totalSyllables,
      rhymeScore: Math.round(rhymeScore),
      emotionScore: Math.round(emotionScore),
    },
    metadata: {
      analysisDate: new Date().toISOString(),
      model: 'computational-v1',
      version: '1.0.0',
    }
  };
}
