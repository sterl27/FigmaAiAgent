"use client";

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Upload, Mic, Sparkles, Wand2, Music, Download, Share2, Copy } from 'lucide-react';
import { MicroAnimation } from '@/src/components/ui/micro-animations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLyrics } from '@/src/hooks/useLyrics';
import { cn } from '@/lib/utils';

const styleOptions = [
  {
    key: 'tyler-creator',
    label: 'Tyler, The Creator',
    description: 'Unique metaphors and vivid imagery',
    color: 'from-orange-500 to-red-500',
    example: 'Abstract wordplay with colorful visuals'
  },
  {
    key: 'kendrick',
    label: 'Kendrick Lamar',
    description: 'Complex narratives and social commentary',
    color: 'from-purple-500 to-pink-500',
    example: 'Deep storytelling with conscious themes'
  },
  {
    key: 'drake',
    label: 'Drake',
    description: 'Melodic flow and emotional vulnerability',
    color: 'from-blue-500 to-cyan-500',
    example: 'Smooth delivery with personal reflection'
  },
  {
    key: 'j-cole',
    label: 'J. Cole',
    description: 'Introspective storytelling',
    color: 'from-green-500 to-emerald-500',
    example: 'Thoughtful lyrics with life lessons'
  },
  {
    key: 'eminem',
    label: 'Eminem',
    description: 'Rapid flow and wordplay',
    color: 'from-red-500 to-orange-500',
    example: 'Technical skill with clever rhymes'
  },
  {
    key: 'custom',
    label: 'Custom Style',
    description: 'Define your own enhancement style',
    color: 'from-indigo-500 to-purple-500',
    example: 'Personalized approach to enhancement'
  }
];

