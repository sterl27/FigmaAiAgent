/**
 * AI API Integration for OpenAI and OpenRouter
 * Supports multiple models and providers
 */

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface APIResponse {
  content: string;
  model: string;
  provider: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ModelConfig {
  provider: 'openai' | 'openrouter';
  model: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}

// OpenAI API Integration
export async function callOpenAI(
  messages: ChatMessage[],
  config: ModelConfig
): Promise<APIResponse> {
  try {
    const response = await fetch('/api/chat/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: config.model,
        max_tokens: config.maxTokens || 4096,
        temperature: config.temperature || 0.7,
        top_p: config.topP || 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      model: data.model,
      provider: 'openai',
      usage: data.usage,
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to get response from OpenAI: ${error}`);
  }
}

// OpenRouter API Integration
export async function callOpenRouter(
  messages: ChatMessage[],
  config: ModelConfig
): Promise<APIResponse> {
  try {
    const response = await fetch('/api/chat/openrouter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: config.model,
        max_tokens: config.maxTokens || 4096,
        temperature: config.temperature || 0.7,
        top_p: config.topP || 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      model: data.model,
      provider: 'openrouter',
      usage: data.usage,
    };
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    throw new Error(`Failed to get response from OpenRouter: ${error}`);
  }
}

// Custom Assistant API Integration
export async function callCustomAssistant(
  messages: ChatMessage[],
  config: ModelConfig
): Promise<APIResponse> {
  try {
    const response = await fetch('/api/chat/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        assistant_type: 'music_analysis',
        max_tokens: config.maxTokens || 4096,
        temperature: config.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Assistant API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      content: data.response,
      model: 'music-assistant',
      provider: 'assistant',
    };
  } catch (error) {
    console.error('Assistant API Error:', error);
    throw new Error(`Failed to get response from Assistant: ${error}`);
  }
}

// Main AI chat function that routes to the appropriate provider
export async function sendChatMessage(
  messages: ChatMessage[],
  config: ModelConfig
): Promise<APIResponse> {
  switch (config.provider) {
    case 'openai':
      return await callOpenAI(messages, config);
    case 'openrouter':
      return await callOpenRouter(messages, config);
    default:
      return await callCustomAssistant(messages, config);
  }
}

// Utility function to convert internal messages to API format
export function formatMessagesForAPI(messages: any[]): ChatMessage[] {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}

// Error handling utility
export function handleAPIError(error: any): string {
  if (error.message.includes('rate limit')) {
    return 'Rate limit exceeded. Please wait a moment and try again.';
  } else if (error.message.includes('authentication')) {
    return 'Authentication failed. Please check your API keys.';
  } else if (error.message.includes('model')) {
    return 'Model not available. Please try a different model.';
  } else {
    return 'An unexpected error occurred. Please try again.';
  }
}
