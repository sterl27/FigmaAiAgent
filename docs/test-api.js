#!/usr/bin/env node

/**
 * FigmaAiAgent API Test Suite
 * 
 * This script provides a simple way to test the FigmaAiAgent API endpoints.
 * Run with: node test-api.js
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3000/api';
const USER_ID = process.env.USER_ID || 'test-user-' + Date.now();

// Test configuration
const tests = [
  {
    name: '🎨 Component Generation',
    endpoint: '/design',
    method: 'POST',
    data: {
      userRequest: 'Create a modern loading spinner with smooth animation',
      constraints: {
        colorPalette: ['#3B82F6', '#93C5FD'],
        responsive: true
      }
    }
  },
  {
    name: '💬 Chat Interaction',
    endpoint: '/chat',
    method: 'POST',
    data: {
      messages: [
        {
          role: 'user',
          content: 'How do I create auto layout in Figma?'
        }
      ],
      modelProvider: 'openai',
      sessionId: 'test-session-' + Date.now()
    }
  },
  {
    name: '🎵 Lyric Analysis',
    endpoint: '/analyze',
    method: 'POST',
    data: {
      lyrics: `Coding through the night, debugging line by line
AI assistance makes the workflow so divine
Components generate with a single request
This API puts development to the test`,
      title: 'Developer Blues',
      artist: 'Code Lyricist',
      userId: USER_ID
    }
  },
  {
    name: '✨ Lyric Enhancement',
    endpoint: '/enhance',
    method: 'POST',
    data: {
      originalLyrics: `Simple code and basic functions
Need some style and better junctions`,
      style: 'kendrick',
      userId: USER_ID
    }
  },
  {
    name: '📚 User Library',
    endpoint: '/library',
    method: 'GET',
    query: `userId=${USER_ID}&type=all`
  }
];

// Utility functions
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function formatJson(obj) {
  return JSON.stringify(obj, null, 2);
}

async function makeRequest(test) {
  const url = test.query 
    ? `${API_BASE}${test.endpoint}?${test.query}`
    : `${API_BASE}${test.endpoint}`;

  const options = {
    method: test.method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (test.data && test.method !== 'GET') {
    options.body = JSON.stringify(test.data);
  }

  try {
    log(`\n${test.name}`, 'bright');
    log(`${test.method} ${url}`, 'cyan');
    
    if (test.data && test.method !== 'GET') {
      log('\nRequest Body:', 'yellow');
      console.log(formatJson(test.data));
    }

    const startTime = Date.now();
    const response = await fetch(url, options);
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    const statusColor = response.ok ? 'green' : 'red';
    
    log(`\nStatus: ${response.status} ${response.statusText} (${responseTime}ms)`, statusColor);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      log('\nResponse:', 'blue');
      console.log(formatJson(data));
    } else if (contentType && contentType.includes('text/event-stream')) {
      log('\nStreaming response detected (chat endpoint)', 'magenta');
      log('Note: Streaming responses require special handling in production', 'yellow');
    } else {
      const text = await response.text();
      log('\nResponse:', 'blue');
      console.log(text);
    }

    return { success: response.ok, status: response.status, responseTime };
    
  } catch (error) {
    log(`\nError: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('🚀 FigmaAiAgent API Test Suite', 'bright');
  log('=' .repeat(50), 'cyan');
  
  log(`\nTesting API at: ${API_BASE}`, 'yellow');
  log(`User ID: ${USER_ID}`, 'yellow');
  
  const results = [];
  
  for (const test of tests) {
    const result = await makeRequest(test);
    results.push({ name: test.name, ...result });
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  log('\n' + '=' .repeat(50), 'cyan');
  log('📊 Test Summary', 'bright');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  log(`\nTotal Tests: ${total}`, 'yellow');
  log(`Successful: ${successful}`, 'green');
  log(`Failed: ${total - successful}`, 'red');
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    const time = result.responseTime ? `(${result.responseTime}ms)` : '';
    log(`${status} ${result.name} ${time}`, result.success ? 'green' : 'red');
  });
  
  log('\n🔗 For more detailed API documentation, see:', 'cyan');
  log('  • docs/API.md - Complete reference guide', 'blue');
  log('  • docs/openapi.yaml - OpenAPI specification', 'blue');
  log('  • docs/FigmaAiAgent-API.postman_collection.json - Postman collection', 'blue');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  log('❌ This script requires Node.js 18+ for fetch support', 'red');
  log('Alternative: Use the Postman collection or curl commands from docs/API.md', 'yellow');
  process.exit(1);
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});
