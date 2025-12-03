# Test Script for AI Integration
# This script tests the complete AI integration system

import requests
import json

def test_custom_assistant():
    """Test the custom assistant API"""
    url = "http://localhost:3001/api/chat/assistant"
    
    # Test music theory question
    payload = {
        "messages": [{"role": "user", "content": "What are seventh chords?"}],
        "assistant_type": "music_analysis"
    }
    
    try:
        response = requests.post(url, json=payload)
        print("🎵 Music Theory Test:")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data['response'][:200]}...")
        print()
    except Exception as e:
        print(f"Error testing music theory: {e}")

def test_lyric_analysis():
    """Test lyric analysis integration"""
    url = "http://localhost:3001/api/chat/assistant"
    
    # Test with sample lyrics
    lyrics = """I've been walking down this lonely road
Searching for something I've never known
The stars above they shine so bright
But I'm still lost in the dark of night

Every step I take feels so unclear
Every breath I take filled with fear
But I keep moving, I won't give up
Hope is all I need to fill my cup"""

    payload = {
        "messages": [{"role": "user", "content": lyrics}],
        "assistant_type": "music_analysis"
    }
    
    try:
        response = requests.post(url, json=payload)
        print("🎤 Lyric Analysis Test:")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Analysis Result: {data['response'][:300]}...")
        print()
    except Exception as e:
        print(f"Error testing lyric analysis: {e}")

def test_backend_direct():
    """Test backend API directly"""
    url = "http://localhost:8000/api/analyze/simple"
    
    payload = {
        "lyrics": "Test lyrics for analysis",
        "title": "Test Song",
        "artist": "Test Artist",
        "userId": "test_user"
    }
    
    try:
        response = requests.post(url, json=payload)
        print("🔧 Backend Direct Test:")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Backend is responding correctly")
        else:
            print(f"❌ Backend error: {response.text}")
        print()
    except Exception as e:
        print(f"❌ Error connecting to backend: {e}")

if __name__ == "__main__":
    print("🚀 Testing AI Integration System\n")
    
    test_backend_direct()
    test_custom_assistant()
    test_lyric_analysis()
    
    print("✅ Integration tests complete!")
