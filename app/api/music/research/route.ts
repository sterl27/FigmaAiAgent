/**
 * Music Research Agent - Next.js API Route
 * TypeScript implementation for the frontend
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { z } from 'zod';
import { openai } from '@/lib/openai';

// Input validation schema
const MusicSearchSchema = z.object({
  title: z.string().min(1, "Song title is required"),
  artist: z.string().optional().default(""),
  useGptFallback: z.boolean().optional().default(true),
  sources: z.array(z.enum(['wikipedia', 'songbpm', 'musicbrainz', 'lastfm'])).optional().default(['wikipedia', 'songbpm', 'musicbrainz'])
});

// Response schema
const MusicProfileSchema = z.object({
  title: z.string(),
  artist: z.string(),
  bpm: z.number().nullable(),
  key: z.string().nullable(),
  genre: z.string().nullable(),
  year: z.number().nullable(),
  summary: z.string().nullable(),
  wikipedia_url: z.string().nullable(),
  confidence_score: z.number().min(0).max(1),
  sources: z.array(z.string()),
  additional_metadata: z.record(z.any()),
  research_timestamp: z.string(),
});

type MusicProfile = z.infer<typeof MusicProfileSchema>;

class MusicResearchService {
  private static instance: MusicResearchService;
  
  static getInstance(): MusicResearchService {
    if (!MusicResearchService.instance) {
      MusicResearchService.instance = new MusicResearchService();
    }
    return MusicResearchService.instance;
  }

  async searchWikipedia(title: string, artist: string = ""): Promise<any> {
    try {
      const searchQueries = [
        `${title} ${artist}`.trim(),
        `${title} song`,
        artist ? `${artist} ${title}` : title
      ];

      for (const query of searchQueries) {
        try {
          // Use Wikipedia API
          const searchResponse = await axios.get('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(query), {
            timeout: 10000,
            headers: {
              'User-Agent': 'MusicResearchAgent/1.0 (https://github.com/figma-ai-agent)'
            }
          });

          if (searchResponse.status === 200 && searchResponse.data) {
            const data = searchResponse.data;
            
            // Check if it's music-related
            const description = (data.description || '').toLowerCase();
            const extract = (data.extract || '').toLowerCase();
            const musicKeywords = ['song', 'single', 'album', 'track', 'band', 'artist', 'music', 'singer'];
            
            if (musicKeywords.some(keyword => description.includes(keyword) || extract.includes(keyword))) {
              
              // Extract additional metadata from the full page
              const metadata = await this.extractWikipediaMetadata(data.pageid);
              
              return {
                title: data.title,
                summary: data.extract,
                url: data.content_urls?.desktop?.page,
                source: 'wikipedia',
                ...metadata
              };
            }
          }
        } catch (error) {
          continue; // Try next query
        }
      }

      return { source: 'wikipedia', error: 'No relevant Wikipedia page found' };
    } catch (error) {
      return { source: 'wikipedia', error: (error as Error).message };
    }
  }

  async extractWikipediaMetadata(pageId: number): Promise<any> {
    try {
      // Get the full page content
      const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/html/${pageId}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'MusicResearchAgent/1.0'
        }
      });

      if (response.status === 200) {
        const $ = cheerio.load(response.data);
        const metadata: any = {};

        // Extract from infobox
        $('.infobox tr').each((_, element) => {
          const $row = $(element);
          const label = $row.find('th').text().toLowerCase().trim();
          const value = $row.find('td').text().trim();

          if (label.includes('genre') && value) {
            metadata.genre = value.split(',')[0].trim();
          }
          if (label.includes('released') && value) {
            const yearMatch = value.match(/\d{4}/);
            if (yearMatch) metadata.year = parseInt(yearMatch[0]);
          }
          if (label.includes('album') && value) {
            metadata.album = value;
          }
          if (label.includes('label') && value) {
            metadata.label = value;
          }
        });

        // Extract from text content with regex
        const textContent = $.text().toLowerCase();
        
        if (!metadata.genre) {
          const genreMatch = textContent.match(/genre[s]?\s*[:\-\s]+([^.\n]+)/);
          if (genreMatch) metadata.genre = genreMatch[1].split(',')[0].trim();
        }

        if (!metadata.year) {
          const yearMatch = textContent.match(/released?\s*[:\-\s]*(\d{4})/);
          if (yearMatch) metadata.year = parseInt(yearMatch[1]);
        }

        return metadata;
      }

      return {};
    } catch (error) {
      return {};
    }
  }

  async searchSongBPM(title: string, artist: string = ""): Promise<any> {
    // Note: SongBPM requires an API key. For demo purposes, we'll simulate the response structure
    // In production, you would use: const apiKey = process.env.SONGBPM_API_KEY;
    
    try {
      // Simulated response structure - replace with actual API call when you have a key
      const mockResponse = {
        source: 'songbpm',
        note: 'SongBPM API requires a valid API key. This is a mock response.',
        bpm: null,
        key: null,
        title: title,
        artist: artist
      };

      // Actual implementation would be:
      /*
      const response = await axios.get('https://api.getsongbpm.com/search/', {
        params: {
          api_key: process.env.SONGBPM_API_KEY,
          type: 'song',
          lookup: `${title} ${artist}`.trim()
        },
        timeout: 10000
      });

      if (response.data?.search?.[0]) {
        const songData = response.data.search[0];
        return {
          bpm: songData.tempo,
          key: songData.song_key,
          title: songData.song_title,
          artist: songData.artist?.name || songData.artist,
          energy: songData.energy,
          danceability: songData.danceability,
          source: 'songbpm'
        };
      }
      */

      return mockResponse;
    } catch (error) {
      return { source: 'songbpm', error: (error as Error).message };
    }
  }

  async searchMusicBrainz(title: string, artist: string = ""): Promise<any> {
    try {
      let query = `recording:"${title}"`;
      if (artist) {
        query += ` AND artist:"${artist}"`;
      }

      const response = await axios.get('https://musicbrainz.org/ws/2/recording', {
        params: {
          query,
          fmt: 'json',
          limit: 5
        },
        timeout: 10000,
        headers: {
          'User-Agent': 'MusicResearchAgent/1.0 (https://github.com/figma-ai-agent)'
        }
      });

      if (response.data?.recordings?.[0]) {
        const recording = response.data.recordings[0];
        
        const artistName = recording['artist-credit']?.[0]?.name;
        const release = recording.releases?.[0];
        
        return {
          title: recording.title,
          artist: artistName,
          duration: recording.length,
          musicbrainz_id: recording.id,
          album: release?.title,
          year: release?.date ? parseInt(release.date.substr(0, 4)) : null,
          source: 'musicbrainz'
        };
      }

      return { source: 'musicbrainz', error: 'No results found' };
    } catch (error) {
      return { source: 'musicbrainz', error: (error as Error).message };
    }
  }

  async gptExtractMetadata(searchResults: any[], title: string, artist: string = ""): Promise<any> {
    try {
      const context = `Song: ${title}\nArtist: ${artist}\n\nSearch Results:\n` +
        searchResults.slice(0, 3).map((result, i) => 
          `\nSource ${i+1} (${result.source || 'unknown'}):\n${JSON.stringify(result, null, 2).slice(0, 1000)}`
        ).join('\n');

      const prompt = `
        Analyze the search results above and extract the following music metadata for the song "${title}" by ${artist || "unknown artist"}:

        Please provide a JSON response with these fields:
        - title: (string) Official song title
        - artist: (string) Artist name
        - bpm: (integer) Beats per minute, if available
        - key: (string) Musical key (e.g., "C Major", "A Minor")
        - genre: (string) Primary genre
        - year: (integer) Release year
        - album: (string) Album name, if available
        - confidence: (float) Your confidence in this data (0.0-1.0)
        - summary: (string) Brief description of the song

        Base your response on the search results provided. If data is unavailable or conflicting, use your best judgment and indicate lower confidence.
        Return only valid JSON.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a music metadata extraction expert. Analyze search results and provide structured music information in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      });

      const resultText = completion.choices[0].message.content?.trim();
      
      if (resultText) {
        // Clean up markdown formatting
        let cleanedText = resultText;
        if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.split('```')[1];
          if (cleanedText.startsWith('json')) {
            cleanedText = cleanedText.slice(4);
          }
        }

        const metadata = JSON.parse(cleanedText);
        metadata.source = 'gpt';
        return metadata;
      }

      return { source: 'gpt', error: 'No response from GPT' };
    } catch (error) {
      return { source: 'gpt', error: (error as Error).message };
    }
  }

  synthesizeProfile(title: string, artist: string, searchResults: any[]): MusicProfile {
    const profile: Partial<MusicProfile> = {
      title,
      artist,
      bpm: null,
      key: null,
      genre: null,
      year: null,
      summary: null,
      wikipedia_url: null,
      confidence_score: 0,
      sources: [],
      additional_metadata: {},
      research_timestamp: new Date().toISOString()
    };

    const validResults = searchResults.filter(r => !r.error);
    profile.sources = validResults.map(r => r.source);

    const confidenceFactors: number[] = [];
    const sourcePriority = ['gpt', 'wikipedia', 'songbpm', 'musicbrainz'];

    for (const source of sourcePriority) {
      const sourceData = validResults.find(r => r.source === source);
      
      if (sourceData) {
        // Title and Artist
        if (sourceData.title && (!profile.title || profile.title === title)) {
          profile.title = sourceData.title;
        }
        if (sourceData.artist && (!profile.artist || profile.artist === artist)) {
          profile.artist = sourceData.artist;
        }

        // BPM and Key (priority: SongBPM > GPT)
        if (['songbpm', 'gpt'].includes(source) && sourceData.bpm) {
          profile.bpm = parseInt(sourceData.bpm);
          confidenceFactors.push(source === 'songbpm' ? 0.9 : 0.7);
        }

        if (['songbpm', 'gpt'].includes(source) && sourceData.key) {
          profile.key = sourceData.key;
          confidenceFactors.push(0.8);
        }

        // Genre and Year (priority: Wikipedia > GPT)
        if (['wikipedia', 'gpt'].includes(source) && sourceData.genre) {
          profile.genre = sourceData.genre;
          confidenceFactors.push(source === 'wikipedia' ? 0.8 : 0.7);
        }

        if (sourceData.year) {
          profile.year = parseInt(String(sourceData.year).slice(0, 4));
          confidenceFactors.push(source === 'wikipedia' ? 0.9 : 0.7);
        }

        // Summary and URL (Wikipedia priority)
        if (source === 'wikipedia') {
          if (sourceData.summary) profile.summary = sourceData.summary;
          if (sourceData.url) profile.wikipedia_url = sourceData.url;
          confidenceFactors.push(0.8);
        }

        // Additional metadata
        ['album', 'label', 'energy', 'danceability', 'duration'].forEach(key => {
          if (sourceData[key]) {
            profile.additional_metadata![key] = sourceData[key];
          }
        });
      }
    }

    // Calculate confidence score
    if (confidenceFactors.length > 0) {
      profile.confidence_score = Math.min(
        confidenceFactors.reduce((a, b) => a + b, 0) / confidenceFactors.length,
        1.0
      );
    } else {
      profile.confidence_score = 0.1;
    }

    // Boost confidence for multiple sources
    if (profile.sources!.length > 2) {
      profile.confidence_score = Math.min(profile.confidence_score! * 1.2, 1.0);
    }

    return profile as MusicProfile;
  }

  async researchSong(title: string, artist: string = "", useGptFallback: boolean = true): Promise<MusicProfile> {
    console.log(`🎵 Researching: '${title}' by ${artist || 'Unknown Artist'}`);
    
    const searchResults: any[] = [];

    // Wikipedia search
    console.log("🔍 Searching Wikipedia...");
    const wikiData = await this.searchWikipedia(title, artist);
    searchResults.push(wikiData);

    // SongBPM search
    console.log("🎼 Searching SongBPM...");
    const songbpmData = await this.searchSongBPM(title, artist);
    searchResults.push(songbpmData);

    // MusicBrainz search
    console.log("🎹 Searching MusicBrainz...");
    const musicbrainzData = await this.searchMusicBrainz(title, artist);
    searchResults.push(musicbrainzData);

    // GPT synthesis
    if (useGptFallback) {
      console.log("🤖 Using GPT for metadata synthesis...");
      const gptData = await this.gptExtractMetadata(searchResults, title, artist);
      searchResults.push(gptData);
    }

    // Synthesize final profile
    const profile = this.synthesizeProfile(title, artist, searchResults);
    
    console.log(`✅ Research complete! Confidence: ${(profile.confidence_score * 100).toFixed(1)}%`);
    return profile;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, artist, useGptFallback, sources } = MusicSearchSchema.parse(body);

    const musicService = MusicResearchService.getInstance();
    const profile = await musicService.researchSong(title, artist, useGptFallback);

    // Validate the response
    const validatedProfile = MusicProfileSchema.parse(profile);

    return NextResponse.json({
      success: true,
      data: validatedProfile,
      message: `Music research completed with ${(validatedProfile.confidence_score * 100).toFixed(1)}% confidence`
    });

  } catch (error) {
    console.error('Music research error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid input data', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Music research failed', 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

// GET endpoint for simple searches
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const artist = searchParams.get('artist') || '';

  if (!title) {
    return NextResponse.json(
      { success: false, error: 'Title parameter is required' },
      { status: 400 }
    );
  }

  try {
    const musicService = MusicResearchService.getInstance();
    const profile = await musicService.researchSong(title, artist);

    return NextResponse.json({
      success: true,
      data: profile
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Music research failed', 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}
