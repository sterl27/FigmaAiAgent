import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, assistant_type, max_tokens, temperature } = body;

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Get the last user message for analysis
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    
    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      );
    }

    let response;

    switch (assistant_type) {
      case 'music_analysis':
        // Check if this looks like lyrics for analysis
        if (lastUserMessage.content.length > 50 && 
            (lastUserMessage.content.includes('\n') || 
             lastUserMessage.content.toLowerCase().includes('lyric'))) {
          
          // Call your existing lyrics analysis API
          try {
            const analysisResponse = await fetch('http://localhost:8000/api/analyze/simple', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                lyrics: lastUserMessage.content,
                title: 'User Submitted Lyrics',
                artist: 'Unknown',
                userId: 'chat_user'
              }),
            });

            if (analysisResponse.ok) {
              const analysisData = await analysisResponse.json();
              
              response = `## Lyric Analysis Results

**Complexity Analysis:**
- Overall Complexity: ${analysisData.complexity?.overall || 'N/A'}%
- Lexical Diversity: ${analysisData.complexity?.lexicalDiversity || 'N/A'}%
- Average Syllables: ${analysisData.complexity?.avgSyllables || 'N/A'}

**Energy & Style:**
- Persona: ${analysisData.energy?.persona || 'Unknown'}
- Energy Level: ${analysisData.energy?.level || 'N/A'}%
- Intensity: ${analysisData.energy?.intensity || 'Unknown'}

**Flow Analysis:**
- Flow Consistency: ${analysisData.flow?.consistency || 'N/A'}%
- Rhyme Variety: ${analysisData.flow?.rhymeVariety || 'Unknown'}
- Stress Points: ${analysisData.flow?.stressPoints || 'N/A'}

**Key Insights:**
- Total Words: ${analysisData.dashboard?.words || 'N/A'}
- Unique Words: ${analysisData.dashboard?.uniqueWords || 'N/A'}
- Rhyme Score: ${analysisData.dashboard?.rhymeScore || 'N/A'}%
- Emotion Score: ${analysisData.dashboard?.emotionScore || 'N/A'}%

**Suggestions:**
${analysisData.insights?.suggestions?.map((s: string) => `• ${s}`).join('\n') || '• Continue developing your unique style'}

This analysis shows ${analysisData.energy?.persona?.toLowerCase() || 'balanced'} characteristics with ${analysisData.energy?.intensity?.toLowerCase() || 'moderate'} intensity. The ${analysisData.flow?.rhymeVariety?.toLowerCase() || 'moderate'} rhyme scheme contributes to the overall flow.`;
            } else {
              throw new Error('Analysis API unavailable');
            }
          } catch (analysisError) {
            console.error('Analysis API Error:', analysisError);
            response = `I can see you've shared some lyrics! While I can't run the detailed analysis right now (analysis service unavailable), I can provide some general insights:

**Content Analysis:**
- Length: ${lastUserMessage.content.split(' ').length} words
- Structure: ${lastUserMessage.content.split('\n').length} lines
- Complexity: Appears to have ${lastUserMessage.content.match(/[.!?]/g)?.length || 0} sentences

**General Observations:**
- The lyrics show good structure and flow
- Consider the emotional journey of your lyrics
- Think about rhythm and meter for musical adaptation
- Experiment with different rhyme schemes

Would you like me to analyze specific aspects like rhyme scheme, themes, or suggest improvements?`;
          }
        } else {
          // Handle general music questions
          response = generateMusicResponse(lastUserMessage.content);
        }
        break;
        
      default:
        response = "I'm a specialized music analysis assistant. I can help you analyze lyrics, understand musical structures, and provide insights about songs and compositions. What would you like to explore?";
    }

    return NextResponse.json({
      response,
      model: 'music-assistant',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Assistant API Error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

function generateMusicResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  if (message.includes('chord') || message.includes('harmony')) {
    return `## Chord & Harmony Analysis

Based on your question about chords and harmony, here are some key insights:

**Common Chord Progressions:**
• I-V-vi-IV (very popular in pop music)
• ii-V-I (jazz standard)
• vi-IV-I-V (emotional progression)

**Harmony Tips:**
• Use seventh chords for sophistication
• Try modal interchange for color
• Consider voice leading between chords
• Experiment with inversions

Would you like me to analyze a specific chord progression or discuss harmony in a particular genre?`;
  }
  
  if (message.includes('rhythm') || message.includes('beat') || message.includes('tempo')) {
    return `## Rhythm & Tempo Analysis

**Rhythm Fundamentals:**
• Common time signatures: 4/4, 3/4, 6/8
• Syncopation adds interest and energy
• Polyrhythms create complexity

**Tempo Considerations:**
• 60-90 BPM: Ballads, slow songs
• 90-120 BPM: Mid-tempo, groove
• 120-140 BPM: Dance, pop
• 140+ BPM: High energy, electronic

**Rhythmic Elements:**
• Emphasize beats 1 and 3 for stability
• Use beats 2 and 4 for groove
• Add off-beat elements for dynamics

What specific rhythm or tempo questions do you have?`;
  }
  
  if (message.includes('melody') || message.includes('tune')) {
    return `## Melody Writing & Analysis

**Melodic Principles:**
• Use stepwise motion with occasional leaps
• Create melodic contour (shape/direction)
• Establish and resolve tension
• Consider the vocal range

**Melodic Techniques:**
• Sequence: repeat patterns at different pitches
• Motivic development: expand small ideas
• Call and response: create dialogue
• Use scales and modes for different moods

**Structure Tips:**
• Start simple, add complexity
• Create memorable hooks
• Use repetition with variation
• Build to climactic moments

Would you like to discuss melody in a specific key or style?`;
  }
  
  return `I'm here to help with music analysis and composition! I can assist with:

🎵 **Lyric Analysis** - Upload lyrics for detailed analysis
🎹 **Chord Progressions** - Harmony and chord theory
🥁 **Rhythm & Tempo** - Beat patterns and timing
🎤 **Melody Writing** - Melodic composition techniques
🎼 **Song Structure** - Arrangement and form
🎨 **Creative Process** - Songwriting tips and inspiration

What aspect of music would you like to explore? Feel free to share lyrics, ask about theory, or discuss your creative process!`;
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Custom Music Assistant API',
    capabilities: [
      'lyric_analysis',
      'music_theory',
      'composition_help',
      'song_structure'
    ]
  });
}
