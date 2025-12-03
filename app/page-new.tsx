'use client';

import { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Dashboard } from '@/components/pages/Dashboard';
import { Analyze } from '@/components/pages/AnalyzeFixed';
import { Enhance } from '@/components/pages/Enhance';
import { Library } from '@/components/pages/Library';

// Simple Profile component for now
function Profile() {
  return (
    <div className="p-4 space-y-6 pb-20">
      <h2 className="text-3xl font-bold mb-2">Profile 👤</h2>
      <p className="text-muted-foreground">
        Profile page coming soon...
      </p>
    </div>
  );
}

export default function MusaixApp() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'analyze':
        return <Analyze />;
      case 'enhance':
        return <Enhance />;
      case 'library':
        return <Library />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MobileLayout currentTab={currentTab} onTabChange={setCurrentTab}>
      {renderCurrentPage()}
    </MobileLayout>
  );
}
