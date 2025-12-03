# FigmaAiAgent Documentation

Welcome to the comprehensive documentation for FigmaAiAgent - an AI-powered platform that combines Figma documentation assistance with advanced lyric analysis capabilities.

## 📖 Documentation Overview

### API Documentation
- **[Complete API Reference](API.md)** - Detailed endpoint documentation with examples
- **[OpenAPI Specification](openapi.yaml)** - Machine-readable API specification
- **[Postman Collection](FigmaAiAgent-API.postman_collection.json)** - Ready-to-use API testing collection

### Testing & Development
- **[API Test Script](test-api.js)** - Node.js script for testing all endpoints
- **[Project README](../README.md)** - Main project documentation and setup guide

## 🚀 Quick Start

### 1. API Documentation
Start with the [API Reference](API.md) for complete endpoint documentation including:
- Request/response schemas
- Example requests and responses
- Error handling
- Authentication details

### 2. Interactive Testing
Choose your preferred testing method:

**Option A: Postman Collection**
1. Import `FigmaAiAgent-API.postman_collection.json` into Postman
2. Set environment variables for `baseUrl` and `userId`
3. Start testing endpoints interactively

**Option B: Node.js Test Script**
```bash
# Requires Node.js 18+
node test-api.js
```

**Option C: OpenAPI Tools**
Use the `openapi.yaml` file with tools like:
- Swagger UI
- Insomnia
- Bruno
- OpenAPI Generator

### 3. Development Setup
See the [main README](../README.md) for:
- Environment setup
- Database configuration
- API key requirements
- Local development instructions

## 🎯 Core Features

### AI-Powered Design Assistant
- **Component Generation**: Create HTML/CSS components using natural language
- **Figma Integration**: Direct copy-to-clipboard for Figma import
- **Documentation Search**: RAG-powered search through Figma documentation
- **Multi-Modal Support**: Text, image, and GIF understanding

### Conversational AI
- **Chat Interface**: Natural language interaction with AI
- **Tool Integration**: Automatic tool selection based on context
- **Streaming Responses**: Real-time response generation
- **Multi-Model Support**: OpenAI, Google Gemini, and Anthropic Claude

### Lyric Analysis Platform
- **Multi-Dimensional Analysis**: Complexity, rhyme, flow, energy, structure
- **AI Enhancement**: Style-based lyric improvements
- **Library Management**: Personal lyric collection with history
- **Custom Prompts**: Flexible enhancement options

## 🔧 API Endpoints Overview

### Design & Components
- `POST /api/design` - Generate UI components
- `POST /api/copy` - Convert to Figma format

### Chat & AI Assistance  
- `POST /api/chat` - Conversational AI
- `GET /api/chat` - Chat history

### Figma Documentation
- `GET /api/figma` - Documentation scraping

### Lyric Analysis
- `POST /api/analyze` - Analyze lyrics
- `POST /api/enhance` - Enhance lyrics
- `GET /api/library` - User library

## 🏗️ Architecture

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with pgvector for embeddings
- **ORM**: Drizzle with full TypeScript support
- **AI Models**: OpenAI, Google Gemini, Anthropic Claude
- **Vector Search**: RAG implementation with semantic search

### Key Features
- **Type Safety**: Full TypeScript implementation
- **Real-time**: Streaming responses with SSE
- **Scalable**: Stateless API design
- **Multi-Model**: Flexible AI provider switching
- **Vector Search**: Efficient content retrieval

## 📝 Examples

### Generate a Button Component
```javascript
const response = await fetch('/api/design', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userRequest: 'Create a modern button with hover effects',
    constraints: { colorPalette: ['#3B82F6', '#FFFFFF'] }
  })
});

const component = await response.json();
// Returns: { html, css, colorDetails, stylingNotes }
```

### Chat with AI Assistant
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'How do I create components in Figma?' }],
    sessionId: 'session-123'
  })
});
// Returns streaming response with Figma documentation
```

### Analyze Lyrics
```javascript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lyrics: 'Your lyric content here...',
    userId: 'user-123'
  })
});

const analysis = await response.json();
// Returns: complexity, rhyme, flow, energy, structure scores
```

## 🤝 Contributing

See the [main README](../README.md) for contribution guidelines.

## 📄 License

This project is licensed under the MIT License.

---

## 📚 Additional Resources

- **[Main Project README](../README.md)** - Setup and overview
- **[Database Schema](../lib/db/schema/)** - Data models and relationships
- **[API Routes](../app/api/)** - Implementation details
- **[Components](../components/)** - UI component library

For questions or issues, please refer to the GitHub repository or open an issue.
