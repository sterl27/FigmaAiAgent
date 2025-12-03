import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { lyrics, lyricAnalysis } from '@/lib/db/schema/lyrics';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { syllable } from 'syllable';
import { analyzeLyricsAdvanced } from '@/lib/analyzeLyrics';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const analysisSchema = z.object({
  complexity: z.object({
    score: z.number().min(0).max(100),
    confidence: z.number().min(0).max(100),
    details: z.string(),
  }),
  rhyme: z.object({
    score: z.number().min(0).max(100),
    confidence: z.number().min(0).max(100),
    details: z.string(),
  }),
  flow: z.object({
    score: z.number().min(0).max(100),
    confidence: z.number().min(0).max(100),
    details: z.string(),
  }),
  energy: z.object({
    score: z.number().min(0).max(100),
    confidence: z.number().min(0).max(100),
    details: z.string(),
  }),
  structure: z.object({
    score: z.number().min(0).max(100),
    confidence: z.number().min(0).max(100),
    details: z.string(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const { lyrics: lyricsContent, title, artist, userId } = await request.json();

    if (!lyricsContent || !userId) {
      return NextResponse.json(
        { error: 'Lyrics content and user ID are required' },
        { status: 400 }
      );
    }

    // Save lyrics to database
    const [savedLyric] = await db.insert(lyrics).values({
      title: title || 'Untitled',
      artist: artist || 'Unknown',
      content: lyricsContent,
      userId,
    }).returning();

    // Perform advanced lyrics analysis
    const analysis = await analyzeLyricsAdvanced(lyricsContent);

    // Save analysis results to database (simplified for new structure)
    const analysisData = [
      { type: 'complexity', score: Math.round((analysis.complexity.creativity + analysis.complexity.diversity + analysis.complexity.emotion + analysis.complexity.structure) / 4), details: JSON.stringify(analysis.complexity) },
      { type: 'rhyme', score: analysis.flow.consistency, details: JSON.stringify(analysis.flow) },
      { type: 'flow', score: analysis.flow.consistency, details: JSON.stringify(analysis.flow) },
      { type: 'energy', score: analysis.energy.level, details: JSON.stringify(analysis.energy) },
      { type: 'structure', score: analysis.complexity.structure, details: JSON.stringify(analysis.complexity) },
    ];

    const analysisInserts = analysisData.map(data =>
      db.insert(lyricAnalysis).values({
        lyricId: savedLyric.id,
        analysisType: data.type,
        score: data.score,
        confidence: 85, // Default confidence for advanced analysis
        details: data.details,
      })
    );

    await Promise.all(analysisInserts);

    return NextResponse.json({
      lyricId: savedLyric.id,
      analysis: {
        complexity: analysis.complexity,
        energy: analysis.energy,
        flow: analysis.flow,
        dashboard: analysis.dashboard,
        insights: analysis.insights,
        metadata: analysis.metadata
      },
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze lyrics' },
      { status: 500 }
    );
  }
}
