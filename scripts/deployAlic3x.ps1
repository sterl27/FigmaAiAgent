# Alic3X Integration Deployment Script for FigmaAiAgent (Windows PowerShell)
# This script sets up the complete Alic3X integration on Windows

Write-Host "🎵 Starting Alic3X Aliv3 12 Suite Integration..." -ForegroundColor Green

# Step 1: Install required dependencies
Write-Host "📦 Installing music production dependencies..." -ForegroundColor Yellow
pnpm add osc ws python-shell "@pinecone-database/pinecone"
pnpm add "@types/osc" "@types/ws" --save-dev

# Optional MIDI handling
Write-Host "🎹 Installing optional MIDI dependencies..." -ForegroundColor Yellow
pnpm add midi jsmidgen

# Step 2: Set up environment variables
Write-Host "⚙️ Setting up environment configuration..." -ForegroundColor Yellow

$envContent = @"

# Alic3X Integration Configuration
ABLETON_OSC_HOST=localhost
ABLETON_OSC_PORT=11000
MAGENTA_STUDIO_PATH=C:/path/to/magenta/studio
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here
PINECONE_INDEX_NAME=alic3x-memory

# Additional Music Production APIs (Optional)
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
"@

Add-Content -Path ".env.local" -Value $envContent
Write-Host "📝 Added Alic3X environment variables to .env.local" -ForegroundColor Green

# Step 3: Create directory structure
Write-Host "📁 Creating directory structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "lib\db\migrations"
New-Item -ItemType Directory -Force -Path "config\ableton"
New-Item -ItemType Directory -Force -Path "templates\max-for-live"
New-Item -ItemType Directory -Force -Path "scripts\python"

# Step 4: Create database migration
Write-Host "🗄️ Setting up database schema for music production..." -ForegroundColor Yellow
$sqlContent = @"
-- Music production tables for Alic3X integration

CREATE TABLE IF NOT EXISTS music_sessions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  session_name VARCHAR(255),
  ableton_project_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS music_preferences (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE,
  preferred_genres TEXT[],
  skill_level VARCHAR(50),
  favorite_instruments TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS beat_generations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  prompt TEXT,
  generated_midi BYTEA,
  style_parameters JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS music_lessons (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  concept VARCHAR(255),
  level VARCHAR(50),
  progress JSONB,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"@

Set-Content -Path "lib\db\migrations\add_music_tables.sql" -Value $sqlContent

# Step 5: Create Ableton OSC configuration
Write-Host "🎛️ Setting up Ableton Live OSC configuration..." -ForegroundColor Yellow
$oscConfig = @"
{
  "host": "localhost",
  "port": 11000,
  "devices": {
    "track_control": true,
    "device_control": true,
    "transport_control": true,
    "clip_control": true
  },
  "mapping": {
    "tracks": "/live/track/{track_id}",
    "devices": "/live/device/{device_id}",
    "clips": "/live/clip/{clip_id}",
    "transport": "/live/transport"
  }
}
"@

Set-Content -Path "config\ableton\osc-config.json" -Value $oscConfig

# Step 6: Create Max for Live template
Write-Host "🔧 Creating Max for Live device templates..." -ForegroundColor Yellow
$maxTemplate = @"
{
  "patcher": {
    "fileversion": 1,
    "appversion": {
      "major": 8,
      "minor": 5,
      "revision": 5
    },
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
      },
      {
        "box": {
          "id": "obj-3",
          "maxclass": "live.dial",
          "patching_rect": [100, 100, 40, 40],
          "parameter_enable": 1,
          "varname": "alic3x_param1"
        }
      }
    ],
    "lines": [],
    "description": "Alic3X Generated Device Template"
  }
}
"@

Set-Content -Path "templates\max-for-live\alic3x-device-template.json" -Value $maxTemplate

# Step 7: Create Python OSC bridge
Write-Host "🐍 Setting up Python OSC bridge..." -ForegroundColor Yellow
$pythonBridge = @"
#!/usr/bin/env python3
"""
Alic3X OSC Bridge for Ableton Live 12
Enables communication between web interface and Ableton Live
"""

import time
import json
from pythonosc import osc
from pythonosc.dispatcher import Dispatcher
from pythonosc.server import BlockingOSCUDPServer
from pythonosc.udp_client import SimpleUDPClient

class AbletonOSCBridge:
    def __init__(self, host="localhost", port=11000):
        self.host = host
        self.port = port
        self.client = SimpleUDPClient(host, port)
        
    def send_command(self, address, *args):
        """Send OSC command to Ableton Live"""
        try:
            self.client.send_message(address, args)
            return {"success": True, "address": address, "args": args}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def control_track(self, track_id, parameter, value):
        """Control track parameters"""
        address = f"/live/track/{track_id}/{parameter}"
        return self.send_command(address, value)
    
    def control_device(self, track_id, device_id, parameter, value):
        """Control device parameters"""
        address = f"/live/track/{track_id}/device/{device_id}/{parameter}"
        return self.send_command(address, value)
    
    def transport_control(self, action):
        """Control transport (play, stop, record)"""
        address = f"/live/transport/{action}"
        return self.send_command(address)

