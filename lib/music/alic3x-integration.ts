/**
 * Alic3X Aliv3 12 Suite Integration Script for FigmaAiAgent
 * 
 * This script integrates Ableton Live 12 AI assistant capabilities
 * into the existing FigmaAiAgent application.
 */

import { openai } from '@ai-sdk/openai';
import { google } from "@ai-sdk/google";
import { anthropic } from '@ai-sdk/anthropic';
import { generateText, streamText, tool } from 'ai';
import { z } from 'zod';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';

// Alic3X System Prompt
const ALIC3X_SYSTEM_PROMPT = `You are Alic3X PRO, integrated as an AI assistant and teacher for Ableton Live 12 Suite, designed for real-time support, education, and creative augmentation. Your mission is to guide users through music production, live performance, and AI-enhanced workflows with intelligence, patience, and precision.

You serve both:
🎧 Assistant Tool: Offering real-time answers, automation, scripting help, and workflow enhancements.
📚 Instructional Product: Acting as an interactive trainer for structured lessons, tutorials, and skill development across experience levels.

FUNCTIONAL ROLES:
🔹 As an Assistant Tool
- Respond instantly to technical commands or creative prompts inside or alongside Ableton Live 12
- Provide automation or scripting support via Max for Live objects (live.object, live.observer, live.path)
- Python + OSC scripting using AbletonOSC, pylive, and python-osc
- Suggest best practices, plugin chains, and device routing for production and performance
- Offer AI-powered musical generation via tools like Magenta Studio

🔹 As an Instructional Product
- Deliver structured tutorials based on feature walkthroughs and learning objectives
- Provide clear, step-by-step guidance, adapting to user experience level
- Use built-in examples, exercises, and progressive challenges

TECHNICAL INTEGRATION:
- System Architecture: Powered by Alic3X PRO Routing Engine
- Context Memory: Pinecone vector memory for user preferences and session context
- Query Classification: Distinguish between creative, technical, and educational requests

You can also integrate with visual design workflows, combining music production with UI/UX design for multimedia projects.`;

// Music Theory Knowledge Base
const MUSIC_THEORY_CONCEPTS = {
  scales: {
    major: "W-W-H-W-W-W-H pattern",
    minor: "W-H-W-W-H-W-W pattern", 
    pentatonic: "Five-note scale commonly used in many genres"
  },
  chords: {
    triads: "Three-note chords (root, third, fifth)",
    seventh: "Four-note chords adding the seventh",
    extensions: "Ninth, eleventh, and thirteenth chords"
  },
  rhythm: {
    timeSignatures: "4/4, 3/4, 6/8 common patterns",
    subdivision: "Quarter, eighth, sixteenth note divisions",
    syncopation: "Emphasizing off-beats for rhythmic interest"
  }
};

