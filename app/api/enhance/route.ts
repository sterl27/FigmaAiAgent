import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { lyrics, lyricEnhancements } from '@/lib/db/schema/lyrics';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { eq } from 'drizzle-orm';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { lyricId, originalLyrics, style, customPrompt, userId } = await request.json();

    if (!originalLyrics || !userId) {
      return NextResponse.json(
        { error: 'Original lyrics and user ID are required' },
        { status: 400 }
      );
    }

    // Create enhancement prompt based on style or custom prompt
    let enhancementPrompt = '';
    
    if (style) {
      const stylePrompts = {
        'tyler-creator': 'Rewrite these lyrics in the style of Tyler, The Creator with unique metaphors, vivid imagery, unconventional flows, and colorful wordplay with unexpected comparisons.',
        'kendrick': 'Rewrite these lyrics in the style of Kendrick Lamar with complex narratives, social commentary, intricate rhyme schemes, and multi-layered storytelling.',
        'drake': 'Rewrite these lyrics in the style of Drake with melodic flow, emotional vulnerability, catchy hooks, and smooth delivery with relatable emotions.',
        'j-cole': 'Rewrite these lyrics in the style of J. Cole with introspective bars, personal storytelling, thoughtful delivery, and deep reflections on life experiences.',
        'complex-metaphor': 'Enhance these lyrics by adding sophisticated metaphors and wordplay, transforming simple concepts into intricate comparisons.',
        'emotional-depth': 'Enhance these lyrics by deepening the emotional resonance and vulnerability, adding more emotional impact to the message.',
      };
      
      enhancementPrompt = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts['complex-metaphor'];
    } else if (customPrompt) {
      enhancementPrompt = customPrompt;
    } else {
      return NextResponse.json(
        { error: 'Either style or custom prompt is required' },
        { status: 400 }
      );
    }

    // Generate enhanced lyrics using OpenAI
    const { text: enhancedLyrics } = await generateText({
      model: openai('gpt-4o'),
      prompt: `${enhancementPrompt}

Original lyrics:
${originalLyrics}

Enhanced lyrics:`,
    });

    // Save to database if lyricId is provided
    if (lyricId) {
      await db.insert(lyricEnhancements).values({
        originalLyricId: lyricId,
        enhancedContent: enhancedLyrics,
        style: style || 'custom',
        prompt: enhancementPrompt,
      });
    }

    return NextResponse.json({
      original: originalLyrics,
      enhanced: enhancedLyrics,
      style: style || 'custom',
    });

  } catch (error) {
    console.error('Enhancement error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance lyrics' },
      { status: 500 }
    );
  }
}
