import { NextRequest, NextResponse } from 'next/server';
import { handleAlic3XChat } from '@/lib/music/alic3x-integration';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { messages, model = 'gpt-4o-mini' } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Validate model parameter
    const validModels = ['gpt-4o-mini', 'gemini-2.0-flash-exp', 'claude-3-5-sonnet-20241022'];
    const selectedModel = validModels.includes(model) ? model : 'gpt-4o-mini';

    // Stream the response using Alic3X integration
    const result = await handleAlic3XChat(messages, selectedModel);

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in music chat endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
