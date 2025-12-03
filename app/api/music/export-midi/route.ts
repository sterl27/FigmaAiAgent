import { NextRequest, NextResponse } from 'next/server';

// Simple MIDI-like pattern to file conversion
interface BeatPattern {
  kick: number[];
  snare: number[];
  hihat: number[];
}

interface BeatData {
  genre: string;
  tempo: number;
  complexity: string;
  pattern: BeatPattern;
  abletonInstructions: string[];
}

// Convert beat pattern to MIDI-like JSON format
function convertToMidiFormat(beatData: BeatData) {
  const { pattern, tempo } = beatData;
  const ticksPerBeat = 240; // Standard MIDI ticks per quarter note
  const stepDuration = ticksPerBeat / 4; // 16th notes
  
  const tracks = [];
  
  // Kick drum track (Channel 9, Note 36 - Bass Drum 1)
  const kickEvents = pattern.kick.map((hit, index) => ({
    time: index * stepDuration,
    note: 36, // GM Acoustic Bass Drum
    velocity: hit ? 100 : 0,
    duration: stepDuration / 2
  })).filter(event => event.velocity > 0);
  
  // Snare drum track (Channel 9, Note 38 - Acoustic Snare)
  const snareEvents = pattern.snare.map((hit, index) => ({
    time: index * stepDuration,
    note: 38, // GM Acoustic Snare
    velocity: hit ? 90 : 0,
    duration: stepDuration / 2
  })).filter(event => event.velocity > 0);
  
  // Hi-hat track (Channel 9, Note 42 - Closed Hi Hat)
  const hihatEvents = pattern.hihat.map((hit, index) => ({
    time: index * stepDuration,
    note: 42, // GM Closed Hi Hat
    velocity: hit ? 70 : 0,
    duration: stepDuration / 4
  })).filter(event => event.velocity > 0);
  
  tracks.push({
    name: 'Kick',
    channel: 9,
    events: kickEvents
  });
  
  tracks.push({
    name: 'Snare',
    channel: 9,
    events: snareEvents
  });
  
  tracks.push({
    name: 'Hi-Hat',
    channel: 9,
    events: hihatEvents
  });
  
  return {
    format: 1,
    division: ticksPerBeat,
    tempo: tempo,
    tracks: tracks
  };
}

// Generate Ableton Live Set XML structure
function generateAbletonLiveSet(beatData: BeatData) {
  const { pattern, tempo, genre } = beatData;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<Ableton MajorVersion="5" MinorVersion="12.0_12049" Creator="Alic3X Beat Generator">
  <LiveSet>
    <MasterTrack>
      <DeviceChain>
        <Mixer>
          <Tempo>
            <Manual Value="${tempo}" />
          </Tempo>
        </Mixer>
      </DeviceChain>
    </MasterTrack>
    
    <Tracks>
      <!-- Kick Drum Track -->
      <MidiTrack>
        <Name>
          <EffectiveName Value="Kick" />
        </Name>
        <DeviceChain>
          <MidiToAudioDeviceChain>
            <Devices>
              <DrumRack>
                <DrumPads>
                  <DrumPad>
                    <Note Value="36" />
                    <Name Value="Kick" />
                  </DrumPad>
                </DrumPads>
              </DrumRack>
            </Devices>
          </MidiToAudioDeviceChain>
        </DeviceChain>
        <MidiClips>
          <MidiClip>
            <Name Value="Kick Pattern" />
            <Notes>
              ${pattern.kick.map((hit, index) => 
                hit ? `<KeyTrack><Notes><MidiNote Time="${index * 0.25}" Duration="0.25" Velocity="100" Pitch="36" /></Notes></KeyTrack>` : ''
              ).join('\n              ')}
            </Notes>
          </MidiClip>
        </MidiClips>
      </MidiTrack>
      
      <!-- Snare Drum Track -->
      <MidiTrack>
        <Name>
          <EffectiveName Value="Snare" />
        </Name>
        <DeviceChain>
          <MidiToAudioDeviceChain>
            <Devices>
              <DrumRack>
                <DrumPads>
                  <DrumPad>
                    <Note Value="38" />
                    <Name Value="Snare" />
                  </DrumPad>
                </DrumPads>
              </DrumRack>
            </Devices>
          </MidiToAudioDeviceChain>
        </DeviceChain>
        <MidiClips>
          <MidiClip>
            <Name Value="Snare Pattern" />
            <Notes>
              ${pattern.snare.map((hit, index) => 
                hit ? `<KeyTrack><Notes><MidiNote Time="${index * 0.25}" Duration="0.25" Velocity="90" Pitch="38" /></Notes></KeyTrack>` : ''
              ).join('\n              ')}
            </Notes>
          </MidiClip>
        </MidiClips>
      </MidiTrack>
      
      <!-- Hi-Hat Track -->
      <MidiTrack>
        <Name>
          <EffectiveName Value="Hi-Hat" />
        </Name>
        <DeviceChain>
          <MidiToAudioDeviceChain>
            <Devices>
              <DrumRack>
                <DrumPads>
                  <DrumPad>
                    <Note Value="42" />
                    <Name Value="Hi-Hat" />
                  </DrumPad>
                </DrumPads>
              </DrumRack>
            </Devices>
          </MidiToAudioDeviceChain>
        </DeviceChain>
        <MidiClips>
          <MidiClip>
            <Name Value="Hi-Hat Pattern" />
            <Notes>
              ${pattern.hihat.map((hit, index) => 
                hit ? `<KeyTrack><Notes><MidiNote Time="${index * 0.25}" Duration="0.125" Velocity="70" Pitch="42" /></Notes></KeyTrack>` : ''
              ).join('\n              ')}
            </Notes>
          </MidiClip>
        </MidiClips>
      </MidiTrack>
    </Tracks>
    
    <Locators>
      <Locator>
        <Name Value="${genre} Beat - ${tempo} BPM" />
        <Annotation Value="Generated by Alic3X Beat Generator" />
      </Locator>
    </Locators>
  </LiveSet>
</Ableton>`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { beatData, format = 'midi' } = body;
    
    if (!beatData || !beatData.pattern) {
      return NextResponse.json(
        { success: false, error: 'Invalid beat data provided' },
        { status: 400 }
      );
    }
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `alic3x-beat-${beatData.genre}-${beatData.tempo}bpm-${timestamp}`;
    
    if (format === 'ableton') {
      // Generate Ableton Live Set
      const abletonXml = generateAbletonLiveSet(beatData);
      
      return new NextResponse(abletonXml, {
        headers: {
          'Content-Type': 'application/xml',
          'Content-Disposition': `attachment; filename="${filename}.als"`
        }
      });
      
    } else {
      // Generate MIDI JSON format
      const midiData = convertToMidiFormat(beatData);
      
      return new NextResponse(JSON.stringify(midiData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}.json"`
        }
      });
    }
    
  } catch (error) {
    console.error('MIDI export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export beat data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'midi';
  
  return NextResponse.json({
    success: true,
    message: 'MIDI Export API',
    supportedFormats: ['midi', 'ableton'],
    currentFormat: format,
    usage: {
      endpoint: '/api/music/export-midi',
      method: 'POST',
      body: {
        beatData: 'BeatData object with pattern, tempo, genre',
        format: 'midi | ableton (optional, defaults to midi)'
      }
    }
  });
}
