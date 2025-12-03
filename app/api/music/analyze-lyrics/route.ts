import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface LyricsAnalysisRequest {
  title: string;
  artist: string;
  includeThemes?: boolean;
  includeSentiment?: boolean;
  includeMusicalElements?: boolean;
}

interface LyricsAnalysisResult {
  success: boolean;
  analysis: {
    song: {
      title: string;
      artist: string;
      album?: string;
      year?: string;
      genre?: string;
    };
    themes: {
      primary: string[];
      secondary: string[];
      emotions: string[];
      subjects: string[];
    };
    sentiment: {
      overall: 'positive' | 'negative' | 'neutral' | 'mixed';
      intensity: number; // 0-1
      confidence: number; // 0-1
    };
    musicalElements: {
      structure: string[];
      lyricStyle: string[];
      literaryDevices: string[];
      narrative: string;
    };
    metadata: {
      language: string;
      explicitContent: boolean;
      complexity: 'simple' | 'medium' | 'complex';
      wordCount?: number;
    };
    summary: string;
    culturalContext?: string;
    recommendations: {
      similarArtists: string[];
      relatedThemes: string[];
      musicalInfluences: string[];
    };
  };
  confidence: number;
  error?: string;
}

// Copyright-compliant web search for song information
async function searchSongInfo(title: string, artist: string): Promise<any> {
  try {
    // Use GPT to search for publicly available information about the song
    const searchPrompt = `Search for publicly available information about the song "${title}" by ${artist}. 
    Focus on:
    - Song metadata (album, year, genre)
    - Critical analysis and reviews
    - Themes and meanings discussed in music journalism
    - Cultural impact and context
    - Musical style and influences
    
    Do NOT reproduce copyrighted lyrics. Only provide factual information, analysis, and publicly discussed interpretations.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a music researcher specializing in song analysis. Provide factual information and critical analysis about songs without reproducing copyrighted lyrics."
        },
        {
          role: "user",
          content: searchPrompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error searching song info:', error);
    return '';
  }
}

// Analyze song themes and elements based on publicly available information
async function analyzeSongContent(songInfo: string, title: string, artist: string): Promise<any> {
  try {
    const analysisPrompt = `Based on the following publicly available information about "${title}" by ${artist}, provide a comprehensive analysis:

${songInfo}

Please analyze:
1. Primary and secondary themes
2. Emotional content and sentiment
3. Musical and lyrical style elements
4. Cultural context and significance
5. Literary devices and narrative structure (if discussed in reviews/analysis)
6. Language and complexity level
7. Similar artists and influences

Provide your analysis in JSON format matching this structure:
{
  "themes": {
    "primary": ["theme1", "theme2"],
    "secondary": ["theme3", "theme4"],
    "emotions": ["emotion1", "emotion2"],
    "subjects": ["subject1", "subject2"]
  },
  "sentiment": {
    "overall": "positive|negative|neutral|mixed",
    "intensity": 0.0-1.0,
    "confidence": 0.0-1.0
  },
  "musicalElements": {
    "structure": ["verse-chorus", "bridge"],
    "lyricStyle": ["narrative", "abstract"],
    "literaryDevices": ["metaphor", "imagery"],
    "narrative": "description of story/message"
  },
  "metadata": {
    "language": "english",
    "explicitContent": false,
    "complexity": "simple|medium|complex"
  },
  "summary": "comprehensive summary",
  "culturalContext": "cultural significance",
  "recommendations": {
    "similarArtists": ["artist1", "artist2"],
    "relatedThemes": ["theme1", "theme2"],
    "musicalInfluences": ["influence1", "influence2"]
  }
}

Focus on analysis and interpretation, not lyric reproduction.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert music analyst. Provide detailed analysis based on publicly available information without reproducing copyrighted content. Always respond with valid JSON."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.2,
    });

    const analysisText = response.choices[0]?.message?.content || '{}';
    
    // Parse JSON response
    try {
      return JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Error parsing analysis JSON:', parseError);
      // Return default structure if parsing fails
      return {
        themes: { primary: [], secondary: [], emotions: [], subjects: [] },
        sentiment: { overall: 'neutral', intensity: 0.5, confidence: 0.5 },
        musicalElements: { structure: [], lyricStyle: [], literaryDevices: [], narrative: '' },
        metadata: { language: 'unknown', explicitContent: false, complexity: 'medium' },
        summary: 'Analysis unavailable',
        culturalContext: '',
        recommendations: { similarArtists: [], relatedThemes: [], musicalInfluences: [] }
      };
    }
  } catch (error) {
    console.error('Error analyzing song content:', error);
    throw error;
  }
}

