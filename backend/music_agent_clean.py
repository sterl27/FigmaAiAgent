"""
Music Research Agent - Python Backend
Comprehensive music metadata research using multiple APIs and AI fallback
"""

import os
import requests
import wikipedia
import re
import json
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field

# OpenAI for GPT fallback analysis
try:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    GPT_AVAILABLE = True
except ImportError:
    GPT_AVAILABLE = False
    print("Warning: OpenAI not available. GPT fallback disabled.")

@dataclass
class MusicProfile:
    """Structured music profile data class"""
    title: str
    artist: str
    bpm: Optional[int] = None
    key: Optional[str] = None
    genre: Optional[str] = None
    year: Optional[int] = None
    summary: Optional[str] = None
    wikipedia_url: Optional[str] = None
    confidence_score: float = 0.0
    sources: List[str] = field(default_factory=list)
    additional_metadata: Dict[str, Any] = field(default_factory=dict)

class MusicResearchAgent:
    """Advanced music research agent with multiple data sources"""
    
    def __init__(self, songbpm_api_key: Optional[str] = None, acousticbrainz_enabled: bool = True):
        self.songbpm_api_key = songbpm_api_key or os.getenv('SONGBPM_API_KEY')
        self.acousticbrainz_enabled = acousticbrainz_enabled
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'MusicResearchAgent/1.0 (Music Analysis Tool)'
        })
    
    def search_wikipedia(self, title: str, artist: str = "") -> Dict[str, Any]:
        """Search Wikipedia for song information"""
        try:
            # Create search queries
            search_queries = [
                f"{title} {artist} song",
                f"{title} song",
                f"{artist} {title}",
                f"{title}"
            ]
            
            for query in search_queries:
                try:
                    # Search for the page
                    search_results = wikipedia.search(query, results=3)
                    
                    for result in search_results:
                        try:
                            page = wikipedia.page(result)
                            content = page.content.lower()
                            
                            # Check if this page is about music/song
                            music_indicators = ['song', 'album', 'single', 'track', 'music', 'band', 'artist']
                            if any(indicator in content for indicator in music_indicators):
                                
                                # Extract metadata using regex patterns
                                metadata = self._extract_wikipedia_metadata(page.content, page.summary)
                                metadata.update({
                                    'url': page.url,
                                    'title': page.title,
                                    'summary': page.summary[:500],
                                    'source': 'wikipedia'
                                })
                                
                                return metadata
                                
                        except wikipedia.exceptions.DisambiguationError as e:
                            # Try the first disambiguation option
                            if e.options:
                                try:
                                    page = wikipedia.page(e.options[0])
                                    metadata = self._extract_wikipedia_metadata(page.content, page.summary)
                                    metadata.update({
                                        'url': page.url,
                                        'title': page.title,
                                        'summary': page.summary[:500],
                                        'source': 'wikipedia'
                                    })
                                    return metadata
                                except:
                                    continue
                        except:
                            continue
                            
                except wikipedia.exceptions.WikipediaException:
                    continue
            
            return {'source': 'wikipedia', 'error': 'No relevant Wikipedia page found'}
            
        except Exception as e:
            return {'source': 'wikipedia', 'error': str(e)}
    
    def _extract_wikipedia_metadata(self, content: str, summary: str) -> Dict[str, Any]:
        """Extract structured metadata from Wikipedia content"""
        metadata = {}
        
        # Common regex patterns for music metadata
        patterns = {
            'genre': [
                r'genre[s]?\s*[:\-\s]+([^.\n]+)',
                r'musical\s+style[s]?\s*[:\-\s]+([^.\n]+)',
                r'style[s]?\s*[:\-\s]+([^.\n]+)'
            ],
            'year': [
                r'released?\s*[:\-\s]*(\d{4})',
                r'(\d{4})\s+(?:single|song|album)',
                r'(?:in|from)\s+(\d{4})'
            ],
            'album': [
                r'album\s*[:\-\s]+([^.\n]+)',
                r'from\s+(?:the\s+)?album\s+([^.\n]+)'
            ],
            'label': [
                r'label[s]?\s*[:\-\s]+([^.\n]+)',
                r'record\s+label[s]?\s*[:\-\s]+([^.\n]+)'
            ]
        }
        
        content_lower = content.lower()
        
        for field, pattern_list in patterns.items():
            for pattern in pattern_list:
                match = re.search(pattern, content_lower)
                if match:
                    value = match.group(1).strip()
                    # Clean up the extracted value
                    value = re.sub(r'\s+', ' ', value)
                    value = value.split(',')[0].strip()  # Take first part if comma-separated
                    if len(value) > 0 and len(value) < 100:  # Reasonable length
                        metadata[field] = value
                        break
        
        return metadata
    
    def search_songbpm(self, title: str, artist: str = "") -> Dict[str, Any]:
        """Search SongBPM.com for BPM and key information"""
        if not self.songbpm_api_key:
            return {'source': 'songbpm', 'error': 'API key not provided'}
        
        try:
            query = f"{title} {artist}".strip()
            url = f"https://api.getsongbpm.com/search/"
            params = {
                'api_key': self.songbpm_api_key,
                'type': 'song',
                'lookup': query
            }
            
            response = self.session.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if 'search' in data and len(data['search']) > 0:
                    song_data = data['search'][0]
                    
                    return {
                        'bpm': song_data.get('tempo'),
                        'key': song_data.get('song_key'),
                        'title': song_data.get('song_title'),
                        'artist': song_data.get('artist', {}).get('name') if isinstance(song_data.get('artist'), dict) else song_data.get('artist'),
                        'energy': song_data.get('energy'),
                        'danceability': song_data.get('danceability'),
                        'source': 'songbpm'
                    }
            
            return {'source': 'songbpm', 'error': f'No results found for {query}'}
            
        except Exception as e:
            return {'source': 'songbpm', 'error': str(e)}
    
    def search_musicbrainz(self, title: str, artist: str = "") -> Dict[str, Any]:
        """Search MusicBrainz for additional metadata"""
        try:
            query = f'recording:"{title}"'
            if artist:
                query += f' AND artist:"{artist}"'
            
            url = "https://musicbrainz.org/ws/2/recording"
            params = {
                'query': query,
                'fmt': 'json',
                'limit': 5
            }
            
            response = self.session.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if 'recordings' in data and len(data['recordings']) > 0:
                    recording = data['recordings'][0]
                    
                    # Extract artist info
                    artist_name = None
                    if 'artist-credit' in recording and len(recording['artist-credit']) > 0:
                        artist_name = recording['artist-credit'][0].get('name')
                    
                    # Extract release info
                    release_info = {}
                    if 'releases' in recording and len(recording['releases']) > 0:
                        release = recording['releases'][0]
                        release_info = {
                            'album': release.get('title'),
                            'year': release.get('date', '')[:4] if release.get('date') else None
                        }
                    
                    return {
                        'title': recording.get('title'),
                        'artist': artist_name,
                        'duration': recording.get('length'),
                        'musicbrainz_id': recording.get('id'),
                        'source': 'musicbrainz',
                        **release_info
                    }
            
            return {'source': 'musicbrainz', 'error': 'No results found'}
            
        except Exception as e:
            return {'source': 'musicbrainz', 'error': str(e)}
    
    def gpt_extract_metadata(self, search_results: List[Dict], title: str, artist: str = "") -> Dict[str, Any]:
        """Use GPT to extract and synthesize metadata from search results"""
        if not GPT_AVAILABLE:
            return {'source': 'gpt', 'error': 'OpenAI not available'}
        
        try:
            # Prepare context for GPT
            context = f"Song: {title}\nArtist: {artist}\n\nSearch Results:\n"
            
            for i, result in enumerate(search_results[:3]):  # Limit to 3 results
                context += f"\nSource {i+1} ({result.get('source', 'unknown')}):\n"
                context += json.dumps(result, indent=2)[:1000]  # Limit length
                context += "\n"
            
            prompt = f"""
            Analyze the search results above and extract the following music metadata for the song "{title}" by {artist if artist else "unknown artist"}:

            Please provide a JSON response with these fields:
            - title: (string) Official song title
            - artist: (string) Artist name
            - bpm: (integer) Beats per minute, if available
            - key: (string) Musical key (e.g., "C Major", "A Minor")
            - genre: (string) Primary genre
            - year: (integer) Release year
            - album: (string) Album name, if available
            - confidence: (float) Your confidence in this data (0.0-1.0)
            - summary: (string) Brief description of the song
            
            Base your response on the search results provided. If data is unavailable or conflicting, use your best judgment and indicate lower confidence.
            Return only valid JSON.
            """
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a music metadata extraction expert. Analyze search results and provide structured music information in JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=500
            )
            
            result_content = response.choices[0].message.content
            result_text = result_content.strip() if result_content is not None else ""
            
            # Try to parse JSON response
            try:
                # Remove any markdown formatting
                if result_text.startswith('```'):
                    result_text = result_text.split('```')[1]
                    if result_text.startswith('json'):
                        result_text = result_text[4:]
                
                metadata = json.loads(result_text)
                metadata['source'] = 'gpt'
                return metadata
                
            except json.JSONDecodeError:
                return {'source': 'gpt', 'error': 'Invalid JSON response from GPT'}
            
        except Exception as e:
            return {'source': 'gpt', 'error': str(e)}
    
    def research_song(self, title: str, artist: str = "", use_gpt_fallback: bool = True) -> MusicProfile:
        """Main method to research a song and return a MusicProfile"""
        # Collect data from all sources
        search_results = []
        
        # Wikipedia search
        print("🔍 Searching Wikipedia...")
        wiki_data = self.search_wikipedia(title, artist)
        search_results.append(wiki_data)
        
        # SongBPM search
        print("🎼 Searching SongBPM...")
        songbpm_data = self.search_songbpm(title, artist)
        search_results.append(songbpm_data)
        
        # MusicBrainz search
        print("🎹 Searching MusicBrainz...")
        musicbrainz_data = self.search_musicbrainz(title, artist)
        search_results.append(musicbrainz_data)
        
        # GPT synthesis (if enabled)
        gpt_data = {}
        if use_gpt_fallback and GPT_AVAILABLE:
            print("🤖 Using GPT for metadata synthesis...")
            gpt_data = self.gpt_extract_metadata(search_results, title, artist)
            search_results.append(gpt_data)
        
        # Synthesize final profile
        profile = self._synthesize_profile(title, artist, search_results, gpt_data)
        
        print(f"✅ Research complete! Confidence: {profile.confidence_score:.1%}")
        return profile
    
    def _synthesize_profile(self, title: str, artist: str, search_results: List[Dict], gpt_data: Dict) -> MusicProfile:
        """Synthesize all search results into a unified MusicProfile"""
        profile = MusicProfile(title=title, artist=artist)
        confidence_factors = []
        
        # Collect all sources that provided data
        for result in search_results:
            if 'error' not in result and result.get('source'):
                profile.sources.append(result['source'])
        
        # Extract data with source priority: GPT > Wikipedia > SongBPM > MusicBrainz
        source_priority = ['gpt', 'wikipedia', 'songbpm', 'musicbrainz']
        
        for source in source_priority:
            source_data = next((r for r in search_results if r.get('source') == source and 'error' not in r), {})
            
            if source_data:
                # Title and Artist
                if not profile.title or profile.title == title:
                    profile.title = source_data.get('title', profile.title)
                if not profile.artist or profile.artist == artist:
                    profile.artist = source_data.get('artist', profile.artist)
                
                # BPM and Key (primarily from SongBPM and GPT)
                if source in ['songbpm', 'gpt'] and source_data.get('bpm'):
                    profile.bpm = source_data.get('bpm')
                    confidence_factors.append(0.9 if source == 'songbpm' else 0.7)
                
                if source in ['songbpm', 'gpt'] and source_data.get('key'):
                    profile.key = source_data.get('key')
                    confidence_factors.append(0.8)
                
                # Genre and Year (primarily from Wikipedia and GPT)
                if source in ['wikipedia', 'gpt'] and source_data.get('genre'):
                    profile.genre = source_data.get('genre')
                    confidence_factors.append(0.8 if source == 'wikipedia' else 0.7)
                
                if source_data.get('year'):
                    try:
                        profile.year = int(str(source_data.get('year'))[:4])
                        confidence_factors.append(0.9 if source == 'wikipedia' else 0.7)
                    except (ValueError, TypeError):
                        pass
                
                # Summary and URL (primarily from Wikipedia)
                if source == 'wikipedia':
                    profile.summary = source_data.get('summary')
                    profile.wikipedia_url = source_data.get('url')
                    confidence_factors.append(0.8)
                
                # Additional metadata
                for key in ['album', 'label', 'energy', 'danceability']:
                    if source_data.get(key):
                        profile.additional_metadata[key] = source_data[key]
        
        # Calculate confidence score
        if confidence_factors:
            profile.confidence_score = min(sum(confidence_factors) / len(confidence_factors), 1.0)
        else:
            profile.confidence_score = 0.1  # Low confidence if no good sources
        
        # Boost confidence if multiple sources agree
        if len(profile.sources) > 2:
            profile.confidence_score = min(profile.confidence_score * 1.2, 1.0)
        
        return profile

