# 🎵 Music Research Agent - Complete Implementation Guide

## 🚀 Overview

The Music Research Agent is a comprehensive music metadata research system that combines multiple data sources with AI-powered synthesis to provide detailed information about songs, including BPM, musical key, genre, release year, and more.

## 🏗️ Architecture

### **Frontend Integration**
- **Next.js API Route**: `/api/music/research/route.ts`
- **React Page**: `/app/music/research/page.tsx`
- **Component**: Available for integration into existing pages

### **Backend Options**
1. **Next.js API** (TypeScript) - Integrated with your existing app
2. **FastAPI Python Backend** - Standalone service for enhanced processing
3. **FastAPI Lyric Analysis** - Combined lyric + music analysis

## 🛠️ Implementation Status

### ✅ Completed Features

#### **Next.js API Implementation**
- [x] Multi-source data collection (Wikipedia, SongBPM, MusicBrainz)
- [x] GPT-4 powered metadata synthesis and fallback analysis
- [x] Structured response with confidence scoring
- [x] Input validation using Zod schemas
- [x] Error handling and graceful degradation
- [x] CORS support for cross-origin requests

#### **Python Backend Implementation**
- [x] Advanced music research agent with comprehensive source integration
- [x] OpenAI GPT integration for intelligent analysis
- [x] Multiple API source support with fallback mechanisms
- [x] Dataclass-based structured responses
- [x] Async processing capabilities
- [x] Confidence scoring and source attribution

#### **Frontend Interface**
- [x] Interactive search interface with quick examples
- [x] Real-time API testing capability
- [x] Comprehensive documentation display
- [x] Integration examples and code snippets

## 📊 Data Sources & Capabilities

### **Primary Sources**
| Source | Data Provided | Confidence Weight |
|--------|---------------|-------------------|
| **Wikipedia** | Genre, release year, album, summary, artist bio | High (0.8-0.9) |
| **SongBPM** | BPM, musical key, energy, danceability | High (0.9) |
| **MusicBrainz** | Title verification, duration, album info | Medium (0.7) |
| **GPT-4** | Synthesis, missing data inference, analysis | Medium (0.7) |

### **Extracted Metadata**
- **Basic**: Title, Artist, Album, Release Year
- **Technical**: BPM, Musical Key, Duration
- **Descriptive**: Genre, Summary, Energy Level
- **Advanced**: Danceability, Confidence Score, Source Attribution

## 🔧 Setup Instructions

### **Option 1: Next.js Integration (Recommended)**

The API is already integrated into your existing Next.js app:

```bash
# Already installed with your app dependencies
# API available at: http://localhost:3001/api/music/research
```

### **Option 2: Python Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
# Create .env file with:
OPENAI_API_KEY=your_openai_api_key_here
SONGBPM_API_KEY=your_songbpm_api_key_here  # Optional

# Run the Python agent
python music_agent.py

# Or run as FastAPI server
uvicorn main:app --reload --port 8000
```

## 🌐 API Reference

### **Next.js API Endpoint**

#### **POST /api/music/research**
```typescript
// Request
{
  "title": string,           // Required: Song title
  "artist": string,          // Optional: Artist name
  "useGptFallback": boolean  // Optional: Enable GPT synthesis (default: true)
}

// Response
{
  "success": boolean,
  "data": {
    "title": string,
    "artist": string,
    "bpm": number | null,
    "key": string | null,
    "genre": string | null,
    "year": number | null,
    "summary": string | null,
    "wikipedia_url": string | null,
    "confidence_score": number,        // 0.0 - 1.0
    "sources": string[],              // ["wikipedia", "songbpm", "gpt"]
    "additional_metadata": object,
    "research_timestamp": string
  },
  "message": string
}
```

#### **GET /api/music/research**
```typescript
// Query Parameters
?title=Song+Title&artist=Artist+Name

