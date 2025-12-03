import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MusaixProMobileWireframe from '@/components/music/MusaixProMobileWireframe';

export default function MobileWireframePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Musaix Pro Mobile Wireframe
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            iPhone 16 Pro X optimized UI wireframe featuring Dynamic Island awareness, 
            edge-to-edge display, and native iOS 17+ design patterns.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎯 Native iOS Design</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Dynamic Island integration</li>
                <li>• Safe area aware layouts</li>
                <li>• Native gesture support</li>
                <li>• iOS 17+ spacing standards</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎨 Dark Theme Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Optimized for OLED displays</li>
                <li>• High contrast accessibility</li>
                <li>• Battery-efficient design</li>
                <li>• Professional aesthetic</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📱 Touch Optimized</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                <li>• 44pt minimum touch targets</li>
                <li>• Thumb-friendly navigation</li>
                <li>• Swipe gesture support</li>
                <li>• One-handed operation</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Wireframe */}
        <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Interactive Wireframe</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Navigate between screens to explore the complete user experience
              </p>
            </div>
            
            <MusaixProMobileWireframe />
          </div>
        </div>

        {/* Screen Descriptions */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏠 Home Screen
              </CardTitle>
              <CardDescription>
                Primary navigation hub with quick actions and recent activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Dynamic Island status display</li>
                <li>• Search bar with intelligent suggestions</li>
                <li>• Quick action cards for common tasks</li>
                <li>• Recent analysis history</li>
                <li>• Bottom navigation with haptic feedback</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Analysis Screen
              </CardTitle>
              <CardDescription>
                Real-time lyrics analysis with complexity metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Live complexity scoring</li>
                <li>• Multi-metric dashboard</li>
                <li>• Real-time text input analysis</li>
                <li>• Genre detection badges</li>
                <li>• Export and sharing options</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎵 Beat Generator
              </CardTitle>
              <CardDescription>
                AI-powered drum pattern creation with visual feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Interactive playback controls</li>
                <li>• 16-step pattern grid</li>
                <li>• Genre-specific templates</li>
                <li>• Real-time pattern visualization</li>
                <li>• Ableton Live integration</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Technical Specifications */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>📱 iPhone 16 Pro X Specifications</CardTitle>
              <CardDescription>
                Design considerations for optimal user experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Display Specifications</h4>
                  <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• 6.7-inch Super Retina XDR OLED</li>
                    <li>• 2796 × 1290 pixel resolution</li>
                    <li>• Dynamic Island integration area</li>
                    <li>• Safe area: 44pt top, 34pt bottom</li>
                    <li>• ProMotion 120Hz support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Interaction Guidelines</h4>
                  <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Minimum 44pt touch targets</li>
                    <li>• 16pt minimum spacing between elements</li>
                    <li>• Thumb zone optimization (bottom 2/3)</li>
                    <li>• Edge swipe gesture support</li>
                    <li>• Haptic feedback integration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
