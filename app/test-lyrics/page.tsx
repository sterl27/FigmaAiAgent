'use client';

import LyricsAnalyzer from '@/components/music/LyricsAnalyzerSimple';

export default function TestLyricsPage() {
  const handleAnalysisComplete = (analysis: any) => {
    console.log('Analysis completed:', analysis);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Test Lyrics Analyzer</h1>
        <LyricsAnalyzer onAnalysisComplete={handleAnalysisComplete} />
      </div>
    </div>
  );
}
