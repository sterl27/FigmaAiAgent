'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Music, Clock, Star, MoreVertical, Play } from 'lucide-react';

interface LibraryItem {
  id: string;
  title: string;
  artist?: string;
  type: 'original' | 'analyzed' | 'enhanced';
  createdAt: string;
  scores?: {
    complexity: number;
    rhyme: number;
    flow: number;
    energy: number;
    structure: number;
  };
  isBookmarked?: boolean;
  enhancementStyle?: string;
}

export function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const mockLibraryItems: LibraryItem[] = [
    {
      id: '1',
      title: 'Summer Vibes',
      artist: 'You',
      type: 'analyzed',
      createdAt: '2025-01-15',
      scores: { complexity: 85, rhyme: 92, flow: 78, energy: 89, structure: 76 },
      isBookmarked: true
    },
    {
      id: '2',
      title: 'Night Thoughts Enhanced',
      artist: 'You',
      type: 'enhanced',
      createdAt: '2025-01-14',
      enhancementStyle: 'Tyler, The Creator',
      scores: { complexity: 91, rhyme: 76, flow: 88, energy: 82, structure: 85 },
      isBookmarked: false
    },
    {
      id: '3',
      title: 'City Dreams',
      artist: 'You',
      type: 'original',
      createdAt: '2025-01-13',
      isBookmarked: false
    },
    {
      id: '4',
      title: 'Memories Enhanced',
      artist: 'You',
      type: 'enhanced',
      createdAt: '2025-01-12',
      enhancementStyle: 'Kendrick Lamar',
      scores: { complexity: 88, rhyme: 94, flow: 86, energy: 91, structure: 89 },
      isBookmarked: true
    },
    {
      id: '5',
      title: 'Late Night Vibes',
      artist: 'You',
      type: 'analyzed',
      createdAt: '2025-01-11',
      scores: { complexity: 73, rhyme: 89, flow: 82, energy: 76, structure: 84 },
      isBookmarked: false
    }
  ];

  const filteredItems = mockLibraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.enhancementStyle?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'bookmarked' && item.isBookmarked) ||
                      (activeTab === 'analyzed' && item.type === 'analyzed') ||
                      (activeTab === 'enhanced' && item.type === 'enhanced');
    
    return matchesSearch && matchesTab;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'original': return 'bg-gray-100 text-gray-700';
      case 'analyzed': return 'bg-blue-100 text-blue-700';
      case 'enhanced': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAverageScore = (scores?: LibraryItem['scores']) => {
    if (!scores) return null;
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return Math.round(total / Object.keys(scores).length);
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-2">Library 📁</h2>
        <p className="text-muted-foreground">
          Your collection of analyzed and enhanced lyrics
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            <TabsTrigger value="analyzed">Analyzed</TabsTrigger>
            <TabsTrigger value="enhanced">Enhanced</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Library Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="space-y-4"
      >
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search query' : 'Start analyzing some lyrics to build your library'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        {item.isBookmarked && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getTypeColor(item.type)}>
                          {item.type}
                        </Badge>
                        {item.enhancementStyle && (
                          <Badge variant="outline">
                            {item.enhancementStyle}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        {item.artist && (
                          <div className="flex items-center gap-1">
                            <Music className="w-4 h-4" />
                            {item.artist}
                          </div>
                        )}
                      </div>

                      {item.scores && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Overall Score</span>
                            <span className="text-lg font-bold text-primary">
                              {getAverageScore(item.scores)}%
                            </span>
                          </div>
                          <div className="grid grid-cols-5 gap-2 text-xs">
                            <div className="text-center">
                              <div className="font-medium">{item.scores.complexity}</div>
                              <div className="text-muted-foreground">Complex</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{item.scores.rhyme}</div>
                              <div className="text-muted-foreground">Rhyme</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{item.scores.flow}</div>
                              <div className="text-muted-foreground">Flow</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{item.scores.energy}</div>
                              <div className="text-muted-foreground">Energy</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{item.scores.structure}</div>
                              <div className="text-muted-foreground">Structure</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