// Get additional song metadata
async function getSongMetadata(title: string, artist: string): Promise<any> {
  try {
    const metadataPrompt = `Provide factual metadata for the song "${title}" by ${artist}:
    - Album name
    - Release year
    - Genre(s)
    - Chart performance (if notable)
    - Awards or recognition
    - Production credits (if publicly known)
    
    Respond in JSON format:
    {
      "album": "album name",
      "year": "year",
      "genre": "genre",
      "chartPerformance": "description",
      "awards": ["award1", "award2"],
      "producers": ["producer1", "producer2"]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a music database specialist. Provide accurate, factual metadata about songs."
        },
        {
          role: "user",
          content: metadataPrompt
        }
      ],
      max_tokens: 500,
      temperature: 0.1,
    });

    const metadataText = response.choices[0]?.message?.content || '{}';
    
    try {
      return JSON.parse(metadataText);
    } catch (parseError) {
      return { album: '', year: '', genre: '', chartPerformance: '', awards: [], producers: [] };
    }
  } catch (error) {
    console.error('Error getting song metadata:', error);
    return { album: '', year: '', genre: '', chartPerformance: '', awards: [], producers: [] };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: LyricsAnalysisRequest = await request.json();
    const { title, artist, includeThemes = true, includeSentiment = true, includeMusicalElements = true } = body;

    if (!title || !artist) {
      return NextResponse.json({
        success: false,
        error: 'Title and artist are required'
      }, { status: 400 });
    }

    // Step 1: Search for publicly available song information
    console.log(`Searching for information about "${title}" by ${artist}...`);
    const songInfo = await searchSongInfo(title, artist);
    
    // Step 2: Get song metadata
    const metadata = await getSongMetadata(title, artist);
    
    // Step 3: Analyze the song content based on available information
    console.log('Analyzing song content...');
    const analysis = await analyzeSongContent(songInfo, title, artist);
    
    // Step 4: Calculate confidence based on information availability
    const confidence = songInfo.length > 100 ? 0.8 : songInfo.length > 50 ? 0.6 : 0.4;
    
    // Step 5: Compile the final result
    const result: LyricsAnalysisResult = {
      success: true,
      analysis: {
        song: {
          title,
          artist,
          album: metadata.album || undefined,
          year: metadata.year || undefined,
          genre: metadata.genre || undefined,
        },
        themes: includeThemes ? analysis.themes : { primary: [], secondary: [], emotions: [], subjects: [] },
        sentiment: includeSentiment ? analysis.sentiment : { overall: 'neutral', intensity: 0.5, confidence: 0.5 },
        musicalElements: includeMusicalElements ? analysis.musicalElements : { structure: [], lyricStyle: [], literaryDevices: [], narrative: '' },
        metadata: {
          ...analysis.metadata,
          ...metadata
        },
        summary: analysis.summary,
        culturalContext: analysis.culturalContext,
        recommendations: analysis.recommendations
      },
      confidence
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in lyrics analysis:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze song lyrics. Please try again.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Lyrics Analysis API',
    version: '1.0.0',
    description: 'Copyright-compliant song analysis focusing on themes, sentiment, and musical elements',
    usage: 'POST with { title: string, artist: string }'
  });
}
