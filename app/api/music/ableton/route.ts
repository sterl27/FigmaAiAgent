import { NextRequest, NextResponse } from 'next/server';
import { abletonTools } from '@/lib/music/alic3x-integration';

export async function POST(request: NextRequest) {
  try {
    const { command, track, device, parameter, value } = await request.json();

    if (!command) {
      return NextResponse.json(
        { error: 'Command is required' },
        { status: 400 }
      );
    }

    // Execute Ableton control command
    const result = await abletonTools.controlAbleton.execute({
      command,
      track,
      device,
      parameter,
      value
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in Ableton control endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
