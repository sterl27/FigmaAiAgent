'use client';

import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function* streamOpenAIResponse(query: string) {
  try {
    const { textStream } = await streamText({
      model: openai('gpt-4o'),
      system: `You are Musaix, an AI assistant specialized in lyric analysis and music understanding. 
      
You help users:
- Analyze lyrics for complexity, rhyme schemes, flow, energy, and structure
- Enhance and improve lyrical content
- Understand the meaning and context of songs
- Provide insights into songwriting techniques

Be conversational, helpful, and enthusiastic about music and lyrics. Keep responses concise but informative.`,
      prompt: query,
    });

    for await (const chunk of textStream) {
      yield chunk;
    }
  } catch (error) {
    console.error('OpenAI streaming error:', error);
    yield "I'm sorry, I encountered an error. Please try again.";
  }
}

export async function analyzeQuery(query: string): Promise<'analysis' | 'enhancement' | 'general'> {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('analyze') || lowerQuery.includes('analysis') || lowerQuery.includes('breakdown')) {
    return 'analysis';
  }
  
  if (lowerQuery.includes('enhance') || lowerQuery.includes('improve') || lowerQuery.includes('rewrite') || lowerQuery.includes('style')) {
    return 'enhancement';
  }
  
  return 'general';
}
