import { syllable } from 'syllable';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// Advanced lyric analysis schema
const lyricsAnalysisSchema = z.object({
  complexity: z.object({
    creativity: z.number().min(0).max(100).describe('Novelty and originality of language, metaphors, and concepts'),
    diversity: z.number().min(0).max(100).describe('Variety in vocabulary, themes, and linguistic patterns'),
    emotion: z.number().min(0).max(100).describe('Emotional depth and expressiveness'),
    structure: z.number().min(0).max(100).describe('Organization, coherence, and narrative flow'),
  }),
  energy: z.object({
    persona: z.string().describe('Energy persona (e.g., Energetic, Calm, Aggressive, Melancholic)'),
    level: z.number().min(0).max(100).describe('Overall energy intensity'),
    intensity: z.string().describe('Intensity classification (Low, Moderate, High, Extreme)'),
  }),
  flow: z.object({
    consistency: z.number().min(0).max(100).describe('Rhythmic and syllabic consistency'),
    avgSyllables: z.number().describe('Average syllables per word'),
    stressPoints: z.number().describe('Number of stressed syllables or emphasis points'),
    rhymeVariety: z.string().describe('Rhyme pattern variety (Simple, Moderate, Complex, Advanced)'),
  }),
  insights: z.object({
    themes: z.array(z.string()).describe('Main themes and topics'),
    metaphors: z.array(z.string()).describe('Notable metaphors and imagery'),
    strengths: z.array(z.string()).describe('Lyrical strengths'),
    suggestions: z.array(z.string()).describe('Areas for improvement'),
  })
});

export async function analyzeLyricsAdvanced(lyrics: string) {
  try {
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
    const energyLevel = Math.min(100, exclamationCount * 8 + capsWords * 5 + (avgSyllables > 2 ? 10 : 0));
    
    // Rhyme detection (basic)
    const lines = lyrics.split('\n').filter(line => line.trim().length > 0);
    const endWords = lines.map(line => {
      const words = line.trim().split(/\s+/);
      return words[words.length - 1]?.replace(/[^\w]/g, '').toLowerCase() || '';
    });
    
    // Use GPT for advanced semantic analysis
    const gptAnalysis = await generateObject({
      model: openai('gpt-4o-mini'),
      system: `You are an expert in lyrical analysis. Analyze the following lyrics for creativity, emotion, themes, and artistic merit. Focus on:
      - Metaphorical and figurative language usage
      - Emotional depth and authenticity
      - Thematic coherence and meaning
      - Artistic and poetic qualities
      - Flow and rhythm considerations
      
      Be specific and constructive in your analysis.`,
      prompt: `Analyze these lyrics:\n\n"${lyrics}"\n\nProvide detailed scores and insights.`,
      schema: lyricsAnalysisSchema,
    });

    // Combine AI analysis with computational metrics
    const result = {
      complexity: {
        creativity: gptAnalysis.object.complexity.creativity,
        diversity: Math.min(lexicalDiversity, 85) + (gptAnalysis.object.complexity.diversity * 0.15),
        emotion: gptAnalysis.object.complexity.emotion,
        structure: gptAnalysis.object.complexity.structure,
      },
      energy: {
        persona: gptAnalysis.object.energy.persona,
        level: Math.max(energyLevel, gptAnalysis.object.energy.level * 0.7),
        intensity: gptAnalysis.object.energy.intensity,
      },
      flow: {
        consistency: gptAnalysis.object.flow.consistency,
        avgSyllables,
        stressPoints: Math.floor(avgSyllables * 1.4),
        rhymeVariety: gptAnalysis.object.flow.rhymeVariety,
      },
      dashboard: {
        sessions: 1, // This would be tracked per user
        words: wordCount,
        minutes: Math.ceil(wordCount / 30), // Rough reading time
        avgEnergy: Math.round((energyLevel + gptAnalysis.object.energy.level) / 2),
        favoritePersona: gptAnalysis.object.energy.persona,
        lexicalDiversity,
        uniqueWords,
        totalSyllables,
      },
      insights: gptAnalysis.object.insights,
      metadata: {
        analysisDate: new Date().toISOString(),
        model: 'gpt-4o-mini',
        version: '1.0.0',
      }
    };

    return result;
  } catch (error) {
    console.error('Error in advanced lyrics analysis:', error);
    
    // Fallback to basic analysis if GPT fails
    return getFallbackAnalysis(lyrics);
  }
}

function getFallbackAnalysis(lyrics: string) {
  const words = lyrics.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
  const lexicalDiversity = +(uniqueWords / wordCount * 100).toFixed(1);
  
  const totalSyllables = words.reduce((sum, word) => {
    const cleanWord = word.replace(/[^\w]/g, '');
    return sum + syllable(cleanWord);
  }, 0);
  const avgSyllables = +(totalSyllables / wordCount).toFixed(2);
  
  const exclamationCount = (lyrics.match(/[!]/g) || []).length;
  const capsWords = (lyrics.match(/\b[A-Z]{2,}\b/g) || []).length;
  const energyLevel = Math.min(100, exclamationCount * 8 + capsWords * 5);
  
  return {
    complexity: {
      creativity: 60 + Math.min(30, lexicalDiversity),
      diversity: Math.min(85, lexicalDiversity * 1.2),
      emotion: 65 + (exclamationCount > 0 ? 15 : 0),
      structure: 70,
    },
    energy: {
      persona: energyLevel > 70 ? 'Energetic' : energyLevel > 40 ? 'Moderate' : 'Calm',
      level: energyLevel,
      intensity: energyLevel > 80 ? 'High' : energyLevel > 50 ? 'Moderate' : 'Low',
    },
    flow: {
      consistency: 75,
      avgSyllables,
      stressPoints: Math.floor(avgSyllables * 1.4),
      rhymeVariety: avgSyllables > 2.5 ? 'Complex' : 'Moderate',
    },
    dashboard: {
      sessions: 1,
      words: wordCount,
      minutes: Math.ceil(wordCount / 30),
      avgEnergy: energyLevel,
      favoritePersona: energyLevel > 70 ? 'Energetic' : 'Balanced',
      lexicalDiversity,
      uniqueWords,
      totalSyllables,
    },
    insights: {
      themes: ['General themes (AI analysis unavailable)'],
      metaphors: ['Metaphor analysis unavailable'],
      strengths: ['Basic analysis completed'],
      suggestions: ['For detailed analysis, ensure GPT integration is working'],
    },
    metadata: {
      analysisDate: new Date().toISOString(),
      model: 'fallback',
      version: '1.0.0',
    }
  };
}

// Pinecone integration for session logging (optional)
export async function logAnalysisSession(userId: string, lyricsId: string, analysis: any) {
  try {
    // This would integrate with Pinecone to store user sessions
    // For now, we'll just log to console
    console.log(`Analysis session logged for user ${userId}, lyrics ${lyricsId}`);
    
    // Future implementation:
    // const embedding = await generateEmbedding(lyrics)
    // await pinecone.upsert([{
    //   id: `${userId}-${lyricsId}-${Date.now()}`,
    //   values: embedding,
    //   metadata: { userId, lyricsId, analysis: JSON.stringify(analysis) }
    // }])
    
    return { success: true };
  } catch (error) {
    console.error('Error logging analysis session:', error);
    return { success: false, error };
  }
}

export default analyzeLyricsAdvanced;
