"""
FastAPI Python Backend for Advanced Lyric Analysis
Alternative to Next.js API routes for NLP-heavy processing
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re
import json
from typing import Dict, List, Any
import syllapy
from datetime import datetime

# Optional imports for enhanced analysis
try:
    import nltk
    from textstat import flesch_reading_ease, flesch_kincaid_grade
    ENHANCED_ANALYSIS = True
except ImportError:
    ENHANCED_ANALYSIS = False
    print("Warning: nltk and textstat not available. Using basic analysis only.")

app = FastAPI(title="Lyric Analysis API", version="1.0.0")

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LyricsRequest(BaseModel):
    lyrics: str
    title: str = "Untitled"
    artist: str = "Unknown"
    userId: str = "anonymous"

class AnalysisResponse(BaseModel):
    complexity: Dict[str, float]
    energy: Dict[str, Any]
    flow: Dict[str, Any]
    dashboard: Dict[str, Any]
    insights: Dict[str, List[str]]
    metadata: Dict[str, str]

def count_syllables(word: str) -> int:
    """Count syllables in a word using syllapy"""
    try:
        return syllapy.count(word)
    except:
        # Fallback method
        word = word.lower()
        vowels = "aeiouy"
        count = 0
        prev_was_vowel = False
        
        for char in word:
            is_vowel = char in vowels
            if is_vowel and not prev_was_vowel:
                count += 1
            prev_was_vowel = is_vowel
        
        # Handle silent e
        if word.endswith('e') and count > 1:
            count -= 1
        
        return max(1, count)

def detect_rhymes(lines: List[str]) -> float:
    """Basic rhyme detection"""
    if len(lines) < 2:
        return 0
    
    end_words = []
    for line in lines:
        words = line.strip().split()
        if words:
            clean_word = re.sub(r'[^\w]', '', words[-1]).lower()
            end_words.append(clean_word)
    
    rhyme_count = 0
    for i in range(1, len(end_words)):
        current = end_words[i]
        previous = end_words[i-1]
        
        if len(current) > 2 and len(previous) > 2:
            # Check for suffix similarity (basic rhyme detection)
            if current[-2:] == previous[-2:] or current[-3:] == previous[-3:]:
                rhyme_count += 1
    
    return (rhyme_count / max(len(end_words) - 1, 1)) * 100

def analyze_emotion(lyrics: str) -> float:
    """Analyze emotional content"""
    emotional_words = {
        'positive': ['love', 'joy', 'happy', 'smile', 'dream', 'hope', 'light', 'peace', 'free', 'win'],
        'negative': ['hate', 'pain', 'sad', 'cry', 'fear', 'dark', 'lost', 'hurt', 'broken', 'mad'],
        'intense': ['fire', 'burn', 'rage', 'passion', 'wild', 'crazy', 'insane', 'extreme']
    }
    
    lyrics_lower = lyrics.lower()
    emotion_score = 0
    
    for category, words in emotional_words.items():
        for word in words:
            count = len(re.findall(r'\b' + word + r'\b', lyrics_lower))
            if category == 'intense':
                emotion_score += count * 15
            else:
                emotion_score += count * 10
    
    # Add intensity from punctuation
    emotion_score += len(re.findall(r'[!]', lyrics)) * 5
    emotion_score += len(re.findall(r'[?]', lyrics)) * 3
    
    return min(100, emotion_score)

def advanced_analysis(lyrics: str) -> Dict[str, Any]:
    """Perform advanced lyrical analysis"""
    
    # Basic text processing
    words = lyrics.split()
    word_count = len(words)
    unique_words = len(set(word.lower().strip('.,!?";') for word in words))
    lexical_diversity = (unique_words / word_count * 100) if word_count > 0 else 0
    
    # Syllable analysis
    total_syllables = sum(count_syllables(re.sub(r'[^\w]', '', word)) for word in words)
    avg_syllables = total_syllables / word_count if word_count > 0 else 0
    
    # Line analysis
    lines = [line.strip() for line in lyrics.split('\n') if line.strip()]
    
    # Energy calculation
    exclamation_count = len(re.findall(r'[!]', lyrics))
    caps_words = len(re.findall(r'\b[A-Z]{2,}\b', lyrics))
    energy_level = min(100, exclamation_count * 8 + caps_words * 5 + (15 if avg_syllables > 2.5 else 0))
    
    # Emotion analysis
    emotion_score = analyze_emotion(lyrics)
    
    # Rhyme analysis
    rhyme_score = detect_rhymes(lines)
    
    # Complexity calculation
    complexity_score = min(100, 
        lexical_diversity * 0.6 + 
        (20 if avg_syllables > 2 else 10 if avg_syllables > 1.5 else 0) +
        (20 if unique_words > word_count * 0.7 else 0)
    )
    
    # Flow consistency
    line_syllables = [
        sum(count_syllables(re.sub(r'[^\w]', '', word)) for word in line.split())
        for line in lines
    ]
    
    if len(line_syllables) > 1:
        avg_line_syllables = sum(line_syllables) / len(line_syllables)
        variance = sum((x - avg_line_syllables) ** 2 for x in line_syllables) / len(line_syllables)
        flow_consistency = max(0, 100 - (variance * 2))
    else:
        flow_consistency = 75
    
    # Determine persona
    if energy_level > 80:
        persona = "Energetic"
    elif energy_level < 30:
        persona = "Calm"
    elif emotion_score > 70:
        persona = "Emotional"
    elif complexity_score > 80:
        persona = "Intellectual"
    else:
        persona = "Balanced"
    
    # Determine intensity
    if energy_level > 85:
        intensity = "High"
    elif energy_level > 60:
        intensity = "Moderate"
    else:
        intensity = "Low"
    
    # Rhyme variety
    if rhyme_score > 70:
        rhyme_variety = "Complex"
    elif rhyme_score > 40:
        rhyme_variety = "Moderate"
    else:
        rhyme_variety = "Simple"
    
    # Enhanced insights with NLTK (if available)
    themes = ["Theme analysis requires NLTK"]
    metaphors = ["Metaphor detection requires advanced NLP"]
    strengths = []
    suggestions = []
    
    if ENHANCED_ANALYSIS:
        # Additional analysis with nltk and textstat
        readability = flesch_reading_ease(lyrics)
        grade_level = flesch_kincaid_grade(lyrics)
        
        if lexical_diversity > 70:
            strengths.append("High vocabulary diversity")
        if rhyme_score > 60:
            strengths.append("Strong rhyme patterns")
        if emotion_score > 70:
            strengths.append("High emotional expression")
        if complexity_score > 75:
            strengths.append("Sophisticated language use")
        
        if lexical_diversity < 40:
            suggestions.append("Try using more varied vocabulary")
        if rhyme_score < 30:
            suggestions.append("Consider adding more rhyming elements")
        if avg_syllables < 1.5:
            suggestions.append("Experiment with longer, more complex words")
        if flow_consistency < 60:
            suggestions.append("Work on maintaining consistent syllable patterns")
    else:
        # Basic insights without advanced NLP
        if lexical_diversity > 70:
            strengths.append("Good vocabulary diversity")
        if energy_level > 70:
            strengths.append("High energy and intensity")
        if emotion_score > 60:
            strengths.append("Emotionally expressive")
        
        if not strengths:
            strengths.append("Solid foundation for lyrics")
        
        suggestions = [
            "Consider adding more descriptive language",
            "Experiment with different rhyme patterns",
            "Try varying syllable counts for rhythm"
        ]
    
    return {
        "complexity": {
            "creativity": round(complexity_score * 0.8 + lexical_diversity * 0.2),
            "diversity": round(lexical_diversity),
            "emotion": round(emotion_score),
            "structure": round(flow_consistency * 0.7 + (20 if len(lines) > 4 else len(lines) * 5))
        },
        "energy": {
            "persona": persona,
            "level": round(energy_level),
            "intensity": intensity
        },
        "flow": {
            "consistency": round(flow_consistency),
            "avgSyllables": round(avg_syllables, 2),
            "stressPoints": int(avg_syllables * 1.4),
            "rhymeVariety": rhyme_variety
        },
        "dashboard": {
            "sessions": 1,
            "words": word_count,
            "minutes": max(1, word_count // 150),  # Reading time estimate
            "avgEnergy": round(energy_level),
            "favoritePersona": persona,
            "lexicalDiversity": round(lexical_diversity),
            "uniqueWords": unique_words,
            "totalSyllables": total_syllables,
            "rhymeScore": round(rhyme_score),
            "emotionScore": round(emotion_score)
        },
        "insights": {
            "themes": themes,
            "metaphors": metaphors,
            "strengths": strengths,
            "suggestions": suggestions
        },
        "metadata": {
            "analysisDate": datetime.now().isoformat(),
            "model": "python-fastapi-v1",
            "version": "1.0.0",
            "enhancedAnalysis": str(ENHANCED_ANALYSIS)
        }
    }

@app.get("/")
async def root():
    return {"message": "Lyric Analysis API", "version": "1.0.0", "enhanced": ENHANCED_ANALYSIS}

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_lyrics(request: LyricsRequest):
    """Analyze lyrics for complexity, flow, energy, and insights"""
    
    if not request.lyrics or len(request.lyrics.strip()) == 0:
        raise HTTPException(status_code=400, detail="Lyrics content is required")
    
    try:
        analysis = advanced_analysis(request.lyrics)
        return AnalysisResponse(**analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/analyze/simple")
async def analyze_lyrics_simple(request: LyricsRequest):
    """Simple lyrics analysis without response model validation"""
    
    if not request.lyrics or len(request.lyrics.strip()) == 0:
        raise HTTPException(status_code=400, detail="Lyrics content is required")
    
    try:
        return advanced_analysis(request.lyrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
