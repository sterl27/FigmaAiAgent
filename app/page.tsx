'use client';

import { useState } from 'react';
/**
 * Props for the AppShell component.
 * @property onNavigate - Callback to handle navigation between pages.
 * @property currentPage - The currently active page key.
 */
import { AppShell } from "@/src/components/shell/AppShell";

import { UnifiedAnalysisDashboard } from "@/components/pages/UnifiedAnalysisDashboard";
import { ProDashboard } from "@/components/pages/ProDashboard";
import { LibraryComponent } from "@/components/pages/LibraryComponent";
import { Enhance } from "@/components/pages/Enhance";
import AdvancedChat from "@/components/pages/AdvancedChat";
import Alic3XProChat from "@/components/pages/Alic3XProChat";

const pageComponents = {
  analyze: UnifiedAnalysisDashboard,
  enhance: Enhance,
  library: LibraryComponent,
  dashboard: ProDashboard,
  chat: AdvancedChat,
  alic3x: Alic3XProChat,
};


export default function MusaixApp() {
  const [activePage, setActivePage] = useState<keyof typeof pageComponents>(
    Object.keys(pageComponents)[0] as keyof typeof pageComponents
  );
  
  const handleNavigate = (page: string) => {
    if (page in pageComponents) {
      setActivePage(page as keyof typeof pageComponents);
    } else {
      setActivePage(Object.keys(pageComponents)[0] as keyof typeof pageComponents); // fallback to default page
    }
  };
  const CurrentPageComponent = pageComponents[activePage];

  // AppShell expects props:
  // - onNavigate: (page: string) => void - function to handle navigation between pages
  // - currentPage: string - the currently active page key
  // See "@/src/components/shell/AppShell" for full prop types and details.
  return (
    <AppShell onNavigate={handleNavigate} currentPage={activePage}>
      <CurrentPageComponent />
    </AppShell>
  );
}