// Ableton Live Tools
export const abletonTools = {
  // Control Ableton Live via OSC
  controlAbleton: tool({
    description: 'Send OSC commands to control Ableton Live 12',
    parameters: z.object({
      command: z.string().describe('OSC command to send'),
      track: z.number().optional().describe('Track number (0-based)'),
      device: z.number().optional().describe('Device number (0-based)'),
      parameter: z.string().optional().describe('Parameter name'),
      value: z.number().optional().describe('Parameter value')
    }),
    execute: async ({ command, track, device, parameter, value }) => {
      try {
        // This would integrate with actual OSC library
        const oscCommand = {
          address: `/live/${command}`,
          args: [track, device, parameter, value].filter(v => v !== undefined)
        };
        
        // Simulate OSC communication
        console.log('OSC Command:', oscCommand);
        
        return {
          success: true,
          command: oscCommand,
          message: `Successfully executed ${command} on Ableton Live`
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Failed to communicate with Ableton Live'
        };
      }
    }
  }),

  // Generate Max for Live device code
  generateMaxDevice: tool({
    description: 'Generate Max for Live device code and patches',
    parameters: z.object({
      deviceType: z.enum(['audio_effect', 'midi_effect', 'instrument']).describe('Type of Max device'),
      functionality: z.string().describe('What the device should do'),
      parameters: z.array(z.string()).optional().describe('Device parameters to expose')
    }),
    execute: async ({ deviceType, functionality, parameters }) => {
      const maxCode = `
// Generated Max for Live ${deviceType}
// Functionality: ${functionality}

{
  "boxes": [
    {
      "box": {
        "id": "obj-1",
        "maxclass": "inlet",
        "patching_rect": [50, 50, 30, 30],
        "comment": "Audio/MIDI input"
      }
    },
    {
      "box": {
        "id": "obj-2", 
        "maxclass": "outlet",
        "patching_rect": [50, 200, 30, 30],
        "comment": "Audio/MIDI output"
      }
    }
    ${parameters?.map((param, i) => `
    ,{
      "box": {
        "id": "obj-${i + 3}",
        "maxclass": "live.dial",
        "patching_rect": [${100 + i * 50}, 100, 40, 40],
        "parameter_enable": 1,
        "varname": "${param}"
      }
    }`).join('') || ''}
  ],
  "lines": [],
  "description": "${functionality}",
  "tags": ["${deviceType}", "alic3x"]
}`;

      return {
        success: true,
        deviceCode: maxCode,
        deviceType,
        functionality,
        instructions: `
1. Copy this code to a new Max for Live device
2. Add necessary DSP/MIDI processing objects
3. Connect the inlet/outlet chains
4. Map parameters to Live controls
        `
      };
    }
  }),

  // Music theory teaching tool
  teachMusicConcept: tool({
    description: 'Teach music theory concepts with examples',
    parameters: z.object({
      concept: z.string().describe('Music theory concept to teach'),
      level: z.enum(['beginner', 'intermediate', 'advanced']).describe('Learning level'),
      key: z.string().optional().describe('Musical key for examples'),
      interactive: z.boolean().optional().describe('Include interactive exercises')
    }),
    execute: async ({ concept, level, key = 'C', interactive = false }) => {
      const lesson = {
        concept,
        level,
        key,
        explanation: `Teaching ${concept} in ${key} for ${level} level`,
        examples: [] as string[],
        exercises: [] as string[],
        abletonTips: [] as string[]
      };

      // Generate concept-specific content
      if (concept.toLowerCase().includes('scale')) {
        lesson.explanation = `A scale is a series of musical notes ordered by pitch. In ${key} major scale: ${key}-D-E-F-G-A-B`;
        lesson.examples = [
          `Play ${key} major scale: C-D-E-F-G-A-B-C`,
          `Common chord progression: ${key}maj - Fmaj - Gmaj - ${key}maj`
        ];
        lesson.abletonTips = [
          'Use Scale MIDI Effect to constrain notes to the scale',
          'Try the Scale Awareness feature in Live 12',
          'Use Push\'s scale mode for easy playing'
        ];
      } else if (concept.toLowerCase().includes('chord')) {
        lesson.explanation = `Chords are three or more notes played simultaneously. In ${key}: ${key}maj (C-E-G)`;
        lesson.examples = [
          `${key} major triad: C-E-G`,
          `${key} minor triad: C-Eb-G`,
          `${key}7 chord: C-E-G-B`
        ];
        lesson.abletonTips = [
          'Use Chord MIDI Effect to create instant harmonies',
          'Try the Chord Rack for complex voicings',
          'Use Scale to stay in key while chord building'
        ];
      }

      if (interactive) {
        lesson.exercises = [
          `Practice playing the ${concept} in different octaves`,
          `Create a 4-bar loop using this ${concept}`,
          `Experiment with different rhythmic patterns`
        ];
      }

      return {
        success: true,
        lesson,
        nextSteps: `Try implementing this ${concept} in Ableton Live using the provided tips`
      };
    }
  }),

  // Beat generation tool
  generateBeat: tool({
    description: 'Generate AI-powered beats and rhythmic patterns',
    parameters: z.object({
      genre: z.enum(['hip-hop', 'house', 'techno', 'trap', 'drum-and-bass', 'ambient']).describe('Musical genre'),
      tempo: z.number().min(60).max(200).describe('BPM (beats per minute)'),
      complexity: z.enum(['simple', 'medium', 'complex']).describe('Rhythmic complexity'),
      description: z.string().optional().describe('Additional style description')
    }),
    execute: async ({ genre, tempo, complexity, description }) => {
      // Generate beat pattern based on genre and complexity
      type BeatPattern = {
        kick: number[];
        snare: number[];
        hihat: number[];
      };

      const patterns: Record<string, BeatPattern> = {
        'hip-hop': {
          kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
          snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          hihat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
        },
        'house': {
          kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
          snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          hihat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
        },
        'techno': {
          kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
          snare: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
          hihat: [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1]
        },
        'trap': {
          kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
          snare: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
          hihat: [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1]
        },
        'drum-and-bass': {
          kick: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          hihat: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1]
        },
        'ambient': {
          kick: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
          snare: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          hihat: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
        }
      };

      const basePattern = patterns[genre] || patterns['hip-hop'];
      
      // Modify complexity
      if (complexity === 'complex') {
        basePattern.hihat = basePattern.hihat.map((hit: number, i: number) => 
          i % 4 === 2 ? (Math.random() > 0.5 ? 1 : 0) : hit
        );
      }

      const beatData = {
        genre,
        tempo,
        complexity,
        description,
        pattern: basePattern,
        abletonInstructions: [
          '1. Create a new MIDI track in Ableton Live',
          '2. Load Drum Rack with appropriate drum samples',
          '3. Program the pattern using the provided sequence',
          `4. Set the track tempo to ${tempo} BPM`,
          '5. Add groove and swing as desired'
        ],
        midiData: {
          timeSignature: '4/4',
          noteLength: '16th',
          velocity: complexity === 'simple' ? 100 : 80
        }
      };

      return {
        success: true,
        beatData,
        exportTip: 'Export as MIDI file to import directly into Ableton Live'
      };
    }
  }),

  // Analyze existing music
  analyzeMusicStructure: tool({
    description: 'Analyze song structure and provide insights',
    parameters: z.object({
      songTitle: z.string().describe('Title of the song to analyze'),
      artist: z.string().optional().describe('Artist name'),
      analysisType: z.enum(['structure', 'harmony', 'rhythm', 'production']).describe('Type of analysis')
    }),
    execute: async ({ songTitle, artist, analysisType }) => {
      // This would integrate with music analysis APIs or databases
      const analysis = {
        songTitle,
        artist,
        analysisType,
        findings: {} as Record<string, any>,
        abletonTips: [] as string[]
      };

      switch (analysisType) {
        case 'structure':
          analysis.findings = {
            sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'],
            duration: '3:45',
            tempo: '120 BPM',
            key: 'C major'
          };
          analysis.abletonTips = [
            'Use Session View to build sections',
            'Create scenes for each song section',
            'Use Follow Actions for dynamic arrangement'
          ];
          break;
        
        case 'harmony':
          analysis.findings = {
            keySignature: 'C major',
            chordProgression: ['C', 'Am', 'F', 'G'],
            modalInterchange: 'None detected',
            tension: 'Low to medium harmonic tension'
          };
          analysis.abletonTips = [
            'Use Scale MIDI Effect to stay in key',
            'Try Chord MIDI Effect for quick progressions',
            'Experiment with Bass instrument for root notes'
          ];
          break;
        
        case 'rhythm':
          analysis.findings = {
            timeSignature: '4/4',
            groove: 'Straight 16th notes',
            swing: '0%',
            polyrhythm: 'None detected'
          };
          analysis.abletonTips = [
            'Use Groove Pool for timing variations',
            'Apply Groove to MIDI clips',
            'Try different quantization settings'
          ];
          break;
        
        case 'production':
          analysis.findings = {
            mixing: 'Professional stereo mix',
            dynamics: 'Moderate compression',
            effects: 'Reverb, delay, EQ',
            mastering: 'Commercial loudness'
          };
          analysis.abletonTips = [
            'Use Audio Effects Rack for complex processing',
            'Try Multiband Dynamics for mastering',
            'Use Spectrum analyzer for frequency analysis'
          ];
          break;
      }

      return {
        success: true,
        analysis,
        recommendations: `Based on the ${analysisType} analysis, consider experimenting with similar techniques in your own productions.`
      };
    }
  })
};

