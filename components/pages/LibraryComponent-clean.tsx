'use client';

import { useState, useEffect } from 'react';
import { 
  Music, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Edit,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface LibraryItem {
  id: string;
  title: string;
  artist: string;
  genre: string;
  dateAnalyzed: string;
  scores: {
    complexity: number;
    rhyme: number;
    flow: number;
    energy: number;
    structure: number;
  };
  overallScore: number;
  status: 'completed' | 'processing' | 'failed';
  thumbnail?: string;
}

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export function LibraryComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All Tracks', value: 'all' },
    { id: 'high-score', label: 'High Scores (80+)', value: 'high-score' },
    { id: 'recent', label: 'Recently Analyzed', value: 'recent' },
    { id: 'hip-hop', label: 'Hip-Hop', value: 'hip-hop' },
    { id: 'rock', label: 'Rock', value: 'rock' },
    { id: 'pop', label: 'Pop', value: 'pop' }
  ];

  useEffect(() => {
    // Simulate loading library data
    const mockLibrary: LibraryItem[] = [
      {
        id: '1',
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        genre: 'Rock',
        dateAnalyzed: '2024-01-15',
        scores: {
          complexity: 92,
          rhyme: 85,
          flow: 88,
          energy: 95,
          structure: 90
        },
        overallScore: 90,
        status: 'completed'
      },
      {
        id: '2',
        title: 'Lose Yourself',
        artist: 'Eminem',
        genre: 'Hip-Hop',
        dateAnalyzed: '2024-01-14',
        scores: {
          complexity: 88,
          rhyme: 94,
          flow: 96,
          energy: 92,
          structure: 85
        },
        overallScore: 91,
        status: 'completed'
      },
      {
        id: '3',
        title: 'Imagine',
        artist: 'John Lennon',
        genre: 'Pop',
        dateAnalyzed: '2024-01-13',
        scores: {
          complexity: 75,
          rhyme: 70,
          flow: 78,
          energy: 65,
          structure: 82
        },
        overallScore: 74,
        status: 'completed'
      },
      {
        id: '4',
        title: 'Hotel California',
        artist: 'Eagles',
        genre: 'Rock',
        dateAnalyzed: '2024-01-12',
        scores: {
          complexity: 86,
          rhyme: 82,
          flow: 84,
          energy: 88,
          structure: 90
        },
        overallScore: 86,
        status: 'processing'
      }
    ];

    setTimeout(() => {
      setLibraryItems(mockLibrary);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.artist.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (selectedFilter) {
      case 'high-score':
        return item.overallScore >= 80;
      case 'recent':
        return new Date(item.dateAnalyzed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      case 'hip-hop':
        return item.genre.toLowerCase() === 'hip-hop';
      case 'rock':
        return item.genre.toLowerCase() === 'rock';
      case 'pop':
        return item.genre.toLowerCase() === 'pop';
      default:
        return true;
    }
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getStatusColor = (status: LibraryItem['status']) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'processing': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Music className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Music Library
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Your analyzed tracks and insights
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            className="pl-10 bg-background/50 border-border"
            placeholder="Search tracks, artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {filterOptions.map((option) => (
            <Button
              key={option.id}
              variant={selectedFilter === option.value ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap text-xs"
              onClick={() => setSelectedFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Library Grid */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                  selectedItem === item.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card/50 hover:border-primary/50 hover:bg-card/70"
                )}
                onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
              >
                <div className="space-y-4">
                  {/* Track Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Music className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-foreground truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.artist} • {item.genre}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.dateAnalyzed).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className={cn(
                          "text-lg font-bold",
                          getScoreColor(item.overallScore)
                        )}>
                          {item.overallScore}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Overall
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getStatusColor(item.status))}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Detailed Scores */}
                  {selectedItem === item.id && (
                    <div className="space-y-4 pt-4 border-t border-border">
                      <h4 className="font-semibold text-sm">Detailed Analysis</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(item.scores).map(([key, score]) => (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="capitalize">{key}</span>
                              <span className={getScoreColor(score)}>{score}/100</span>
                            </div>
                            <Progress value={score} className="h-1.5" />
                          </div>
                        ))}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            <Edit className="w-3 h-3 mr-1" />
                            Re-analyze
                          </Button>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            <Download className="w-3 h-3 mr-1" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            <Share2 className="w-3 h-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Music className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No tracks found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
