#!/bin/bash

# Alic3X Integration Deployment Script for FigmaAiAgent
# This script sets up the complete Alic3X integration

echo "🎵 Starting Alic3X Aliv3 12 Suite Integration..."

# Step 1: Install required dependencies
echo "📦 Installing music production dependencies..."
pnpm add osc ws python-shell @pinecone-database/pinecone
pnpm add @types/osc @types/ws --save-dev

# Optional MIDI handling
echo "🎹 Installing optional MIDI dependencies..."
pnpm add midi jsmidgen --save-optional

# Step 2: Set up environment variables
echo "⚙️ Setting up environment configuration..."
cat >> .env.local << 'EOF'

# Alic3X Integration Configuration
ABLETON_OSC_HOST=localhost
ABLETON_OSC_PORT=11000
MAGENTA_STUDIO_PATH=/path/to/magenta/studio
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here
PINECONE_INDEX_NAME=alic3x-memory

# Additional Music Production APIs (Optional)
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
EOF

echo "📝 Added Alic3X environment variables to .env.local"

# Step 3: Create database migrations for music features
echo "🗄️ Setting up database schema for music production..."
cat > lib/db/migrations/add_music_tables.sql << 'EOF'
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
EOF

# Step 4: Update package.json scripts
echo "📜 Adding music production scripts to package.json..."
# Create a backup of package.json
cp package.json package.json.backup

# Add new scripts (this would need to be done manually or with a more sophisticated tool)
echo "Manual step required: Add these scripts to your package.json:"
echo '  "music:setup": "tsx scripts/setupAlic3x.ts",'
echo '  "music:migrate": "tsx lib/db/migrations/add_music_tables.sql",'
echo '  "ableton:connect": "tsx scripts/connectAbleton.ts"'

# Step 5: Create Ableton Live OSC configuration
echo "🎛️ Setting up Ableton Live OSC configuration..."
mkdir -p config/ableton
cat > config/ableton/osc-config.json << 'EOF'
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
EOF

# Step 6: Create Max for Live template
echo "🔧 Creating Max for Live device templates..."
mkdir -p templates/max-for-live
cat > templates/max-for-live/alic3x-device-template.json << 'EOF'
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
EOF

# Step 7: Create Python OSC bridge script
echo "🐍 Setting up Python OSC bridge..."
mkdir -p scripts/python
cat > scripts/python/ableton_osc_bridge.py << 'EOF'
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
EOF

# Step 8: Create Pinecone setup script
echo "🔍 Setting up Pinecone vector memory..."
cat > scripts/setupPinecone.ts << 'EOF'
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
EOF

# Step 9: Create integration test script
echo "🧪 Creating integration test script..."
cat > scripts/testAlic3xIntegration.ts << 'EOF'
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
EOF

# Step 10: Update navigation
echo "🧭 Integration files created successfully!"

echo ""
echo "🎵 Alic3X Integration Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Run 'pnpm install' to install new dependencies"
echo "2. Add your API keys to .env.local"
echo "3. Run database migrations: 'pnpm db:migrate'"
echo "4. Set up Pinecone: 'tsx scripts/setupPinecone.ts'"
echo "5. Configure Ableton Live for OSC (see config/ableton/osc-config.json)"
echo "6. Test integration: 'tsx scripts/testAlic3xIntegration.ts'"
echo "7. Start development server: 'pnpm dev'"
echo "8. Visit /music to access Alic3X features"
echo ""
echo "🔗 Integration Features:"
echo "• Music production AI assistant"
echo "• Beat generation with visual design"
echo "• Music theory education"
echo "• Ableton Live control via OSC"
echo "• Max for Live device generation"
echo "• Unified multimedia workflow"
echo ""
echo "📚 Documentation:"
echo "• Integration guide: docs/ALIC3X_INTEGRATION.md"
echo "• API endpoints: /api/music/*"
echo "• UI components: components/music/*"
echo ""
echo "🎸 Rock on with Alic3X! 🎹"
