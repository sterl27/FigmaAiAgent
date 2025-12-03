import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { lyrics, lyricAnalysis, lyricEnhancements } from '@/lib/db/schema/lyrics';
import { eq, inArray } from 'drizzle-orm';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'all', 'analyzed', 'enhanced', 'bookmarked'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get all lyrics for the user
    const userLyrics = await db
      .select()
      .from(lyrics)
      .where(eq(lyrics.userId, userId))
      .orderBy(lyrics.createdAt);

    // Get all analyses for these lyrics
    const lyricIds = userLyrics.map(l => l.id);
    const analyses = lyricIds.length > 0 
      ? await db
          .select()
          .from(lyricAnalysis)
          .where(inArray(lyricAnalysis.lyricId, lyricIds))
      : [];

    // Get all enhancements for these lyrics
    const enhancements = lyricIds.length > 0
      ? await db
          .select()
          .from(lyricEnhancements)
          .where(inArray(lyricEnhancements.originalLyricId, lyricIds))
      : [];

    // Combine data
    const libraryItems = userLyrics.map(lyric => {
      const lyricAnalyses = analyses.filter(a => a.lyricId === lyric.id);
      const lyricEnhancements = enhancements.filter(e => e.originalLyricId === lyric.id);

      // Group analyses by type
      const scores = lyricAnalyses.reduce((acc, analysis) => {
        acc[analysis.analysisType] = analysis.score;
        return acc;
      }, {} as Record<string, number>);

      return {
        id: lyric.id,
        title: lyric.title,
        artist: lyric.artist,
        content: lyric.content,
        createdAt: lyric.createdAt,
        type: lyricAnalyses.length > 0 ? 'analyzed' : 'original',
        scores: Object.keys(scores).length > 0 ? scores : undefined,
        enhancements: lyricEnhancements.map(e => ({
          id: e.id,
          style: e.style,
          content: e.enhancedContent,
          createdAt: e.createdAt,
          isBookmarked: e.isBookmarked,
        })),
      };
    });

    // Add enhanced lyrics as separate items
    const enhancedItems = enhancements.map(enhancement => {
      const originalLyric = userLyrics.find(l => l.id === enhancement.originalLyricId);
      return {
        id: `enhanced-${enhancement.id}`,
        title: `${originalLyric?.title || 'Untitled'} (Enhanced)`,
        artist: originalLyric?.artist || 'Unknown',
        content: enhancement.enhancedContent,
        createdAt: enhancement.createdAt,
        type: 'enhanced' as const,
        enhancementStyle: enhancement.style,
        isBookmarked: enhancement.isBookmarked,
        originalId: enhancement.originalLyricId,
      };
    });

    const allItems = [...libraryItems, ...enhancedItems];

    // Filter by type if specified
    let filteredItems = allItems;
    if (type && type !== 'all') {
      if (type === 'bookmarked') {
        filteredItems = allItems.filter(item => 
          'isBookmarked' in item ? item.isBookmarked : false
        );
      } else {
        filteredItems = allItems.filter(item => item.type === type);
      }
    }

    return NextResponse.json(filteredItems);

  } catch (error) {
    console.error('Library fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch library' },
      { status: 500 }
    );
  }
}
