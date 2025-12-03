import { NextRequest, NextResponse } from 'next/server';
import { abletonTools } from '@/lib/music/alic3x-integration';

export async function POST(request: NextRequest) {
  try {
    const { genre, tempo, complexity, description } = await request.json();

    if (!genre || !tempo) {
      return NextResponse.json(
        { error: 'Genre and tempo are required' },
        { status: 400 }
      );
    }

    // Validate tempo range
    if (tempo < 60 || tempo > 200) {
      return NextResponse.json(
        { error: 'Tempo must be between 60 and 200 BPM' },
        { status: 400 }
      );
    }

    // Generate beat using Alic3X tools
    const result = await abletonTools.generateBeat.execute({
      genre,
      tempo,
      complexity: complexity || 'medium',
      description
    }, { toolCallId: 'manual-call', messages: [] });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in beat generation endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
