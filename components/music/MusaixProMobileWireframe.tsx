'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Music, 
  Mic, 
  BarChart3, 
  Settings, 
  Heart, 
  Share, 
  Download,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  MoreHorizontal,
  ChevronLeft,
  TrendingUp,
  Zap,
  Target,
  Brain,
  Sparkles
} from 'lucide-react';

interface WireframeProps {
  screen?: 'home' | 'analysis' | 'beat-generator' | 'results' | 'profile';
}

export default function MusaixProMobileWireframe({ screen = 'home' }: WireframeProps) {
  const [activeScreen, setActiveScreen] = useState(screen);

  const StatusBar = () => (
    <div className="flex justify-between items-center px-6 py-2 text-xs font-medium true-black text-white">
      <span>9:41</span>
      <div className="w-24 h-6 dynamic-island rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
        <span className="text-xs">Dynamic Island</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-4 h-2 border border-white rounded-sm">
          <div className="w-3 h-1 bg-white rounded-sm m-0.5"></div>
        </div>
        <span>100%</span>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="oled-optimized min-h-screen">
      <StatusBar />
      
      {/* Header with safe area */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Musaix Pro</h1>
            <p className="text-gray-400 text-sm">Advanced Lyrics Analysis</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center purple-glow">
            <Settings className="h-5 w-5" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input 
            className="w-full deep-black border purple-border rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            placeholder="Search songs or paste lyrics..."
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-black p-4 rounded-2xl purple-glow">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">Analyze Lyrics</h3>
                <p className="text-xs text-gray-400">Deep AI analysis</p>
              </div>
            </div>
          </Card>
          
          <Card className="card-black p-4 rounded-2xl purple-glow">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">Beat Generator</h3>
                <p className="text-xs text-gray-400">AI-powered beats</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Analysis */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Analysis</h2>
          <Button variant="ghost" size="sm" className="text-purple-400">View All</Button>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="card-black p-4 rounded-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
                  <div>
                    <h3 className="font-medium text-white">Song Title {item}</h3>
                    <p className="text-xs text-gray-400">Artist Name • 2 min ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                    94%
                  </Badge>
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 deep-black border-t purple-border px-6 py-4 pb-8">
        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 text-purple-400"><BarChart3 /></div>
            <span className="text-xs text-purple-400">Analyze</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 text-gray-400"><Music /></div>
            <span className="text-xs text-gray-400">Beats</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 text-gray-400"><Heart /></div>
            <span className="text-xs text-gray-400">Saved</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 text-gray-400"><Settings /></div>
            <span className="text-xs text-gray-400">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );

  const AnalysisScreen = () => (
    <div className="oled-optimized min-h-screen">
      <StatusBar />
      
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => setActiveScreen('home')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Lyrics Analysis</h1>
            <p className="text-gray-400 text-sm">Real-time complexity scoring</p>
          </div>
        </div>
      </div>

      {/* Complexity Metrics */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-black p-4 rounded-2xl purple-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Creativity</p>
                <p className="text-2xl font-bold text-purple-400">87%</p>
              </div>
              <Brain className="h-8 w-8 text-purple-400" />
            </div>
          </Card>
          
          <Card className="card-black p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Energy</p>
                <p className="text-2xl font-bold text-orange-400">92%</p>
              </div>
              <Zap className="h-8 w-8 text-orange-400" />
            </div>
          </Card>
          
          <Card className="card-black p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Flow</p>
                <p className="text-2xl font-bold text-blue-400">78%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </Card>
          
          <Card className="card-black p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Structure</p>
                <p className="text-2xl font-bold text-green-400">85%</p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
          </Card>
        </div>
      </div>

      {/* Lyrics Input */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Paste Your Lyrics</h2>
        <div className="deep-black purple-border rounded-2xl p-4">
          <textarea 
            className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none"
            rows={8}
            placeholder="Start typing or paste lyrics here..."
          />
          <div className="flex justify-between items-center mt-3 pt-3 border-t purple-border">
            <span className="text-xs text-gray-400">0 words • 0:00 duration</span>
            <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl px-6 purple-glow">
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze
            </Button>
          </div>
        </div>
      </div>

      {/* Genre Detection */}
      <div className="px-6 mb-20">
        <h2 className="text-lg font-semibold mb-3">Detected Genres</h2>
        <div className="flex flex-wrap gap-2">
          {['Hip-Hop', 'Trap', 'R&B', 'Pop-Rap'].map((genre) => (
            <Badge key={genre} className="bg-purple-600/20 text-purple-300 border-purple-600/30">
              {genre}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const BeatGeneratorScreen = () => (
    <div className="bg-black text-white min-h-screen">
      <StatusBar />
      
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => setActiveScreen('home')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Beat Generator</h1>
            <p className="text-gray-400 text-sm">AI-powered drum patterns</p>
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="px-6 mb-6">
        <Card className="bg-gray-900 border-gray-700 p-6 rounded-2xl">
          <div className="text-center mb-4">
            <h3 className="font-semibold mb-1">Hip-Hop Beat</h3>
            <p className="text-gray-400 text-sm">120 BPM • Complex</p>
          </div>
          
          <div className="flex justify-center items-center space-x-8 mb-6">
            <Button variant="ghost" size="sm" className="p-3">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button className="w-16 h-16 bg-purple-600 hover:bg-purple-700 rounded-full">
              <Play className="h-6 w-6 ml-1" />
            </Button>
            <Button variant="ghost" size="sm" className="p-3">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Volume2 className="h-4 w-4 text-gray-400" />
            <div className="flex-1 h-2 bg-gray-700 rounded-full">
              <div className="w-3/4 h-2 bg-purple-500 rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Pattern Grid */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Pattern Grid</h2>
        <div className="space-y-3">
          {['Kick', 'Snare', 'Hi-Hat'].map((instrument, idx) => (
            <div key={instrument} className="bg-gray-900 border border-gray-700 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{instrument}</span>
                <Badge variant="outline" className="text-xs">
                  {idx === 0 ? '4 hits' : idx === 1 ? '2 hits' : '8 hits'}
                </Badge>
              </div>
              <div className="grid grid-cols-16 gap-1">
                {Array.from({ length: 16 }, (_, i) => (
                  <div 
                    key={i} 
                    className={`h-6 rounded border ${
                      (idx === 0 && [0, 4, 8, 12].includes(i)) ||
                      (idx === 1 && [4, 12].includes(i)) ||
                      (idx === 2 && i % 2 === 0)
                        ? 'bg-purple-600 border-purple-500' 
                        : 'bg-gray-800 border-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Genre Selection */}
      <div className="px-6 mb-20">
        <h2 className="text-lg font-semibold mb-3">Genre Templates</h2>
        <div className="grid grid-cols-2 gap-3">
          {['Hip-Hop', 'Trap', 'House', 'Techno', 'DnB', 'Ambient'].map((genre) => (
            <Button 
              key={genre} 
              variant={genre === 'Hip-Hop' ? 'default' : 'outline'}
              className={`p-4 rounded-xl ${
                genre === 'Hip-Hop' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const screens = {
    home: <HomeScreen />,
    analysis: <AnalysisScreen />,
    'beat-generator': <BeatGeneratorScreen />,
    results: <HomeScreen />,
    profile: <HomeScreen />
  };

  return (
    <div className="mx-auto max-w-sm mobile-frame rounded-3xl overflow-hidden">
      {/* Device Frame */}
      <div className="relative">
        {/* Screen Content */}
        <div className="relative z-10">
          {screens[activeScreen]}
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
      </div>
      
      {/* Screen Navigation */}
      <div className="deep-black p-4 border-t purple-border">
        <div className="flex justify-center space-x-4">
          {['home', 'analysis', 'beat-generator'].map((screenName) => (
            <Button
              key={screenName}
              variant={activeScreen === screenName ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveScreen(screenName as any)}
              className={`text-xs px-3 py-1 ${
                activeScreen === screenName 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {screenName.replace('-', ' ')}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
