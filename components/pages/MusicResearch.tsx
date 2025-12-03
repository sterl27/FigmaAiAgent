"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Music, 
  Clock, 
  Calendar, 
  Disc, 
  Headphones, 
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface MusicProfile {
  title: string;
  artist: string;
  bpm: number | null;
  key: string | null;
  genre: string | null;
  year: number | null;
  summary: string | null;
  wikipedia_url: string | null;
  confidence_score: number;
  sources: string[];
  additional_metadata: Record<string, any>;
  research_timestamp: string;
}

interface SearchResult {
  success: boolean;
  data?: MusicProfile;
  error?: string;
  message?: string;
}

export default function MusicResearchDashboard() {
  const [searchQuery, setSearchQuery] = useState({
    title: '',
    artist: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [searchHistory, setSearchHistory] = useState<MusicProfile[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.title.trim()) {
      setSearchResult({
        success: false,
        error: 'Please enter a song title'
      });
      return;
    }

    setIsLoading(true);
    setSearchResult(null);

    try {
      const response = await fetch('/api/music/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: searchQuery.title,
          artist: searchQuery.artist,
          useGptFallback: true
        })
      });

      const result: SearchResult = await response.json();
      setSearchResult(result);

      // Add to history if successful
      if (result.success && result.data) {
        setSearchHistory(prev => [result.data!, ...prev.slice(0, 4)]); // Keep last 5
      }

    } catch (error) {
      setSearchResult({
        success: false,
        error: 'Failed to connect to research service'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSearch = (title: string, artist: string) => {
    setSearchQuery({ title, artist });
    handleSearch();
  };

  const quickSearchSongs = [
    { title: "Midnight City", artist: "M83" },
    { title: "Bohemian Rhapsody", artist: "Queen" },
    { title: "Blinding Lights", artist: "The Weeknd" },
    { title: "Shape of You", artist: "Ed Sheeran" },
    { title: "Hotel California", artist: "Eagles" }
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500";
    if (confidence >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return "High";
    if (confidence >= 0.6) return "Medium";
    return "Low";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Music className="h-8 w-8 text-blue-600" />
          Music Research Agent
        </h1>
        <p className="text-gray-600">
          Comprehensive music metadata research using multiple APIs and AI
        </p>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Song Research
          </CardTitle>
          <CardDescription>
            Enter a song title and artist to get comprehensive metadata including BPM, key, genre, and more
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Label htmlFor="title">Song Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Midnight City"
                value={searchQuery.title}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, title: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="artist">Artist (Optional)</Label>
              <Input
                id="artist"
                placeholder="e.g., M83"
                value={searchQuery.artist}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, artist: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button 
                onClick={handleSearch}
                disabled={isLoading || !searchQuery.title.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Research Song
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Search Examples */}
          <div className="space-y-2">
            <Label>Quick Search Examples:</Label>
            <div className="flex flex-wrap gap-2">
              {quickSearchSongs.map((song, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSearch(song.title, song.artist)}
                  disabled={isLoading}
                >
                  {song.title} - {song.artist}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {searchResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              Research Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchResult.success && searchResult.data ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  <TabsTrigger value="sources">Sources</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold">{searchResult.data.title}</h3>
                        <p className="text-lg text-gray-600">by {searchResult.data.artist}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {searchResult.data.year && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{searchResult.data.year}</span>
                          </div>
                        )}
                        {searchResult.data.genre && (
                          <div className="flex items-center gap-2">
                            <Disc className="h-4 w-4 text-gray-500" />
                            <span>{searchResult.data.genre}</span>
                          </div>
                        )}
                      </div>

                      {searchResult.data.summary && (
                        <div>
                          <h4 className="font-semibold mb-2">Summary</h4>
                          <p className="text-sm text-gray-600 line-clamp-4">
                            {searchResult.data.summary}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confidence and Links */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Research Confidence</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getConfidenceColor(searchResult.data.confidence_score)}`}
                              style={{ width: `${searchResult.data.confidence_score * 100}%` }}
                            />
                          </div>
                          <Badge variant="secondary">
                            {getConfidenceText(searchResult.data.confidence_score)} 
                            ({(searchResult.data.confidence_score * 100).toFixed(1)}%)
                          </Badge>
                        </div>
                      </div>

                      {searchResult.data.wikipedia_url && (
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(searchResult.data!.wikipedia_url!, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on Wikipedia
                          </Button>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold mb-2">Data Sources</h4>
                        <div className="flex flex-wrap gap-1">
                          {searchResult.data.sources.map((source, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {searchResult.data.bpm && (
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="text-2xl font-bold">{searchResult.data.bpm}</p>
                              <p className="text-sm text-gray-600">BPM</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {searchResult.data.key && (
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2">
                            <Music className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="text-2xl font-bold">{searchResult.data.key}</p>
                              <p className="text-sm text-gray-600">Key</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {searchResult.data.additional_metadata?.energy && (
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2">
                            <Headphones className="h-5 w-5 text-purple-600" />
                            <div>
                              <p className="text-2xl font-bold">{searchResult.data.additional_metadata.energy}</p>
                              <p className="text-sm text-gray-600">Energy</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {Object.keys(searchResult.data.additional_metadata).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Additional Audio Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(searchResult.data.additional_metadata).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <p className="text-lg font-semibold">{String(value)}</p>
                              <p className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="metadata" className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Raw Metadata</h4>
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                      {JSON.stringify(searchResult.data, null, 2)}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="sources" className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Data Sources Used</h4>
                    <div className="grid gap-3">
                      {searchResult.data.sources.map((source, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{source}</Badge>
                              <span className="text-sm text-gray-600">
                                {source === 'wikipedia' && 'Encyclopedic information'}
                                {source === 'songbpm' && 'BPM and musical key data'}
                                {source === 'musicbrainz' && 'Music metadata database'}
                                {source === 'gpt' && 'AI-powered analysis and synthesis'}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <Info className="h-4 w-4 inline mr-1" />
                      Research completed at {new Date(searchResult.data.research_timestamp).toLocaleString()}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-700 mb-2">Research Failed</h3>
                <p className="text-gray-600">{searchResult.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search History */}
      {searchHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Searches</CardTitle>
            <CardDescription>Your recent music research history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {searchHistory.map((song, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleQuickSearch(song.title, song.artist)}
                >
                  <div>
                    <p className="font-medium">{song.title}</p>
                    <p className="text-sm text-gray-600">by {song.artist}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {song.bpm && <Badge variant="outline">{song.bpm} BPM</Badge>}
                    {song.key && <Badge variant="outline">{song.key}</Badge>}
                    <Badge variant="secondary">
                      {getConfidenceText(song.confidence_score)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
