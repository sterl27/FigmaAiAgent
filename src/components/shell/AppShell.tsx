'use client';

import { useState, useEffect } from "react";
import { MessageCircle, Library, User, Settings, Mic, Music, AudioWaveform, BarChart3 } from "lucide-react";
import { ThemeToggle } from "../theme/ThemeToggle";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  animation?: 'musicPulse' | 'waveform' | 'pulse' | 'glow';
}

export function AppShell({ children, onNavigate, currentPage }: AppShellProps) {
  const [activeTab, setActiveTab] = useState(currentPage || 'analyze');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (currentPage && currentPage !== activeTab) {
      setActiveTab(currentPage);
    }
  }, [currentPage, activeTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onNavigate?.(tabId);
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navItems: NavItem[] = [
    { 
      id: 'analyze', 
      label: 'Analyze', 
      icon: BarChart3, 
      component: () => null,
      animation: 'waveform'
    },
    { 
      id: 'enhance', 
      label: 'Enhance', 
      icon: AudioWaveform, 
      component: () => null,
      animation: 'musicPulse'
    },
    { 
      id: 'chat', 
      label: 'Chat', 
      icon: MessageCircle, 
      component: () => null,
      animation: 'pulse'
    },
    { 
      id: 'library', 
      label: 'Library', 
      icon: Library, 
      component: () => null,
      animation: 'pulse'
    },
    { 
      id: 'dashboard', 
      label: 'Pro', 
      icon: Music, 
      component: () => null,
      animation: 'glow'
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header with Musaix Branding */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Musaix
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Connection Status */}
            <div className={cn(
              "w-2 h-2 rounded-full",
              isOnline ? "bg-green-500" : "bg-red-500"
            )} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full">
          {children}
        </div>
      </main>

      {/* Enhanced Bottom Navigation */}
      <nav className="border-t border-border/50 bg-background/90 backdrop-blur-lg">
        <div className="flex items-center justify-between py-2 px-4 max-w-md mx-auto">
          <div className="flex items-center justify-around flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-xl transition-all duration-300 relative",
                    "hover:bg-primary/10 active:scale-95",
                    isActive 
                      ? "text-primary bg-primary/15" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {/* Active indicator with gradient */}
                  {isActive && (
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl"
                      />
                    )}
                    
                    <Icon className={cn(
                      "w-5 h-5 mb-1 transition-all duration-300",
                      isActive ? "text-primary drop-shadow-sm" : ""
                    )} />
                    
                    <span className={cn(
                      "text-xs font-medium transition-all duration-300",
                      isActive ? "text-primary" : ""
                    )}>
                      {item.label}
                    </span>
                    
                    {/* Pulse indicator for active tab */}
                    {isActive && (
                      <div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                      />
                    )}
                  </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