// Same response format as POST
```

### **Python Backend API**

The Python implementation provides the same interface with enhanced processing capabilities.

## 🧪 Testing Examples

### **Browser Console Test**
```javascript
// Test the API directly in browser console
fetch('/api/music/research', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Midnight City',
    artist: 'M83'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### **curl Test**
```bash
curl -X POST "http://localhost:3001/api/music/research" \
  -H "Content-Type: application/json" \
  -d '{"title": "Midnight City", "artist": "M83"}'
```

### **Python Test**
```python
import requests

response = requests.post('http://localhost:3001/api/music/research', json={
    'title': 'Midnight City',
    'artist': 'M83'
})

result = response.json()
print(f"BPM: {result['data']['bpm']}")
print(f"Key: {result['data']['key']}")
print(f"Confidence: {result['data']['confidence_score']:.1%}")
```

## 📈 Example Response

```json
{
  "success": true,
  "data": {
    "title": "Midnight City",
    "artist": "M83",
    "bpm": 105,
    "key": "A Minor",
    "genre": "Synth-pop",
    "year": 2011,
    "summary": "Midnight City is a song by French electronic band M83. The track was released as the lead single from their sixth studio album Hurry Up, We're Dreaming.",
    "wikipedia_url": "https://en.wikipedia.org/wiki/Midnight_City",
    "confidence_score": 0.87,
    "sources": ["wikipedia", "songbpm", "gpt"],
    "additional_metadata": {
      "album": "Hurry Up, We're Dreaming",
      "energy": 0.75,
      "danceability": 0.68
    },
    "research_timestamp": "2025-08-16T10:30:00Z"
  },
  "message": "Music research completed with 87.0% confidence"
}
```

## 🔗 Integration Examples

### **React Component Integration**
```tsx
import { useState } from 'react';

function MusicResearchWidget() {
  const [result, setResult] = useState(null);
  
  const searchSong = async (title: string, artist: string) => {
    const response = await fetch('/api/music/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, artist })
    });
    
    const data = await response.json();
    setResult(data);
  };
  
  return (
    <div>
      {/* Your search interface */}
      {result?.success && (
        <div>
          <h3>{result.data.title} by {result.data.artist}</h3>
          <p>BPM: {result.data.bpm}</p>
          <p>Key: {result.data.key}</p>
          <p>Genre: {result.data.genre}</p>
        </div>
      )}
    </div>
  );
}
```

### **Node.js Backend Integration**
```javascript
const axios = require('axios');

async function getMusicData(title, artist) {
  try {
    const response = await axios.post('http://localhost:3001/api/music/research', {
      title,
      artist
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Music research failed:', error);
    return null;
  }
}

// Usage
const songData = await getMusicData('Midnight City', 'M83');
console.log(`${songData.title} is in ${songData.key} at ${songData.bpm} BPM`);
```

## 🎯 Use Cases

### **1. Music Production Tools**
- Get BPM and key for DJ mixing
- Find compatible songs for mashups
- Analyze energy levels for playlist curation

### **2. Music Education**
- Research song structures and compositions
- Study genre characteristics and evolution
- Analyze musical elements for learning

### **3. Content Creation**
- Gather metadata for music blogs and reviews
- Create comprehensive song databases
- Generate music recommendation systems

### **4. Data Analysis**
- Build music trend analysis systems
- Create music recommendation algorithms
- Study correlations between musical features

## 🚀 Deployment Options

### **Vercel (Next.js)**
Your existing Next.js app with the music research API can be deployed directly to Vercel:

```bash
pnpm build
# Deploy through Vercel dashboard or CLI
```

### **Railway (Python Backend)**
```bash
# Create railway.json
{
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT"
  }
}
```

### **Heroku (Python Backend)**
```bash
# Use included Procfile
git add .
git commit -m "Add music research agent"
git push heroku main
```

### **Docker (Any Platform)**
```bash
cd backend
docker build -t music-research-agent .
docker run -p 8000:8000 music-research-agent
```

## 🔧 Configuration

### **Environment Variables**
```bash
# Required for full functionality
OPENAI_API_KEY=your_openai_api_key_here

# Optional (enhances BPM/key detection)
SONGBPM_API_KEY=your_songbpm_api_key_here

# For development
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### **API Rate Limits**
- **Wikipedia**: No rate limit (be respectful)
- **MusicBrainz**: 1 request/second (automatically handled)
- **SongBPM**: Varies by plan (requires API key)
- **OpenAI**: Depends on your plan

## 📚 Advanced Features

### **Confidence Scoring**
The system calculates confidence based on:
- Number of sources providing data
- Agreement between sources
- Quality of source (Wikipedia > SongBPM > MusicBrainz > GPT)
- Completeness of retrieved data

### **Fallback Mechanisms**
1. **Source Fallback**: If one API fails, others continue
2. **GPT Synthesis**: AI fills gaps in data and resolves conflicts
3. **Graceful Degradation**: Partial results when some sources fail

### **Extensibility**
The system is designed for easy extension:
- Add new music APIs by implementing the same interface
- Modify confidence scoring algorithms
- Customize GPT prompts for different analysis types
- Add new metadata fields

## 🎵 Next Steps

### **Planned Enhancements**
- [ ] YouTube/Spotify URL input support
- [ ] Audio file upload and analysis
- [ ] Pinecone integration for session memory
- [ ] Advanced music theory analysis
- [ ] Playlist and album research capabilities
- [ ] Real-time collaborative research sessions

### **Integration Opportunities**
- [ ] Connect with your existing lyric analysis
- [ ] Combine with Alic3X music production tools
- [ ] Add to music dashboard visualizations
- [ ] Create music recommendation engine

## 🎉 Ready to Use!

The Music Research Agent is now fully integrated into your FigmaAiAgent project! 

**Access Points:**
- **Web Interface**: `http://localhost:3001/music/research`
- **API Endpoint**: `http://localhost:3001/api/music/research`
- **Python Backend**: Available in `/backend/music_agent.py`

Start researching music metadata with the power of multiple APIs and AI! 🚀
