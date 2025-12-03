import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BeatGeneratorSimple from '@/components/music/BeatGeneratorSimple';
import LyricsAnalyzer from '@/components/music/LyricsAnalyzerSimple';
import IntegratedMusicSuite from '@/components/music/IntegratedMusicSuite';

export default function MusicProductionPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <span>🎵</span>
            Alic3X Aliv3 12 Suite
            <span>🎨</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Integrated AI assistant and teacher for Ableton Live 12 Suite, now enhanced with
            visual design capabilities for complete multimedia production workflows.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-neutral-800 dark:text-neutral-200">Music Production</div>
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-neutral-800 dark:text-neutral-200">Visual Design</div>
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-neutral-800 dark:text-neutral-200">AI-Powered</div>
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-neutral-800 dark:text-neutral-200">Real-time</div>
          </div>
        </div>

        {/* Feature Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🎧</span>
                Assistant Tool
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-neutral-300">
                Real-time Ableton Live 12 support and automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-neutral-300">
                <li>• OSC control and scripting</li>
                <li>• Max for Live device creation</li>
                <li>• Plugin chain suggestions</li>
                <li>• Performance automation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📚</span>
                Instructional Product
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-neutral-300">
                Interactive training and skill development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-neutral-300">
                <li>• Structured tutorials</li>
                <li>• Progressive challenges</li>
                <li>• Music theory education</li>
                <li>• Adaptive learning paths</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🎨</span>
                Design Integration
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-neutral-300">
                Visual design tools for multimedia projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-neutral-300">
                <li>• UI component generation</li>
                <li>• Figma integration</li>
                <li>• Audio visualizers</li>
                <li>• Interactive interfaces</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Integrated Music Production Suite */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Complete Music Production Suite</h2>
          <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
            <CardContent className="pt-6">
              <IntegratedMusicSuite />
            </CardContent>
          </Card>
        </div>

        {/* Individual Components */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Beat Generator Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">AI Beat Generation</h2>
            <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
              <CardContent className="pt-6">
                <BeatGeneratorSimple />
              </CardContent>
            </Card>
          </div>

          {/* Lyrics Analyzer Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">AI Song Analysis</h2>
            <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
              <CardContent className="pt-6">
                <LyricsAnalyzer />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Music Theory Section */}
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🎼</span>
              Music Theory Assistant
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-neutral-300">
              Learn music theory concepts with Ableton Live integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Scales & Modes</h4>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-neutral-300">
                  <li>• Major/Minor scales</li>
                  <li>• Pentatonic scales</li>
                  <li>• Modal concepts</li>
                  <li>• Scale applications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Chord Theory</h4>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-neutral-300">
                  <li>• Triads & sevenths</li>
                  <li>• Chord progressions</li>
                  <li>• Voice leading</li>
                  <li>• Extensions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Rhythm & Time</h4>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-neutral-300">
                  <li>• Time signatures</li>
                  <li>• Subdivision patterns</li>
                  <li>• Syncopation</li>
                  <li>• Groove concepts</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="border-gray-300 dark:border-neutral-700">Start Theory Lesson</Button>
              <Button variant="outline" className="border-gray-300 dark:border-neutral-700">Practice Scales</Button>
              <Button variant="outline" className="border-gray-300 dark:border-neutral-700">Chord Builder</Button>
            </div>
          </CardContent>
        </Card>

        {/* Integration Workflow */}
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🔄</span>
              Unified Creative Workflow
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-neutral-300">
              Seamlessly combine music production with visual design
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 p-6 rounded-lg ring-1 ring-inset ring-blue-100/60 dark:ring-blue-900/40">
              <h4 className="font-medium mb-4">Integrated Music Production Pipeline</h4>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h5 className="font-medium">Generate Beat</h5>
                  <p className="text-xs text-gray-600 dark:text-neutral-300">Create AI-powered rhythms with custom patterns</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h5 className="font-medium">Analyze Lyrics</h5>
                  <p className="text-xs text-gray-600 dark:text-neutral-300">Understand song meaning and themes</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h5 className="font-medium">Smart Integration</h5>
                  <p className="text-xs text-gray-600 dark:text-neutral-300">Match musical elements with lyrical themes</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-red-600 dark:bg-red-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h5 className="font-medium">Export & Share</h5>
                  <p className="text-xs text-gray-600 dark:text-neutral-300">Export integrated project for Ableton Live</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                Start New Project
              </Button>
              <Button variant="outline" className="border-gray-300 dark:border-neutral-700">
                View Examples
              </Button>
              <Button variant="outline" className="border-gray-300 dark:border-neutral-700">
                Documentation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chat Integration */}
        <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>💬</span>
              Alic3X Chat Assistant
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-neutral-300">
              Get instant help with music production and visual design
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-md">
              <p className="text-sm mb-4">
                <strong>Try asking:</strong>
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Music Production:</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-neutral-300">
                    <li>• "Create a hip-hop beat that matches emotional lyrics"</li>
                    <li>• "Generate drum patterns for sad ballads"</li>
                    <li>• "How do I integrate lyrics analysis with beat production?"</li>
                    <li>• "Export my project to Ableton Live with proper tempo"</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Integrated Workflow:</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-neutral-300">
                    <li>• "Match beat complexity to lyrical intensity"</li>
                    <li>• "Create project templates for different genres"</li>
                    <li>• "Suggest instrumentation based on song themes"</li>
                    <li>• "Export complete production instructions"</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                Open Alic3X Chat Assistant
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
