'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Music, Target, Zap } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { label: 'Songs Analyzed', value: 23, icon: Music, color: 'text-blue-500' },
    { label: 'Avg Complexity', value: 78, icon: Target, color: 'text-green-500' },
    { label: 'Enhanced Today', value: 5, icon: Zap, color: 'text-purple-500' },
    { label: 'Growth Score', value: 92, icon: TrendingUp, color: 'text-orange-500' },
  ];

  const recentAnalyses = [
    { title: 'Summer Vibes', complexity: 85, rhyme: 92, flow: 78 },
    { title: 'Night Thoughts', complexity: 91, rhyme: 76, flow: 88 },
    { title: 'City Dreams', complexity: 73, rhyme: 89, flow: 82 },
  ];

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-2">Welcome back! 🎵</h2>
        <p className="text-muted-foreground">
          Ready to analyze and enhance your lyrics?
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump into your lyric workflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Music className="w-4 h-4 mr-2" />
              Analyze New Lyrics
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Zap className="w-4 h-4 mr-2" />
              Enhance Latest Song
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Analyses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>Your latest lyric breakdowns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAnalyses.map((analysis, index) => (
              <div key={analysis.title} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{analysis.title}</h4>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((analysis.complexity + analysis.rhyme + analysis.flow) / 3)}%
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Complexity</span>
                    <span>{analysis.complexity}%</span>
                  </div>
                  <Progress value={analysis.complexity} className="h-1" />
                  
                  <div className="flex justify-between text-xs">
                    <span>Rhyme</span>
                    <span>{analysis.rhyme}%</span>
                  </div>
                  <Progress value={analysis.rhyme} className="h-1" />
                  
                  <div className="flex justify-between text-xs">
                    <span>Flow</span>
                    <span>{analysis.flow}%</span>
                  </div>
                  <Progress value={analysis.flow} className="h-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
