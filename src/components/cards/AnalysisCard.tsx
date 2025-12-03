'use client';

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Brain, Music, Zap, Target, BarChart3 } from "lucide-react";

interface AnalysisCardProps {
  type: string;
  score: number;
  confidence: number;
  details: string;
}

const iconMap = {
  complexity: Brain,
  rhyme: Music,
  flow: Zap,
  energy: Target,
  structure: BarChart3,
};

const colorMap = {
  complexity: "text-purple-500",
  rhyme: "text-blue-500", 
  flow: "text-green-500",
  energy: "text-orange-500",
  structure: "text-red-500",
};

export function AnalysisCard({ type, score, confidence, details }: AnalysisCardProps) {
  const Icon = iconMap[type as keyof typeof iconMap] || Brain;
  const color = colorMap[type as keyof typeof colorMap] || "text-gray-500";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card border rounded-lg p-3"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-sm font-medium capitalize">{type}</span>
        </div>
        <span className="text-lg font-bold">{score}%</span>
      </div>
      
      <Progress value={score} className="h-2 mb-2" />
      
      <p className="text-xs text-muted-foreground">{details}</p>
      
      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
        <span>Confidence: {confidence}%</span>
      </div>
    </motion.div>
  );
}