# Example usage and testing
def main():
    """Example usage of the Music Research Agent"""
    
    # Initialize agent (you'll need a SongBPM API key for full functionality)
    agent = MusicResearchAgent()
    
    # Test songs
    test_songs = [
        ("Midnight City", "M83"),
        ("Bohemian Rhapsody", "Queen"),
        ("Blinding Lights", "The Weeknd"),
        ("Shape of You", "Ed Sheeran")
    ]
    
    for title, artist in test_songs:
        print(f"\n{'='*60}")
        profile = agent.research_song(title, artist)
        
        print(f"\n📊 Music Profile:")
        print(f"   🎵 Title: {profile.title}")
        print(f"   🎤 Artist: {profile.artist}")
        print(f"   🥁 BPM: {profile.bpm or 'Unknown'}")
        print(f"   🎹 Key: {profile.key or 'Unknown'}")
        print(f"   🎼 Genre: {profile.genre or 'Unknown'}")
        print(f"   📅 Year: {profile.year or 'Unknown'}")
        print(f"   📈 Confidence: {profile.confidence_score:.1%}")
        print(f"   🔍 Sources: {', '.join(profile.sources)}")
        
        if profile.summary:
            print(f"   📝 Summary: {profile.summary[:100]}...")
        
        if profile.additional_metadata:
            print(f"   ➕ Additional: {list(profile.additional_metadata.keys())}")

if __name__ == "__main__":
    main()
