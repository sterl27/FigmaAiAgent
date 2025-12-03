export interface LyricAnalysis {
  id: string;
  lyrics: string;
  timestamp: Date;
  complexity: ComplexityAnalysis;
  rhyme: RhymeAnalysis;
  flow: FlowAnalysis;
  energy: EnergyAnalysis;
  structure: StructureAnalysis;
  enhancement?: EnhancementSuggestions;
}

export interface ComplexityAnalysis {
  overall: number; // 0-100 complexity score
  linguistic: {
    vocabularyDiversity: number;
    readabilityScore: number;
    semanticDensity: number;
    confidence: number;
  };
  structural: {
    rhymeComplexity: number;
    meterConsistency: number;
    patternVariation: number;
    confidence: number;
  };
  semantic: {
    metaphorUsage: number;
    narrativeDepth: number;
    emotionalComplexity: number;
    confidence: number;
  };
  creative: {
    originalityScore: number;
    styleInnovation: number;
    wordplayLevel: number;
    confidence: number;
  };
}

export interface RhymeAnalysis {
  scheme: string; // e.g., "ABAB CDCD EFEF"
  patterns: RhymePattern[];
  phonetic: PhoneticMatch[];
  confidence: number;
  notation: string;
}

export interface RhymePattern {
  type: 'perfect' | 'near' | 'slant' | 'assonance' | 'consonance';
  words: string[];
  lines: number[];
  confidence: number;
}

export interface PhoneticMatch {
  word1: string;
  word2: string;
  similarity: number;
  type: 'ending' | 'internal' | 'multisyllabic';
}

export interface FlowAnalysis {
  overall: number; // 0-100 flow quality score
  syllables: {
    pattern: number[]; // syllables per line
    consistency: number;
    average: number;
  };
  stress: {
    points: StressPoint[];
    pattern: string;
    naturalness: number;
  };
  breathing: {
    points: number[]; // breath points in lines
    difficulty: number; // 0-100
    sustainability: number;
  };
  cadence: {
    rhythm: string;
    variation: number;
    musicality: number;
  };
}

export interface StressPoint {
  syllableIndex: number;
  intensity: number; // 0-1
  natural: boolean;
}

export interface EnergyAnalysis {
  overall: number; // 0-100 average energy
  peaks: EnergyPeak[];
  valleys: EnergyValley[];
  consistency: number;
  trend: 'rising' | 'falling' | 'stable' | 'variable';
  dynamics: {
    range: number;
    volatility: number;
    buildups: number;
    climaxes: number;
  };
}

export interface EnergyPeak {
  line: number;
  intensity: number;
  words: string[];
  type: 'emotional' | 'rhythmic' | 'semantic';
}

export interface EnergyValley {
  line: number;
  intensity: number;
  purpose: 'contrast' | 'rest' | 'buildup';
}

export interface StructureAnalysis {
  sections: Section[];
  repetition: RepetitionAnalysis;
  wordCount: number;
  lineCount: number;
  averageLineLength: number;
  patterns: StructuralPattern[];
}

export interface Section {
  type: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'pre-chorus' | 'hook';
  startLine: number;
  endLine: number;
  content: string;
  confidence: number;
}

export interface RepetitionAnalysis {
  phrases: RepeatedPhrase[];
  words: RepeatedWord[];
  overall: number; // repetition score
}

export interface RepeatedPhrase {
  phrase: string;
  occurrences: number;
  lines: number[];
  significance: number;
}

export interface RepeatedWord {
  word: string;
  count: number;
  frequency: number;
  emphasis: number;
}

export interface StructuralPattern {
  type: string;
  description: string;
  strength: number;
}

export interface EnhancementSuggestions {
  persona: 'storyteller' | 'wordsmith' | 'melodist' | 'philosopher' | 'rebel';
  improvements: Improvement[];
  alternatives: Alternative[];
  styleTransforms: StyleTransform[];
}

export interface Improvement {
  type: 'rhyme' | 'flow' | 'word_choice' | 'structure' | 'energy';
  line: number;
  original: string;
  suggestion: string;
  reasoning: string;
  impact: number; // 0-100
}

export interface Alternative {
  section: string;
  original: string;
  alternatives: string[];
  style: string;
}

export interface StyleTransform {
  genre: string;
  transformed: string;
  confidence: number;
  characteristics: string[];
}

export interface AnalysisProgress {
  step: 'complexity' | 'rhyme' | 'flow' | 'energy' | 'structure' | 'enhancement' | 'complete';
  progress: number; // 0-100
  message: string;
  details?: string;
}

export interface AudioAnalysis {
  transcript: string;
  confidence: number;
  sentiment: {
    overall: 'positive' | 'negative' | 'neutral';
    score: number;
    emotions: EmotionScore[];
  };
  vocal: {
    pitch: number[];
    volume: number[];
    clarity: number;
    consistency: number;
  };
}

export interface EmotionScore {
  emotion: string;
  intensity: number;
  confidence: number;
}

export interface ExportFormat {
  type: 'pdf' | 'json' | 'txt';
  includeCharts: boolean;
  includeSuggestions: boolean;
  template: 'professional' | 'minimal' | 'detailed';
}

export interface AnalysisSession {
  id: string;
  title: string;
  lyrics: string;
  analysis: LyricAnalysis;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  rating?: number;
  notes?: string;
}
