import { NextRequest, NextResponse } from 'next/server';
import { abletonTools } from '@/lib/music/alic3x-integration';

export async function POST(request: NextRequest) {
  try {
    const { concept, level, key, interactive } = await request.json();

    if (!concept || !level) {
      return NextResponse.json(
        { error: 'Concept and level are required' },
        { status: 400 }
      );
    }

    // Validate level
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { error: 'Level must be beginner, intermediate, or advanced' },
        { status: 400 }
      );
    }

    // Generate music theory lesson
    const result = await abletonTools.teachMusicConcept.execute({
      concept,
      level,
      key: key || 'C',
      interactive: interactive || false
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in music theory endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
