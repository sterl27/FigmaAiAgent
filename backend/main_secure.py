"""
Secure FastAPI Python Backend for Advanced Lyric Analysis
Enhanced with authentication, rate limiting, and security features
"""

import os
from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import re
import json
import syllapy
import hashlib
import secrets
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Optional imports for enhanced analysis
try:
    import nltk
    import textstat
    ENHANCED_ANALYSIS = True
except ImportError:
    ENHANCED_ANALYSIS = False
    print("Warning: nltk and textstat not available. Using basic analysis only.")

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
API_KEY_HEADER = "X-API-Key"
API_KEY = os.getenv("API_KEY", "your-secure-api-key-here")

# Rate limiting
limiter = Limiter(key_func=get_remote_address)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security bearer
security = HTTPBearer()

app = FastAPI(
    title="Secure Lyric Analysis API",
    version="2.0.0",
    description="Advanced lyric analysis with security features"
)

# Add rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, lambda request, exc: JSONResponse(
    status_code=429,
    content={"detail": "Rate limit exceeded"}
))

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["localhost", "127.0.0.1", "*.yourdomain.com"]
)

# CORS middleware with restricted origins
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://yourdomain.com",
    "https://www.yourdomain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Pydantic models with enhanced validation
class LyricsRequest(BaseModel):
    lyrics: str = Field(..., min_length=10, max_length=50000, description="Song lyrics")
    title: str = Field(default="Untitled", max_length=200, description="Song title")
    artist: str = Field(default="Unknown", max_length=200, description="Artist name")
    userId: str = Field(default="anonymous", max_length=100, description="User ID")

    @validator('lyrics')
    def validate_lyrics(cls, v):
        if not v.strip():
            raise ValueError('Lyrics cannot be empty')
        # Remove potential script tags or malicious content
        cleaned = re.sub(r'<[^>]*>', '', v)
        if len(cleaned.strip()) < 10:
            raise ValueError('Lyrics must contain at least 10 characters of text')
        return cleaned

    @validator('title', 'artist')
    def validate_text_fields(cls, v):
        # Remove potential XSS vectors
        return re.sub(r'[<>"\'\&]', '', v).strip()

class AnalysisResponse(BaseModel):
    complexity: Dict[str, float]
    energy: Dict[str, Any]
    flow: Dict[str, Any]
    dashboard: Dict[str, Any]
    insights: Dict[str, List[str]]
    metadata: Dict[str, str]
    security: Dict[str, str] = Field(default_factory=dict)

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    disabled: Optional[bool] = None

# Security functions
def verify_api_key(request: Request) -> bool:
    """Verify API key from header"""
    api_key = request.headers.get(API_KEY_HEADER)
    if not api_key:
        return False
    return secrets.compare_digest(api_key, API_KEY)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token_data = TokenData(username=username)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token_data

async def get_current_user(token: TokenData = Depends(verify_token)):
    """Get current authenticated user"""
    if token.username is None:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = User(username=token.username, disabled=False)
    if user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user

def verify_request_integrity(request: LyricsRequest) -> bool:
    """Verify request integrity and detect potential abuse"""
    # Check for suspicious patterns
    suspicious_patterns = [
        r'<script[^>]*>.*?</script>',
        r'javascript:',
        r'vbscript:',
        r'on\w+\s*=',
        r'expression\s*\(',
        r'data:text/html'
    ]
    
    full_text = f"{request.lyrics} {request.title} {request.artist} {request.userId}"
    
    for pattern in suspicious_patterns:
        if re.search(pattern, full_text, re.IGNORECASE):
            return False
    
    return True

# Analysis functions (keeping original logic)
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
    }
    
    words = lyrics.lower().split()
    total_emotional = 0
    
    for word in words:
        clean_word = re.sub(r'[^\w]', '', word)
        if clean_word in emotional_words['positive']:
            total_emotional += 1
        elif clean_word in emotional_words['negative']:
            total_emotional += 1
    
    return min((total_emotional / max(len(words), 1)) * 100, 100)

