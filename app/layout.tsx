import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";
// Update the import path if 'sonner' is located elsewhere, for example:
import { Toaster } from "@/components/ui/sonner";
// Or, if the file does not exist, create 'sonner.tsx' or 'sonner/index.tsx' in the appropriate directory.
import { ThemeProvider } from "@/src/components/theme/ThemeProvider";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Musaix Pro | AI-Powered Lyric Analysis & Enhancement",
  description: "Discover deeper meanings in your favorite songs with AI-powered analysis. Enhance lyrics, explore themes, and uncover artistic insights through intelligent conversation.",
  keywords: ["lyrics", "AI", "music analysis", "song meanings", "lyric enhancement", "music AI"],
  authors: [{ name: "Musaix Pro", url: "https://musaix.pro/" }],
  creator: "Musaix Pro",
  metadataBase: new URL("https://musaix.pro/"),
  alternates: {
    canonical: "/",
    languages: {
      'en-US': "/en-us",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Musaix Pro | AI-Powered Lyric Analysis & Enhancement",
    description: "Discover deeper meanings in your favorite songs with AI-powered analysis. Enhance lyrics, explore themes, and uncover artistic insights through intelligent conversation.",
    url: "https://musaix.pro/",
    images: [
      {
        url: "/app_preview.png", // Path to the image in the public folder
        width: 1200, // Optional: specify width
        height: 630, // Optional: specify height
        alt: "Preview Image", // Optional: alt text for the image
      },
      {
        url: "/avatar.png", // Square image for mobile previews
        width: 1200,
        height: 1200,
        alt: "Musaix Pro AI Assistant",
      },
      // Fallback image if /app_preview.png is missing
      {
        url: "/fallback_preview.png",
        width: 1200,
        height: 630,
        alt: "Fallback Preview Image",
      },
    ],
    type: "website",
    locale: "en_US",
    siteName: "Musaix Pro",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Musaix Pro | AI-Powered Lyric Analysis & Enhancement",
    description: "Discover deeper meanings in your favorite songs with AI-powered analysis. Enhance lyrics, explore themes, and uncover artistic insights through intelligent conversation.",
    images: ['/app_preview.png'],
    creator: "@saraceni_br",
    site: "@saraceni_br",
  },
};

// The suppressHydrationWarning prop is used on <html> to prevent hydration mismatch warnings
// caused by dynamic theme or font class changes between server-side rendering and client hydration.
// This is necessary because ThemeProvider and font loading may result in different class names on SSR vs client.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  );
}

// Long description 1
// Figma AI Assistant transforms how designers work by providing instant answers to Figma questions and automating UI component creation. Skip the learning curve and design documentation—simply ask and create. Whether you're troubleshooting design issues, seeking best practices, or wanting to generate components on the fly, this AI-powered tool streamlines your workflow and boosts productivity. Elevate your Figma experience with intelligent assistance that helps you design smarter, not harder.

// Lomg description 2
// Figma AI Assistant is your intelligent design companion that provides instant answers to all your Figma questions while automating UI component creation. It eliminates hours of searching through documentation and tutorials, allowing you to focus on what matters—creating exceptional designs. Perfect for both beginners and professionals, this tool helps you overcome technical hurdles, implement best practices, and accelerate your workflow with AI-powered guidance. Design smarter and faster with Figma AI Assistant.

// Short description
// Figma AI Assistant delivers instant answers to your Figma questions and automates UI component creation. Skip the documentation and design faster with AI-powered guidance. Perfect for beginners and professionals alike, it's your intelligent companion for streamlining workflows and enhancing productivity.