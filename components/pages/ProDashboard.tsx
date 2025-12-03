'use client';

import { useState, useEffect } from 'react';
import { 
  Music, 
  AudioWaveform, 
  BarChart3, 
  Brain, 
  Zap, 
  Library, 
  TrendingUp, 
  Users, 
  Clock, 
  Star,
  Play,
  Pause,
  Settings,
  Download,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface ActivityItem {
  id: string;
  type: 'analysis' | 'enhancement' | 'export';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
}

export function ProDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const metrics: DashboardMetric[] = [
    {
      id: 'tracks',
      label: 'Tracks Analyzed',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Music,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'scores',
      label: 'Avg. Score',
      value: '78.3',
      change: '+5.2%',
      changeType: 'positive',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'complexity',
      label: 'AI Insights',
      value: '1,523',
      change: '+18.7%',
      changeType: 'positive',
      icon: Brain,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'users',
      label: 'Active Users',
      value: '156',
      change: '+3.1%',
      changeType: 'positive',
      icon: Users,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'analyze',
      label: 'Quick Analysis',
      description: 'Analyze new lyrics instantly',
      icon: AudioWaveform,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'enhance',
      label: 'Enhance Lyrics',
      description: 'AI-powered improvements',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'library',
      label: 'Browse Library',
      description: 'Explore saved analyses',
      icon: Library,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'export',
      label: 'Export Results',
      description: 'Download as PDF/JSON',
      icon: Download,
      color: 'from-orange-500 to-red-500'
    }
  ];

  useEffect(() => {
    // Simulate loading recent activity
    const mockActivity: ActivityItem[] = [
      {
        id: '1',
        type: 'analysis',
        title: 'Analyzed "Bohemian Rhapsody"',
        description: 'Complexity: 92/100, Rhyme: 85/100',
        timestamp: '2 minutes ago',
        status: 'completed'
      },
      {
        id: '2',
        type: 'enhancement',
        title: 'Enhanced "Imagine" lyrics',
        description: 'Applied advanced flow optimization',
        timestamp: '15 minutes ago',
        status: 'completed'
      },
      {
        id: '3',
        type: 'export',
        title: 'Exported analysis report',
        description: 'PDF generated for 5 tracks',
        timestamp: '1 hour ago',
        status: 'completed'
      },
      {
        id: '4',
        type: 'analysis',
        title: 'Processing "Hotel California"',
        description: 'Advanced semantic analysis in progress',
        timestamp: '2 hours ago',
        status: 'processing'
      }
    ];
    setRecentActivity(mockActivity);
  }, []);

  const getStatusColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'processing': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'analysis': return BarChart3;
      case 'enhancement': return Zap;
      case 'export': return Download;
      default: return Clock;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background p-4 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Music className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Musaix Pro
            </h1>
            <p className="text-sm text-muted-foreground">Advanced Music Analysis Dashboard</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isSelected = selectedMetric === metric.id;
          
          return (
            <div
              key={metric.id}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/10 scale-105"
                  : "border-border bg-card/50 hover:border-primary/50 hover:bg-card/70"
              )}
              onClick={() => setSelectedMetric(isSelected ? null : metric.id)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r",
                    metric.color
                  )}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className={cn(
                    "text-xs font-medium",
                    metric.changeType === 'positive' ? 'text-green-500' : 
                    metric.changeType === 'negative' ? 'text-red-500' : 'text-muted-foreground'
                  )}>
                    {metric.change}
                  </div>
                </div>
                
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <div
                key={action.id}
                className="p-4 rounded-xl border border-border bg-card/50 hover:border-primary/50 hover:bg-card/70 cursor-pointer transition-all duration-200 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r transition-transform group-hover:scale-110",
                      action.color
                    )}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{action.label}</h3>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          <Button variant="outline" size="sm" className="text-xs">
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          <Card className="p-4 space-y-4 bg-card/50 backdrop-blur-sm border-primary/20">
            {recentActivity.map((item, index) => {
              const Icon = getActivityIcon(item.type);
              
              return (
                <div
                  key={item.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getStatusColor(item.status))}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {item.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Performance Overview</h2>
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Analysis Accuracy</span>
              <span className="text-sm text-muted-foreground">92.3%</span>
            </div>
            <Progress value={92.3} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Processing Speed</span>
              <span className="text-sm text-muted-foreground">1.2s avg</span>
            </div>
            <Progress value={85} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">User Satisfaction</span>
              <span className="text-sm text-muted-foreground">4.8/5</span>
            </div>
            <Progress value={96} className="h-2" />
          </div>
        </Card>
      </div>
    </div>
  );
}