export function Enhance() {
  const [inputText, setInputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('drake');
  const [customPrompt, setCustomPrompt] = useState('');
  const [enhancedResult, setEnhancedResult] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const wordCount = useMemo(() => {
    return inputText.split(/\s+/).filter(word => word.length > 0).length;
  }, [inputText]);
  
  const { enhanceLyrics, isEnhancing, error } = useLyrics();

  const handleEnhance = useCallback(async () => {
    if (!inputText.trim()) return;
    
    const result = await enhanceLyrics(
      inputText, 
      selectedStyle, 
      selectedStyle === 'custom' ? customPrompt : undefined
    );
    
    if (result) {
      setEnhancedResult(result);
      setShowComparison(true);
    }
  }, [inputText, selectedStyle, customPrompt, enhanceLyrics]);


  const selectedStyleInfo = styleOptions.find(style => style.key === selectedStyle);

  return (
    <div className="flex flex-col h-full bg-background p-4 space-y-6 overflow-y-auto">
      {/* Header */}
      <MicroAnimation type="slideUp" delay={100}>
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <MicroAnimation type="musicPulse" intensity="subtle">
              <Zap className="w-8 h-8 text-primary" />
            </MicroAnimation>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Style Enhancement
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Transform your lyrics with AI-powered artist style enhancement
          </p>
        </div>
      </MicroAnimation>

      {/* Input Section */}
      <MicroAnimation type="slideUp" delay={200}>
        <Card className="p-4 space-y-4 bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Original lyrics to enhance
              </label>
              <div className="flex items-center space-x-2">
                <MicroAnimation type="pulse" trigger={isRecording}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRecording(!isRecording)}
                    className={cn(
                      "transition-all duration-300",
                      isRecording && "bg-red-500/20 border-red-500 text-red-500"
                    )}
                  >
                    <Mic className="w-4 h-4 mr-1" />
                    {isRecording ? "Stop Recording" : "Record"}
                  </Button>
                </MicroAnimation>
                <input
                  type="file"
                  accept=".txt"
                  className="hidden"
                  id="lyrics-upload"
                  title="Upload lyrics file"
                  placeholder="Upload lyrics file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setInputText(event.target?.result as string);
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.getElementById('lyrics-upload') as HTMLInputElement;
                    input?.click();
                  }}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload
                </Button>
              </div>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter the lyrics you want to enhance in a specific artist's style..."
              className="w-full h-32 p-3 rounded-lg border border-border bg-background/50 resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
            
            <div className="text-xs text-muted-foreground">
              {inputText.length} characters • {wordCount} words
            </div>
          </div>
        </Card>
      </MicroAnimation>

      {/* Style Selection */}
      <MicroAnimation type="slideUp" delay={300}>
        <Card className="p-4 space-y-4 bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Choose Enhancement Style
            </label>
            
            {/* Selected Style Preview */}
            {selectedStyleInfo && (
              <MicroAnimation type="scaleIn">
                <div className={cn(
                  "p-3 rounded-lg bg-gradient-to-r opacity-20",
                  selectedStyleInfo.color
                )}>
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm">{selectedStyleInfo.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {selectedStyleInfo.description}
                    </p>
                    <p className="text-xs italic text-muted-foreground">
                      &quot;{selectedStyleInfo.example}&quot;
                    </p>
                  </div>
                </div>
              </MicroAnimation>
            )}
            
            {/* Style Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {styleOptions.map((style, index) => (
                <MicroAnimation
                  key={style.key}
                  type="slideUp"
                  delay={400 + index * 100}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={cn(
                        "p-3 cursor-pointer transition-all duration-300 relative overflow-hidden",
                        "hover:shadow-lg hover:shadow-primary/20",
                        selectedStyle === style.key && "ring-2 ring-primary bg-primary/5"
                      )}
                      onClick={() => setSelectedStyle(style.key)}
                    >
                      {/* Background Gradient */}
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-10",
                        style.color
                      )} />
                      
                      <div className="relative space-y-2">
                        <div className="flex items-center justify-between">
                          <Wand2 className="w-4 h-4 text-primary" />
                          {selectedStyle === style.key && (
                            <Badge variant="default" className="text-xs">
                              Selected
                            </Badge>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-sm">{style.label}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {style.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </MicroAnimation>
              ))}
            </div>

            {/* Custom Prompt */}
            <AnimatePresence>
              {selectedStyle === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Custom enhancement instructions
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Describe how you want the lyrics to be enhanced (e.g., 'Make it more emotional', 'Add more metaphors', 'Increase the tempo')..."
                      className="w-full h-20 p-3 rounded-lg border border-border bg-background/50 resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </MicroAnimation>

      {/* Enhancement Button */}
      <MicroAnimation type="scale" trigger={!!inputText.trim()}>
        <div className="flex justify-center">
          <Button
            onClick={handleEnhance}
            disabled={!inputText.trim() || isEnhancing || (selectedStyle === 'custom' && !customPrompt.trim())}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 px-8 py-2"
            size="lg"
          >
            {isEnhancing ? (
              <MicroAnimation type="vinylSpin">
                <Sparkles className="w-5 h-5 mr-2" />
              </MicroAnimation>
            ) : (
              <Sparkles className="w-5 h-5 mr-2" />
            )}
            {isEnhancing ? 'Enhancing...' : 'Enhance Lyrics'}
          </Button>
        </div>
      </MicroAnimation>

      {/* Error Display */}
      {/* Error Display */}
      {error && (
        <div className="flex justify-center">
          <span className="text-sm text-red-500">{error}</span>
        </div>
      )}
      {/* Results */}
      <AnimatePresence>
        {enhancedResult && showComparison && (
          <motion.div initial={{ opacity: 0, y: 20 }}>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Enhancement Results</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(enhancedResult || "")}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!enhancedResult) return;
                      const blob = new Blob([enhancedResult], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'enhanced-lyrics.txt';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Enhanced Lyrics',
                          text: enhancedResult || '',
                        }).catch(() => {
                          alert('Sharing failed. Please try again.');
                        });
                      } else {
                        copyToClipboard(enhancedResult || '');
                        alert('Web Share API not supported. Lyrics copied to clipboard instead.');
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Original */}
                <MicroAnimation type="slideUp" delay={100}>
                  <Card className="p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Music className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-medium text-sm">Original</h3>
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-lg">
                      {inputText}
                    </div>
                  </Card>
                </MicroAnimation>

                {/* Enhanced */}
                <MicroAnimation type="slideUp" delay={200}>
                  <Card className="p-4 space-y-3 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h3 className="font-medium text-sm">Enhanced ({selectedStyleInfo?.label})</h3>
                    </div>
                    <div className="text-sm text-foreground whitespace-pre-wrap bg-background/50 p-3 rounded-lg">
                      {enhancedResult}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!enhancedResult) return;
                          // Placeholder analysis logic
                          alert('Analysis feature coming soon!\n\nEnhanced lyrics:\n' + enhancedResult);
                        }}
                      >
                        <Music className="w-4 h-4 mr-1" />
                        Analyze
                      </Button>
                    </div>
                  </Card>
                </MicroAnimation>
              </div>

              {/* Enhancement Actions */}
              <MicroAnimation type="slideUp" delay={300}>
                <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">Like the result?</h3>
                      <p className="text-xs text-muted-foreground">
                        Save to library, analyze further, or try a different style
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Music className="w-4 h-4 mr-1" />
                        Analyze
                      </Button>
                      <Button variant="outline" size="sm">
                        <Zap className="w-4 h-4 mr-1" />
                        Re-enhance
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary"
                        onClick={() => {
                          // Placeholder save logic
                          alert('Saved to library! (Feature coming soon)');
                        }}
                      >
                        Save to Library
                      </Button>
                    </div>
                  </div>
                </Card>
              </MicroAnimation>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
}
function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    // Fallback for older browsers: try to use execCommand, but warn about deprecation
    try {
      document.execCommand && document.execCommand("copy");
    } catch (e) {
      // If execCommand is not available, do nothing
    }
    document.body.removeChild(textarea);
  }
}
