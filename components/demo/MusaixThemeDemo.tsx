'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function MusaixThemeDemo() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header with Musaix Gradient */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-musaix-gradient bg-clip-text text-transparent">
            Musaix Theme Demo
          </h1>
          <p className="text-muted-foreground text-lg">
            Showcasing enhanced Tailwind configuration with Musaix variables
          </p>
        </div>

        {/* Color Palette Grid */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="w-full h-16 bg-primary rounded-musaix"></div>
              <p className="text-sm text-center">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-secondary rounded-musaix"></div>
              <p className="text-sm text-center">Secondary</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-accent rounded-musaix"></div>
              <p className="text-sm text-center">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-muted rounded-musaix"></div>
              <p className="text-sm text-center">Muted</p>
            </div>
          </div>
        </Card>

        {/* Glassmorphism Examples */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Glassmorphism Effects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glassmorphism p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Standard Glassmorphism</h3>
              <p className="text-muted-foreground">
                Beautiful blurred background with subtle transparency.
              </p>
            </div>
            <div className="glassmorphism p-6 rounded-xl shadow-purple-glow">
              <h3 className="text-lg font-semibold mb-2">With Purple Glow</h3>
              <p className="text-muted-foreground">
                Enhanced with our custom purple glow shadow.
              </p>
            </div>
          </div>
        </Card>

        {/* Dark Theme Specific Elements */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Dark Theme Elements</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="dark:true-black p-4 rounded-xl border dark:border-border">
              <h4 className="font-semibold mb-2">True Black</h4>
              <p className="text-sm text-muted-foreground">Perfect for OLED displays</p>
            </div>
            <div className="dark:deep-black p-4 rounded-xl border dark:border-border">
              <h4 className="font-semibold mb-2">Deep Black</h4>
              <p className="text-sm text-muted-foreground">Subtle variation</p>
            </div>
            <div className="dark:card-black p-4 rounded-xl border">
              <h4 className="font-semibold mb-2">Card Black</h4>
              <p className="text-sm text-muted-foreground">Card-specific styling</p>
            </div>
          </div>
        </Card>

        {/* Gradient Examples */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Gradient Backgrounds</h2>
          <div className="space-y-4">
            <div className="bg-musaix-gradient p-6 rounded-xl text-primary-foreground">
              <h3 className="text-lg font-semibold mb-2">Musaix Gradient Background</h3>
              <p>Beautiful gradient using your custom Musaix color variables.</p>
            </div>
            <div className="p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold mb-2 bg-musaix-text-gradient bg-clip-text text-transparent">
                Musaix Text Gradient
              </h3>
              <p className="text-muted-foreground">
                Text with gradient effect using the same color scheme.
              </p>
            </div>
          </div>
        </Card>

        {/* Interactive Elements */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Interactive Elements</h2>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Primary Button
            </Button>
            <Button variant="secondary" className="shadow-purple-glow">
              Glowing Button
            </Button>
            <Button variant="outline" className="dark:purple-border">
              Outlined Button
            </Button>
            <div className="glassmorphism px-4 py-2 rounded-lg cursor-pointer hover:shadow-purple-glow transition-all">
              Glass Element
            </div>
          </div>
        </Card>

        {/* Mobile Frame Example */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Mobile Frame Preview</h2>
          <div className="flex justify-center">
            <div className="mobile-frame w-64 h-96 rounded-3xl p-4 relative">
              {/* Dynamic Island */}
              <div className="dynamic-island w-24 h-6 mx-auto mb-4 rounded-full"></div>
              
              {/* Content */}
              <div className="space-y-4 p-4">
                <div className="glassmorphism p-3 rounded-lg">
                  <div className="w-full h-2 bg-primary/30 rounded mb-2"></div>
                  <div className="w-3/4 h-2 bg-secondary/30 rounded"></div>
                </div>
                <div className="glassmorphism p-3 rounded-lg">
                  <div className="w-full h-2 bg-accent/30 rounded mb-2"></div>
                  <div className="w-2/3 h-2 bg-muted/30 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Usage Examples */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Available Classes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-primary">Color Classes</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">bg-primary</code> - Primary background</li>
                <li><code className="bg-muted px-1 rounded">text-accent</code> - Accent text</li>
                <li><code className="bg-muted px-1 rounded">border-border</code> - Theme border</li>
                <li><code className="bg-muted px-1 rounded">bg-background</code> - Page background</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-primary">Custom Classes</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">glassmorphism</code> - Glass effect</li>
                <li><code className="bg-muted px-1 rounded">shadow-purple-glow</code> - Purple glow</li>
                <li><code className="bg-muted px-1 rounded">bg-musaix-gradient</code> - Theme gradient</li>
                <li><code className="bg-muted px-1 rounded">rounded-musaix</code> - Theme radius</li>
              </ul>
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}