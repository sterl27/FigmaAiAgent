'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MessageCircle, 
  Bot, 
  User, 
  Sparkles, 
  Music, 
  Mic, 
  MicOff, 
  Send, 
  Paperclip, 
  Image, 
  FileText, 
  Volume2, 
  VolumeX, 
  Copy, 
  RefreshCw,
  Settings,
  ChevronDown,
  Plus,
  Trash2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  thread_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    attachments?: Array<{
      type: 'image' | 'audio' | 'file';
      url: string;
      name: string;
      size?: number;
    }>;
    voice_message?: {
      url: string;
      duration: number;
      transcript: string;
    };
    analysis_type?: 'lyric' | 'melody' | 'chord' | 'structure';
  };
  status: 'sending' | 'sent' | 'error';
}

interface ChatThread {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  message_count: number;
  model: string;
}

interface AIProvider {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  icon: React.ComponentType<any>;
  provider: 'openai' | 'openrouter' | 'assistant';
  model: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}

interface ModelGroup {
  provider: 'openai' | 'openrouter' | 'assistant';
  name: string;
  models: AIProvider[];
}

export default function AdvancedChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThread, setCurrentThread] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('gpt-4o');
  const [isLoading, setIsLoading] = useState(false);
  const [showProviders, setShowProviders] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Enhanced AI Models with OpenAI and OpenRouter support
  const modelGroups: ModelGroup[] = [
    {
      provider: 'openai',
      name: 'OpenAI Models',
      models: [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          description: 'Most capable model with vision and audio',
          capabilities: ['text', 'image', 'audio', 'code', 'analysis'],
          icon: Bot,
          provider: 'openai',
          model: 'gpt-4o',
          maxTokens: 4096,
          temperature: 0.7
        },
        {
          id: 'gpt-4o-mini',
          name: 'GPT-4o Mini',
          description: 'Faster, cost-effective with same capabilities',
          capabilities: ['text', 'image', 'code', 'analysis'],
          icon: Bot,
          provider: 'openai',
          model: 'gpt-4o-mini',
          maxTokens: 4096,
          temperature: 0.7
        },
        {
          id: 'gpt-4-turbo',
          name: 'GPT-4 Turbo',
          description: 'High performance with 128k context',
          capabilities: ['text', 'image', 'code', 'analysis'],
          icon: Bot,
          provider: 'openai',
          model: 'gpt-4-turbo',
          maxTokens: 4096,
          temperature: 0.7
        },
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          description: 'Fast and efficient for most tasks',
          capabilities: ['text', 'code', 'analysis'],
          icon: Bot,
          provider: 'openai',
          model: 'gpt-3.5-turbo',
          maxTokens: 4096,
          temperature: 0.7
        }
      ]
    },
    {
      provider: 'openrouter',
      name: 'OpenRouter Models',
      models: [
        {
          id: 'claude-3.5-sonnet',
          name: 'Claude 3.5 Sonnet',
          description: 'Superior reasoning and creative writing',
          capabilities: ['text', 'image', 'analysis', 'creative'],
          icon: Sparkles,
          provider: 'openrouter',
          model: 'anthropic/claude-3.5-sonnet',
          maxTokens: 4096,
          temperature: 0.7
        },
        {
          id: 'claude-3-haiku',
          name: 'Claude 3 Haiku',
          description: 'Fast and cost-effective responses',
          capabilities: ['text', 'analysis', 'creative'],
          icon: Sparkles,
          provider: 'openrouter',
          model: 'anthropic/claude-3-haiku',
          maxTokens: 4096,
          temperature: 0.7
        },
        {
          id: 'gemini-pro',
          name: 'Gemini Pro',
          description: 'Google\'s advanced multimodal model',
          capabilities: ['text', 'image', 'code', 'analysis'],
          icon: Bot,
          provider: 'openrouter',
          model: 'google/gemini-pro',
          maxTokens: 4096,
          temperature: 0.7
        },
        {
          id: 'llama-3.1-405b',
          name: 'Llama 3.1 405B',
          description: 'Meta\'s largest and most capable model',
          capabilities: ['text', 'code', 'analysis', 'reasoning'],
          icon: Bot,
          provider: 'openrouter',
          model: 'meta-llama/llama-3.1-405b-instruct',
          maxTokens: 4096,
          temperature: 0.7
        },
        {
          id: 'mixtral-8x7b',
          name: 'Mixtral 8x7B',
          description: 'High-quality open model with expert routing',
          capabilities: ['text', 'code', 'analysis'],
          icon: Bot,
          provider: 'openrouter',
          model: 'mistralai/mixtral-8x7b-instruct',
          maxTokens: 4096,
          temperature: 0.7
        }
      ]
    },
    {
      provider: 'assistant',
      name: 'Custom Assistants',
      models: [
        {
          id: 'music-assistant',
          name: 'Music Analysis Assistant',
          description: 'Specialized for lyric and music analysis',
          capabilities: ['text', 'music', 'lyrics', 'specialized'],
          icon: Music,
          provider: 'assistant',
          model: 'music-assistant',
          maxTokens: 4096,
          temperature: 0.7
        }
      ]
    }
  ];

  // Flatten all models for easy access
  const allModels = modelGroups.flatMap(group => group.models);
  const currentModel = allModels.find(model => model.id === selectedProvider) || allModels[0];

  // Initialize with welcome messages
  useEffect(() => {
    const welcomeThread = {
      id: 'welcome',
      name: 'Welcome to Musaix Pro',
      created_at: new Date(),
      updated_at: new Date(),
      message_count: 2,
      model: 'openai'
    };

    const welcomeMessages: ChatMessage[] = [
      {
        id: '1',
        thread_id: 'welcome',
        role: 'assistant',
        content: 'Welcome to Musaix Pro! I\'m your AI music analysis assistant. I can help you analyze lyrics, understand song structures, explore musical themes, and enhance your creative process.\n\nHere\'s what I can do:\n• 🎵 Analyze lyrical complexity and flow\n• 🎭 Identify emotional themes and metaphors\n• 📊 Provide detailed music insights\n• 🎤 Process voice messages and audio files\n• 🖼️ Analyze images of sheet music or lyrics\n\nHow can I help you today?',
        timestamp: new Date(),
        status: 'sent'
      },
      {
        id: '2',
        thread_id: 'welcome',
        role: 'assistant',
        content: 'Try asking me about your favorite song, share some lyrics for analysis, or upload an audio file for musical insights! You can also record a voice message by clicking the microphone icon.',
        timestamp: new Date(),
        metadata: {
          model: 'openai'
        },
        status: 'sent'
      }
    ];

    setThreads([welcomeThread]);
    setCurrentThread('welcome');
    setMessages(welcomeMessages);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await handleVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceMessage = async (audioBlob: Blob) => {
    // In a real implementation, you would:
    // 1. Upload to Supabase storage
    // 2. Transcribe using Whisper API
    // 3. Create message with voice metadata
    
    const mockTranscript = "This is a transcribed voice message";
    const voiceMessageId = Date.now().toString();
    
    const voiceMessage: ChatMessage = {
      id: voiceMessageId,
      thread_id: currentThread || 'welcome',
      role: 'user',
      content: mockTranscript,
      timestamp: new Date(),
      metadata: {
        voice_message: {
          url: URL.createObjectURL(audioBlob),
          duration: 5, // mock duration
          transcript: mockTranscript
        }
      },
      status: 'sent'
    };

    setMessages(prev => [...prev, voiceMessage]);
    await handleAIResponse(mockTranscript);
  };

  // File Upload Functions
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Create message with file attachment
    const fileMessageId = Date.now().toString();
    const fileMessage: ChatMessage = {
      id: fileMessageId,
      thread_id: currentThread || 'welcome',
      role: 'user',
      content: `Uploaded file: ${file.name}`,
      timestamp: new Date(),
      metadata: {
        attachments: [{
          type: file.type.startsWith('image/') ? 'image' : 'file',
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size
        }]
      },
      status: 'sent'
    };

    setTimeout(() => {
      setMessages(prev => [...prev, fileMessage]);
      handleAIResponse(`I've uploaded a file: ${file.name}. Can you analyze it?`);
    }, 2000);

    event.target.value = '';
  };

  // Text-to-Speech
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  // AI Response Handler
  const handleAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      const responseId = Date.now().toString();
      
      let aiResponse = '';
      
      // Generate contextual responses based on content
      if (userMessage.toLowerCase().includes('lyric') || userMessage.toLowerCase().includes('song')) {
        aiResponse = `I'd be happy to analyze those lyrics! Based on what you've shared, I can see interesting patterns in the rhyme scheme and metaphorical language. The lyrical complexity appears to be quite sophisticated with layered meanings.\n\nWould you like me to break down:\n• Rhyme scheme and flow patterns\n• Emotional themes and metaphors\n• Musical structure suggestions\n• Comparative analysis with similar works?`;
      } else if (userMessage.toLowerCase().includes('upload') || userMessage.toLowerCase().includes('file')) {
        aiResponse = `I've analyzed your uploaded file! Here's what I found:\n\n• **Content Type**: Musical content detected\n• **Analysis Status**: Complete\n• **Key Insights**: The structure shows interesting harmonic progressions\n\nWould you like me to provide detailed insights about rhythm, melody, or lyrical content?`;
      } else {
        aiResponse = `Thanks for your message! I'm here to help with music analysis, lyric interpretation, and creative insights. Whether you're working on original music, analyzing existing songs, or exploring musical concepts, I can provide detailed analysis and suggestions.\n\nWhat specific aspect of music would you like to explore?`;
      }

      const aiMessage: ChatMessage = {
        id: responseId,
        thread_id: currentThread || 'welcome',
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        metadata: {
          model: currentModel?.name || 'GPT-4o'
        },
        status: 'sent'
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Send Message
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const messageId = Date.now().toString();
    const userMessage: ChatMessage = {
      id: messageId,
      thread_id: currentThread || 'welcome',
      role: 'user',
      content: inputText,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText;
    setInputText('');
    
    await handleAIResponse(messageText);
  };

  // Thread Management
  const createNewThread = () => {
    const newThreadId = Date.now().toString();
    const newThread: ChatThread = {
      id: newThreadId,
      name: `New Chat ${threads.length + 1}`,
      created_at: new Date(),
      updated_at: new Date(),
      message_count: 0,
      model: selectedProvider
    };

    setThreads(prev => [newThread, ...prev]);
    setCurrentThread(newThreadId);
    setMessages([]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-primary/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Musaix AI Chat
              </h1>
              <p className="text-xs text-muted-foreground">
                Powered by {currentModel?.name || 'AI Model'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProviders(!showProviders)}
                className="text-xs"
              >
                <Settings className="w-3 h-3 mr-1" />
                AI Model
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              
              {showProviders && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {modelGroups.map((group) => (
                    <div key={group.provider} className="p-1">
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border/50">
                        {group.name}
                      </div>
                      {group.models.map((model) => (
                        <div
                          key={model.id}
                          className={cn(
                            "p-3 cursor-pointer hover:bg-accent transition-colors rounded-md mx-1 my-1",
                            selectedProvider === model.id && "bg-accent"
                          )}
                          onClick={() => {
                            setSelectedProvider(model.id);
                            setShowProviders(false);
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <model.icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">{model.name}</div>
                              <div className="text-xs text-muted-foreground mb-1">{model.description}</div>
                              <div className="flex flex-wrap gap-1">
                                {model.capabilities.map((cap) => (
                                  <Badge key={cap} variant="outline" className="text-xs px-1 py-0">
                                    {cap}
                                  </Badge>
                                ))}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {model.provider} • {model.maxTokens} tokens
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button variant="outline" size="sm" onClick={createNewThread}>
              <Plus className="w-3 h-3 mr-1" />
              New Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="p-4 bg-accent/50">
          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">Uploading file...</div>
            <Progress value={uploadProgress} className="flex-1 h-2" />
            <div className="text-sm text-muted-foreground">{uploadProgress}%</div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl p-4 space-y-2",
                message.role === 'user'
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border"
              )}
            >
              {/* Message Content */}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>

              {/* Voice Message Player */}
              {message.metadata?.voice_message && (
                <div className="flex items-center space-x-2 p-2 bg-background/20 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakMessage(message.metadata!.voice_message!.transcript)}
                  >
                    {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <div className="flex-1">
                    <div className="text-xs opacity-70">
                      Voice message • {message.metadata.voice_message.duration}s
                    </div>
                  </div>
                </div>
              )}

              {/* File Attachments */}
              {message.metadata?.attachments?.map((attachment, index) => (
                <div key={index} className="p-2 bg-background/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {attachment.type === 'image' ? (
                      <FileText className="w-4 h-4" aria-label="Image file" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    <div className="flex-1">
                      <div className="text-xs font-medium">{attachment.name}</div>
                      {attachment.size && (
                        <div className="text-xs opacity-70">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </div>
                      )}
                    </div>
                  </div>
                  {attachment.type === 'image' && (
                    <div className="mt-2 w-full h-32 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                      Image Preview: {attachment.name}
                    </div>
                  )}
                </div>
              ))}

              {/* Message Footer */}
              <div className="flex items-center justify-between text-xs opacity-70">
                <div className="flex items-center space-x-2">
                  <span>{formatTimestamp(message.timestamp)}</span>
                  {message.metadata?.model && (
                    <Badge variant="outline" className="text-xs">
                      {message.metadata.model}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  {message.role === 'assistant' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => speakMessage(message.content)}
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(message.content)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/50 backdrop-blur-sm p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <Input
              className="pr-12 bg-background border-border resize-none min-h-[44px] max-h-32"
              placeholder="Ask about music, lyrics, or upload a file..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
            />
            
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="audio/*,image/*,.txt,.pdf,.doc,.docx"
                aria-label="Upload file"
                title="Upload a file"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className="h-11 w-11 p-0"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="h-11 w-11 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div>
            Press Enter to send, Shift+Enter for new line
          </div>
          <div>
            {inputText.length}/2000
          </div>
        </div>
      </div>
    </div>
  );
}