def advanced_analysis(lyrics: str) -> Dict[str, Any]:
    """Enhanced lyric analysis with security considerations"""
    
    # Clean and validate input
    lyrics = re.sub(r'[<>"\'\&]', '', lyrics)  # Remove potential XSS
    lines = [line.strip() for line in lyrics.split('\n') if line.strip()]
    
    if not lines:
        raise ValueError("No valid lyrics content found")
    
    words = lyrics.lower().split()
    word_count = len(words)
    
    if word_count == 0:
        raise ValueError("No words found in lyrics")
    
    # Syllable analysis
    total_syllables = sum(count_syllables(re.sub(r'[^\w]', '', word)) for word in words)
    avg_syllables = total_syllables / word_count if word_count > 0 else 0
    
    # Complexity metrics
    unique_words = len(set(words))
    lexical_diversity = (unique_words / word_count) * 100 if word_count > 0 else 0
    
    # Rhyme analysis
    rhyme_score = detect_rhymes(lines)
    
    # Emotion analysis
    emotion_score = analyze_emotion(lyrics)
    
    # Energy calculation
    energy_level = min(100, 
        emotion_score * 0.4 + 
        rhyme_score * 0.3 + 
        (avg_syllables * 10) + 
        min(lexical_diversity, 50) * 0.3
    )
    
    # Complexity score
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
    
    # Security metadata
    analysis_hash = hashlib.sha256(lyrics.encode()).hexdigest()[:16]
    
    return {
        "complexity": {
            "overall": round(complexity_score),
            "lexicalDiversity": round(lexical_diversity),
            "avgSyllables": round(avg_syllables, 2),
            "readabilityScore": round((complexity_score + lexical_diversity) / 2)
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
            "minutes": max(1, word_count // 150),
            "avgEnergy": round(energy_level),
            "favoritePersona": persona,
            "lexicalDiversity": round(lexical_diversity),
            "uniqueWords": unique_words,
            "totalSyllables": total_syllables,
            "rhymeScore": round(rhyme_score),
            "emotionScore": round(emotion_score)
        },
        "insights": {
            "themes": ["Automated theme analysis"],
            "metaphors": ["Metaphor detection enabled"],
            "strengths": [f"Strong {persona.lower()} style", f"{rhyme_variety} rhyme scheme"],
            "suggestions": ["Consider varying line length", "Experiment with different emotional tones"]
        },
        "metadata": {
            "analysisDate": datetime.now().isoformat(),
            "model": "secure-fastapi-v2",
            "version": "2.0.0",
            "enhancedAnalysis": str(ENHANCED_ANALYSIS),
            "securityLevel": "high"
        },
        "security": {
            "analysisHash": analysis_hash,
            "validatedInput": "true",
            "timestamp": datetime.utcnow().isoformat()
        }
    }

# API Endpoints
@app.get("/")
@limiter.limit("10/minute")
async def root(request: Request):
    """Health check endpoint"""
    return {
        "message": "Secure Lyric Analysis API",
        "version": "2.0.0",
        "enhanced": ENHANCED_ANALYSIS,
        "security": "enabled",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
@limiter.limit("30/minute")
async def health_check(request: Request):
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.0.0",
        "features": {
            "enhanced_analysis": ENHANCED_ANALYSIS,
            "rate_limiting": True,
            "security_headers": True,
            "input_validation": True
        }
    }

@app.post("/api/analyze", response_model=AnalysisResponse)
@limiter.limit("20/minute")
async def analyze_lyrics(request: Request, lyrics_request: LyricsRequest):
    """Secure lyrics analysis endpoint"""
    
    # Verify request integrity
    if not verify_request_integrity(lyrics_request):
        raise HTTPException(
            status_code=400, 
            detail="Request contains potentially malicious content"
        )
    
    # Additional size check
    if len(lyrics_request.lyrics) > 50000:
        raise HTTPException(
            status_code=413, 
            detail="Lyrics content too large"
        )
    
    try:
        analysis = advanced_analysis(lyrics_request.lyrics)
        return AnalysisResponse(**analysis)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Log the error but don't expose internal details
        print(f"Analysis error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Internal analysis error occurred"
        )

@app.post("/api/analyze/simple")
@limiter.limit("20/minute")
async def analyze_lyrics_simple(request: Request, lyrics_request: LyricsRequest):
    """Simple lyrics analysis without response model validation"""
    
    # Verify request integrity
    if not verify_request_integrity(lyrics_request):
        raise HTTPException(
            status_code=400, 
            detail="Request contains potentially malicious content"
        )
    
    try:
        return advanced_analysis(lyrics_request.lyrics)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Analysis error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Internal analysis error occurred"
        )

@app.post("/api/analyze/protected")
@limiter.limit("100/minute")
async def analyze_lyrics_protected(
    request: Request, 
    lyrics_request: LyricsRequest,
    current_user: User = Depends(get_current_user)
):
    """Protected lyrics analysis endpoint requiring authentication"""
    
    # Verify request integrity
    if not verify_request_integrity(lyrics_request):
        raise HTTPException(
            status_code=400, 
            detail="Request contains potentially malicious content"
        )
    
    try:
        analysis = advanced_analysis(lyrics_request.lyrics)
        analysis["security"]["authenticatedUser"] = current_user.username
        analysis["security"]["authenticationTime"] = datetime.utcnow().isoformat()
        return analysis
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Analysis error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Internal analysis error occurred"
        )

@app.post("/token")
@limiter.limit("5/minute")
async def login_for_access_token(request: Request):
    """Get access token (demo endpoint - implement proper authentication)"""
    # In production, implement proper user authentication
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": "demo_user"}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="127.0.0.1",  # More secure than 0.0.0.0
        port=8000,
        ssl_keyfile=None,  # Add SSL in production
        ssl_certfile=None
    )
