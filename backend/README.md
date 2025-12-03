# FastAPI Lyric Analysis Backend

A Python FastAPI backend alternative to the Next.js API routes for advanced lyric analysis. This backend provides comprehensive text analysis capabilities with enhanced NLP processing.

## Features

- **Syllable Analysis**: Advanced syllable counting using syllapy
- **Rhyme Detection**: Pattern recognition for rhyme schemes
- **Emotion Analysis**: Sentiment and emotional intensity scoring
- **Flow Consistency**: Rhythm and syllable pattern analysis
- **Lexical Diversity**: Vocabulary richness measurement
- **Enhanced Analysis**: Optional NLTK integration for advanced NLP

## Quick Start

### Windows
```bash
./setup.bat
venv\Scripts\activate.bat
python main.py
```

### Linux/macOS
```bash
chmod +x setup.sh
./setup.sh
source venv/bin/activate
python main.py
```

### Manual Setup
```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
```

## API Endpoints

- **GET /** - Health check and API info
- **POST /api/analyze** - Full lyric analysis with structured response
- **POST /api/analyze/simple** - Simple analysis without response validation

## API Documentation

Once running, visit:
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Request Format

```json
{
  "lyrics": "Your lyrics here...",
  "title": "Song Title",
  "artist": "Artist Name",
  "userId": "user123"
}
```

## Response Format

```json
{
  "complexity": {
    "creativity": 85,
    "diversity": 72,
    "emotion": 68,
    "structure": 90
  },
  "energy": {
    "persona": "Energetic",
    "level": 78,
    "intensity": "High"
  },
  "flow": {
    "consistency": 82,
    "avgSyllables": 2.4,
    "stressPoints": 3,
    "rhymeVariety": "Complex"
  },
  "dashboard": {
    "sessions": 1,
    "words": 150,
    "minutes": 1,
    "avgEnergy": 78,
    "favoritePersona": "Energetic"
  },
  "insights": {
    "themes": ["..."],
    "metaphors": ["..."],
    "strengths": ["High vocabulary diversity", "Strong rhyme patterns"],
    "suggestions": ["Try using more varied vocabulary"]
  },
  "metadata": {
    "analysisDate": "2024-01-15T10:30:00",
    "model": "python-fastapi-v1",
    "version": "1.0.0",
    "enhancedAnalysis": "true"
  }
}
```

## Analysis Features

### Core Analysis
- **Syllable Counting**: Advanced syllable detection with fallback algorithms
- **Rhyme Detection**: End-word pattern matching for rhyme scheme analysis
- **Emotion Scoring**: Keyword-based emotional content analysis
- **Flow Consistency**: Syllable pattern variance measurement
- **Lexical Diversity**: Unique word ratio calculation

### Enhanced Analysis (with NLTK)
- **Readability Scoring**: Flesch Reading Ease and Kincaid Grade Level
- **Advanced Sentiment**: VADER sentiment analysis
- **Theme Detection**: Topic modeling capabilities
- **Metaphor Recognition**: Literary device identification

## Configuration

The backend automatically detects available packages and enables enhanced features:

- **Basic Mode**: Uses syllapy for syllable counting and basic text analysis
- **Enhanced Mode**: Adds textstat and NLTK for advanced NLP features

## CORS Configuration

Pre-configured for Next.js development:
- `http://localhost:3000` (Next.js default)
- `http://localhost:3001` (Custom port)

## Dependencies

### Core Dependencies
- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `pydantic`: Data validation
- `syllapy`: Syllable counting

### Enhanced Dependencies (Optional)
- `textstat`: Readability analysis
- `nltk`: Natural language processing
- `python-multipart`: File upload support

## Integration with Next.js

Replace the Next.js API endpoint in your frontend:

```javascript
// Before (Next.js API route)
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ lyrics, title, artist })
});

// After (FastAPI backend)
const response = await fetch('http://localhost:8000/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ lyrics, title, artist })
});
```

## Performance Benefits

- **Faster NLP Processing**: Native Python libraries
- **Better Syllable Counting**: Dedicated syllapy library
- **Enhanced Text Analysis**: Full NLTK capabilities
- **Async Processing**: FastAPI's async support
- **Scalable**: Easy to deploy and scale independently

## Development

### Running in Development
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Testing the API
```bash
curl -X POST "http://localhost:8000/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{"lyrics": "Test lyrics here", "title": "Test Song"}'
```

## Deployment

The FastAPI backend can be deployed to:
- **Heroku**: Use the included Procfile
- **Railway**: Direct Python deployment
- **DigitalOcean**: App Platform or Droplet
- **AWS**: Lambda with Mangum or EC2
- **Docker**: Containerized deployment

## Error Handling

The API includes comprehensive error handling:
- **400**: Invalid request data
- **500**: Internal analysis errors
- **Validation**: Pydantic model validation

## Monitoring

Built-in health check endpoint at `/` provides:
- API version information
- Enhanced analysis capability status
- System health indicators
