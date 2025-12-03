'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Mic, 
  Layers, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  Download,
  Share2,
  Loader2
} from 'lucide-react';
import BeatGeneratorSimple, { BeatData } from './BeatGeneratorSimple';
import LyricsAnalyzer from './LyricsAnalyzerSimple';

interface ProjectData {
  id: string;
  name: string;
  beat?: BeatData;
  lyricsAnalysis?: any;
  createdAt: string;
  status: 'draft' | 'analyzing' | 'complete';
}

export default function IntegratedMusicSuite() {
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [workflowStep, setWorkflowStep] = useState(1);

  useEffect(() => {
    // Load saved projects from localStorage
    const savedProjects = localStorage.getItem('musicProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const createNewProject = () => {
    const newProject: ProjectData = {
      id: Date.now().toString(),
      name: `Project ${projects.length + 1}`,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    setCurrentProject(newProject);
    setProjects(prev => [...prev, newProject]);
    setWorkflowStep(1);
    setActiveTab('beat-generator');
  };

  const saveProjects = (updatedProjects: ProjectData[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('musicProjects', JSON.stringify(updatedProjects));
  };

  const updateCurrentProject = (updates: Partial<ProjectData>) => {
    if (!currentProject) return;

    const updatedProject = { ...currentProject, ...updates };
    setCurrentProject(updatedProject);

    const updatedProjects = projects.map(p => 
      p.id === currentProject.id ? updatedProject : p
    );
    saveProjects(updatedProjects);
  };

  const handleBeatGenerated = (beatData: BeatData) => {
    updateCurrentProject({ 
      beat: beatData,
      status: 'analyzing'
    });
    setWorkflowStep(2);
    setActiveTab('lyrics-analyzer');
  };

  const handleLyricsAnalyzed = (analysisData: any) => {
    updateCurrentProject({ 
      lyricsAnalysis: analysisData,
      status: 'complete'
    });
    setWorkflowStep(3);
    setActiveTab('integration');
  };

  const exportProject = () => {
    if (!currentProject || !currentProject.beat || !currentProject.lyricsAnalysis) return;

    const exportData = {
      projectName: currentProject.name,
      beat: currentProject.beat,
      lyrics: currentProject.lyricsAnalysis,
      exportedAt: new Date().toISOString(),
      instructions: generateIntegrationInstructions()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.name.replace(/\s+/g, '_')}_complete.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateIntegrationInstructions = () => {
    if (!currentProject?.beat || !currentProject?.lyricsAnalysis) return [];

    const beat = currentProject.beat;
    const analysis = currentProject.lyricsAnalysis;

    return [
      `Create new Ableton Live session at ${beat.tempo} BPM`,
      `Set up drum rack with ${beat.genre} samples`,
      `Import beat pattern: Kick on ${beat.pattern.kick.join(', ')}, Snare on ${beat.pattern.snare.join(', ')}`,
      `Add Hi-hats on ${beat.pattern.hihat.join(', ')}`,
      `Consider the song's mood: ${analysis.meaning || 'energetic'} when arranging`,
      `Match the lyrical themes with appropriate sound design`,
      `Use vocal processing to complement the analyzed emotion`,
      `Structure the track based on typical ${beat.genre} arrangements`
    ];
  };

  return (
    <div className="w-full space-y-6">
      {/* Workflow Progress */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Integrated Music Production Workflow
          </CardTitle>
          <CardDescription>
            Complete music production suite combining AI beat generation with intelligent lyrics analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  ${workflowStep >= step 
                    ? 'bg-blue-600 text-white dark:bg-blue-500' 
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }
                `}>
                  {workflowStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 3 && (
                  <ArrowRight className={`
                    h-4 w-4 mx-4
                    ${workflowStep > step ? 'text-blue-600' : 'text-gray-400'}
                  `} />
                )}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className={workflowStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-600'}>
              Generate AI Beat
            </div>
            <div className={workflowStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-600'}>
              Analyze Lyrics
            </div>
            <div className={workflowStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-600'}>
              Integrate & Export
            </div>
          </div>

          {!currentProject && (
            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
              <Button 
                onClick={createNewProject}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <Music className="h-4 w-4 mr-2" />
                Start New Music Project
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Project Status */}
      {currentProject && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  {currentProject.name}
                </CardTitle>
                <CardDescription>
                  Created {new Date(currentProject.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge variant={
                currentProject.status === 'complete' ? 'default' :
                currentProject.status === 'analyzing' ? 'secondary' : 'outline'
              }>
                {currentProject.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Beat: {currentProject.beat ? '✓ Generated' : '○ Pending'}
              </div>
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Lyrics: {currentProject.lyricsAnalysis ? '✓ Analyzed' : '○ Pending'}
              </div>
            </div>
            
            {currentProject.status === 'complete' && (
              <div className="mt-4 flex gap-2">
                <Button onClick={exportProject} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Project
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="beat-generator">Beat Generator</TabsTrigger>
          <TabsTrigger value="lyrics-analyzer">Lyrics Analyzer</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Music Production Suite Features</CardTitle>
              <CardDescription>
                Comprehensive tools for modern music production workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    AI Beat Generation
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Genre-specific drum patterns</li>
                    <li>• Customizable tempo and complexity</li>
                    <li>• Ableton Live integration instructions</li>
                    <li>• MIDI pattern export</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Intelligent Lyrics Analysis
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Song meaning interpretation</li>
                    <li>• Mood and theme analysis</li>
                    <li>• Musical context understanding</li>
                    <li>• Production recommendations</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Integration Benefits</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  When you generate a beat and analyze lyrics together, the system provides 
                  intelligent recommendations for matching musical elements with lyrical themes, 
                  creating more cohesive and emotionally resonant productions.
                </p>
              </div>

              {projects.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Recent Projects</h4>
                  <div className="space-y-2">
                    {projects.slice(-3).map((project) => (
                      <div 
                        key={project.id}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded"
                      >
                        <span className="text-sm">{project.name}</span>
                        <Badge variant="outline">
                          {project.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="beat-generator">
          <BeatGeneratorSimple onBeatGenerated={handleBeatGenerated} />
        </TabsContent>

        <TabsContent value="lyrics-analyzer">
          <LyricsAnalyzer onAnalysisComplete={handleLyricsAnalyzed} />
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          {currentProject?.beat && currentProject?.lyricsAnalysis ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Production Integration Guide
                </CardTitle>
                <CardDescription>
                  Combine your generated beat with analyzed lyrics for professional production
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Beat Summary */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Generated Beat</h4>
                    <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded">
                      <p className="text-sm"><strong>Genre:</strong> {currentProject.beat.genre}</p>
                      <p className="text-sm"><strong>Tempo:</strong> {currentProject.beat.tempo} BPM</p>
                      <p className="text-sm"><strong>Complexity:</strong> {currentProject.beat.complexity}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Lyrics Analysis</h4>
                    <div className="bg-green-50 dark:bg-green-950/40 p-3 rounded">
                      <p className="text-sm"><strong>Song:</strong> {currentProject.lyricsAnalysis.title || 'Analyzed'}</p>
                      <p className="text-sm"><strong>Artist:</strong> {currentProject.lyricsAnalysis.artist || 'Various'}</p>
                      <p className="text-sm"><strong>Analysis:</strong> Available</p>
                    </div>
                  </div>
                </div>

                {/* Integration Instructions */}
                <div>
                  <h4 className="font-medium mb-3">Ableton Live Integration Steps</h4>
                  <div className="space-y-2">
                    {generateIntegrationInstructions().map((instruction, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm">{instruction}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Export Options */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Export Options</h4>
                  <div className="flex gap-2">
                    <Button onClick={exportProject}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Complete Project
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share with Collaborators
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <div>
                    <h3 className="font-medium">Waiting for Beat and Lyrics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Complete both beat generation and lyrics analysis to see integration options
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