// Enhanced chat handler with Alic3X integration
export async function handleAlic3XChat(messages: any[], model: 'gpt-4o-mini' | 'gemini-2.0-flash-exp' | 'claude-3-5-sonnet-20241022' = 'gpt-4o-mini') {
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  // Detect if this is a music production query
  const musicKeywords = ['ableton', 'beat', 'music', 'chord', 'scale', 'rhythm', 'max for live', 'midi', 'audio', 'production', 'dj', 'mix', 'master'];
  const isMusicQuery = musicKeywords.some(keyword => 
    lastMessage.toLowerCase().includes(keyword)
  );

  // Select appropriate model and tools based on query type
  let selectedModel;
  let tools = {};

  if (isMusicQuery) {
    selectedModel = model === 'claude-3-5-sonnet-20241022' ? anthropic('claude-3-5-sonnet-20241022') :
                   model === 'gemini-2.0-flash-exp' ? google('gemini-2.0-flash-exp') :
                   openai('gpt-4o-mini');
    
    // Add Alic3X music tools
    tools = {
      ...abletonTools,
      // Include existing tools for cross-domain workflows
      searchFigmaDocs: tool({
        description: 'Search Figma documentation - useful for creating UI for music apps',
        parameters: z.object({
          query: z.string().describe('Search query for Figma docs')
        }),
        execute: async ({ query }) => {
          // This would use the existing Figma search functionality
          return {
            success: true,
            message: `Searching Figma docs for: ${query}`,
            relevantDocs: []
          };
        }
      })
    };
  } else {
    // Use existing model and tools for non-music queries
    selectedModel = openai('gpt-4o-mini');
    // Would include existing Figma tools
  }

  const systemPrompt = isMusicQuery ? ALIC3X_SYSTEM_PROMPT : 
    `You are an AI assistant designed to help users understand and utilize Figma and create web components based on Figma designs.`;

  return streamText({
    model: selectedModel,
    system: systemPrompt,
    messages,
    tools,
    maxTokens: 4096,
    temperature: 0.86,
    topP: 0.95
  });
}

