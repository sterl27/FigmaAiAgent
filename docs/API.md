# FigmaAiAgent API Documentation

## Overview

The FigmaAiAgent API provides endpoints for Figma documentation assistance, UI component generation, and lyric analysis. All endpoints support JSON requests and responses.

## Base URL

```text
http://localhost:3000/api
```

## Authentication

Currently, the API uses user IDs for data association. No authentication tokens are required for development.

---

## 🎨 Design & Component Generation

### POST `/api/design`

Generate UI components using AI.

**Request Body:**

```json
{
  "userRequest": "string",
  "constraints": {
    "colorPalette": ["#3B82F6", "#1E3A8A", "#FFFFFF"],
    "responsive": true
  }
}
```

**Response:**

```json
{
  "html": "<div class='component'>...</div>",
  "css": ".component { ... }",
  "colorDetails": [
    {
      "hex": "#3B82F6",
      "usage": "Primary background color"
    }
  ],
  "stylingNotes": "Component uses modern flexbox layout..."
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/design \
  -H "Content-Type: application/json" \
  -d '{
    "userRequest": "Create a modern button with hover effects",
    "constraints": {
      "colorPalette": ["#3B82F6", "#FFFFFF"]
    }
  }'
```

### POST `/api/copy`

Convert HTML/CSS to Figma-compatible clipboard data.

**Request Body:**

```json
{
  "html": "<div>Component HTML</div>",
  "css": ".component { color: blue; }"
}
```

**Response:**

```json
{
  "clipboardDataFromAPI": "base64-encoded-figma-data"
}
```

---

## 💬 Chat & AI Assistance

### POST `/api/chat`

Main conversational AI endpoint with tool support.

**Request Body:**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "How do I create components in Figma?"
    }
  ],
  "modelProvider": "openai",
  "sessionId": "unique-session-id"
}
```

**Response:** Streaming text response with tool invocations.

**Available Tools:**

- `searchFigmaDocs`: Search Figma documentation
- `getMediasDescription`: Get image/GIF descriptions
- `createWebComponent`: Generate UI components
- `getImagesFromGoogle`: Search for images

### GET `/api/chat?sessionId=xxx`

Retrieve chat history for a session.

**Query Parameters:**

- `sessionId`: Session identifier

**Response:**

```json
{
  "messages": [
    {
      "id": "msg-id",
      "role": "user",
      "content": "Message content",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

## 📚 Figma Documentation

### GET `/api/figma`

Scrape and index Figma documentation.

**Response:**

```json
{
  "status": "success",
  "processed": 150,
  "errors": 2,
  "message": "Documentation updated successfully"
}
```

**Features:**

- Automatically scrapes URLs from `urls.md`
- Extracts images and GIFs
- Generates embeddings for search
- Updates existing resources

---

## 🎵 Lyric Analysis

### POST `/api/analyze`

Analyze lyrics for complexity, rhyme, flow, energy, and structure.

**Request Body:**

```json
{
  "lyrics": "Lyric content here...",
  "title": "Song Title",
  "artist": "Artist Name",
  "userId": "user-123"
}
```

**Response:**

```json
{
  "analysis": {
    "complexity": {
      "score": 85,
      "confidence": 92,
      "details": "High semantic complexity with advanced metaphors"
    },
    "rhyme": {
      "score": 78,
      "confidence": 88,
      "details": "Consistent ABAB rhyme scheme"
    },
    "flow": {
      "score": 90,
      "confidence": 85,
      "details": "Smooth rhythmic flow with good pacing"
    },
    "energy": {
      "score": 75,
      "confidence": 80,
      "details": "Moderate to high energy throughout"
    },
    "structure": {
      "score": 82,
      "confidence": 90,
      "details": "Well-organized verse-chorus structure"
    }
  },
  "lyricId": "lyric-456"
}
```

### POST `/api/enhance`

Enhance lyrics using different styles or custom prompts.

**Request Body:**

```json
{
  "originalLyrics": "Original lyric content...",
  "style": "kendrick",
  "userId": "user-123",
  "lyricId": "lyric-456"
}
```

**Available Styles:**

- `tyler-creator`: Unique metaphors and vivid imagery
- `kendrick`: Complex narratives and social commentary
- `drake`: Melodic flow and emotional vulnerability
- `j-cole`: Introspective bars and personal storytelling
- `complex-metaphor`: Sophisticated metaphors and wordplay
- `emotional-depth`: Deeper emotional resonance

**Alternative with Custom Prompt:**

```json
{
  "originalLyrics": "Original content...",
  "customPrompt": "Rewrite with nautical themes",
  "userId": "user-123"
}
```

**Response:**

```json
{
  "enhancedLyrics": "Enhanced lyric content...",
  "enhancementId": "enhancement-789",
  "style": "kendrick",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### GET `/api/library`

Retrieve user's lyric library with analyses and enhancements.

**Query Parameters:**

- `userId`: User identifier (required)
- `type`: Filter type (`all`, `analyzed`, `enhanced`, `bookmarked`)

**Response:**

```json
{
  "items": [
    {
      "id": "lyric-123",
      "title": "Song Title",
      "artist": "Artist Name",
      "content": "Lyric content...",
      "createdAt": "2025-01-01T00:00:00Z",
      "isBookmarked": false,
      "analyses": [
        {
          "id": "analysis-456",
          "complexity": { "score": 85, "confidence": 92 },
          "createdAt": "2025-01-01T00:00:00Z"
        }
      ],
      "enhancements": [
        {
          "id": "enhancement-789",
          "style": "kendrick",
          "content": "Enhanced lyrics...",
          "createdAt": "2025-01-01T00:00:00Z"
        }
      ]
    }
  ],
  "total": 25
}
```

---

## 🔧 Configuration

### Environment Variables

```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
FIRECRAWL_API_KEY=fc-...
GOOGLE_GENERATIVE_AI_API_KEY=...
ANTHROPIC_API_KEY=...
PEXELS_API_KEY=...
```

### Rate Limits

- Chat endpoints: 100 requests/minute
- Analysis endpoints: 20 requests/minute
- Component generation: 10 requests/minute

---

## 📝 Error Handling

### Standard Error Response

```json
{
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error context"
  }
}
```

### Common Error Codes

- `400 BAD_REQUEST`: Missing required parameters
- `401 UNAUTHORIZED`: Invalid or missing authentication
- `429 RATE_LIMITED`: Rate limit exceeded
- `500 INTERNAL_ERROR`: Server error

---

## 🧪 Testing

### Example Test Script

```javascript
// Test component generation
const response = await fetch('/api/design', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userRequest: 'Create a loading spinner',
    constraints: {
      colorPalette: ['#3B82F6']
    }
  })
});

const component = await response.json();
console.log(component.html, component.css);
```

---

## 📊 Response Formats

### Streaming Responses

Chat endpoints return streaming responses using Server-Sent Events (SSE).

### Component Generation

Returns structured JSON with HTML, CSS, color details, and styling notes.

### Analysis Results

Returns numerical scores (0-100) with confidence levels and descriptive details.

---

## 🔄 Webhooks (Future)

Planned webhook support for:

- Analysis completion
- Component generation
- Documentation updates

---

## 📚 SDK Support (Future)

Planned SDK support for:

- JavaScript/TypeScript
- Python
- React components

---

## 🤝 Contributing

See the main README.md for contribution guidelines.

## 📄 License

This API is part of the FigmaAiAgent project. See LICENSE file for details.