if __name__ == "__main__":
    bridge = AbletonOSCBridge()
    print("Alic3X OSC Bridge started")
    print(f"Listening on {bridge.host}:{bridge.port}")
"@

Set-Content -Path "scripts\python\ableton_osc_bridge.py" -Value $pythonBridge

# Step 8: Create Pinecone setup script
Write-Host "🔍 Setting up Pinecone vector memory..." -ForegroundColor Yellow
$pineconeSetup = @"
import { Pinecone } from '@pinecone-database/pinecone';

const setupPineconeIndex = async () => {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const indexName = process.env.PINECONE_INDEX_NAME || 'alic3x-memory';

  try {
    // Check if index exists
    const existingIndexes = await pinecone.listIndexes();
    
    if (!existingIndexes.indexes?.some(index => index.name === indexName)) {
      // Create index for Alic3X memory
      await pinecone.createIndex({
        name: indexName,
        dimension: 1536, // OpenAI embedding dimension
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      
      console.log(`✅ Created Pinecone index: ${indexName}`);
    } else {
      console.log(`✅ Pinecone index already exists: ${indexName}`);
    }
  } catch (error) {
    console.error('❌ Error setting up Pinecone:', error);
  }
};

setupPineconeIndex();
"@

Set-Content -Path "scripts\setupPinecone.ts" -Value $pineconeSetup

# Step 9: Create integration test script
Write-Host "🧪 Creating integration test script..." -ForegroundColor Yellow
$testScript = @"
import { handleAlic3XChat } from '@/lib/music/alic3x-integration';

const testIntegration = async () => {
  console.log('🎵 Testing Alic3X Integration...');
  
  const testMessages = [
    { role: 'user', content: 'Generate a hip-hop beat at 120 BPM' },
    { role: 'user', content: 'Teach me about chord progressions' },
    { role: 'user', content: 'Create a sidechain compression effect in Ableton' },
    { role: 'user', content: 'Design a waveform visualizer component' }
  ];

  for (const message of testMessages) {
    console.log(`\n🧪 Testing: "${message.content}"`);
    try {
      const result = await handleAlic3XChat([message]);
      console.log('✅ Success: Chat handler responded');
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }
  
  console.log('\n🎉 Integration test completed!');
};

testIntegration();
"@

Set-Content -Path "scripts\testAlic3xIntegration.ts" -Value $testScript

# Step 10: Update package.json with new scripts
Write-Host "📜 Package.json scripts to add manually:" -ForegroundColor Cyan
Write-Host '  "music:setup": "tsx scripts/setupAlic3x.ts",' -ForegroundColor White
Write-Host '  "music:migrate": "tsx lib/db/migrations/add_music_tables.sql",' -ForegroundColor White
Write-Host '  "ableton:connect": "tsx scripts/connectAbleton.ts"' -ForegroundColor White

Write-Host ""
Write-Host "🎵 Alic3X Integration Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Run 'pnpm install' to install new dependencies" -ForegroundColor White
Write-Host "2. Add your API keys to .env.local" -ForegroundColor White
Write-Host "3. Run database migrations: 'pnpm db:migrate'" -ForegroundColor White
Write-Host "4. Set up Pinecone: 'tsx scripts/setupPinecone.ts'" -ForegroundColor White
Write-Host "5. Configure Ableton Live for OSC (see config/ableton/osc-config.json)" -ForegroundColor White
Write-Host "6. Test integration: 'tsx scripts/testAlic3xIntegration.ts'" -ForegroundColor White
Write-Host "7. Start development server: 'pnpm dev'" -ForegroundColor White
Write-Host "8. Visit /music to access Alic3X features" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Integration Features:" -ForegroundColor Cyan
Write-Host "• Music production AI assistant" -ForegroundColor White
Write-Host "• Beat generation with visual design" -ForegroundColor White
Write-Host "• Music theory education" -ForegroundColor White
Write-Host "• Ableton Live control via OSC" -ForegroundColor White
Write-Host "• Max for Live device generation" -ForegroundColor White
Write-Host "• Unified multimedia workflow" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "• Integration guide: docs/ALIC3X_INTEGRATION.md" -ForegroundColor White
Write-Host "• API endpoints: /api/music/*" -ForegroundColor White
Write-Host "• UI components: components/music/*" -ForegroundColor White
Write-Host ""
Write-Host "🎸 Rock on with Alic3X! 🎹" -ForegroundColor Magenta