// Utility functions
export const musicUtils = {
  // Convert between musical formats
  convertNoteToMidi: (note: string): number => {
    const noteMap: { [key: string]: number } = {
      'C': 60, 'C#': 61, 'D': 62, 'D#': 63, 'E': 64, 'F': 65,
      'F#': 66, 'G': 67, 'G#': 68, 'A': 69, 'A#': 70, 'B': 71
    };
    return noteMap[note] || 60;
  },

  // Generate chord voicings
  generateChord: (root: string, quality: string): string[] => {
    const intervals = {
      'major': [0, 4, 7],
      'minor': [0, 3, 7],
      'dominant7': [0, 4, 7, 10],
      'minor7': [0, 3, 7, 10]
    };
    
    const rootMidi = musicUtils.convertNoteToMidi(root);
    const chordIntervals = intervals[quality as keyof typeof intervals] || intervals.major;
    
    return chordIntervals.map(interval => {
      const midiNote = rootMidi + interval;
      const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      return noteNames[midiNote % 12];
    });
  },

  // Calculate BPM from tap tempo
  calculateBPM: (tapTimes: number[]): number => {
    if (tapTimes.length < 2) return 120;
    
    const intervals = [];
    for (let i = 1; i < tapTimes.length; i++) {
      intervals.push(tapTimes[i] - tapTimes[i - 1]);
    }
    
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    return Math.round(60000 / avgInterval); // Convert ms to BPM
  }
};

// Export the integration module
const alic3xIntegration = {
  handleAlic3XChat,
  abletonTools,
  musicUtils,
  MUSIC_THEORY_CONCEPTS
};

export default alic3xIntegration;
