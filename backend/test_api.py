"""
Test script for the FastAPI Lyric Analysis Backend
Run this to verify the API is working correctly
"""

import requests
import json
from datetime import datetime

# Test data
test_lyrics = """
I've been working on this code all night long
Trying to make the functions work just right
The bugs keep coming but I stay strong
I'll keep debugging through the morning light

Variables and functions, they're my friends
Classes and methods, they never end
In Python and JavaScript I depend
On clean code that I can comprehend
"""

test_data = {
    "lyrics": test_lyrics,
    "title": "Coder's Blues",
    "artist": "Dev Artist",
    "userId": "test_user_123"
}

def test_api(base_url="http://localhost:8000"):
    """Test the FastAPI endpoints"""
    
    print(f"Testing FastAPI Lyric Analysis at {base_url}")
    print("=" * 50)
    
    # Test health check
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ Health Check: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Health Check Failed: {e}")
        return
    
    print("\n" + "-" * 50)
    
    # Test analysis endpoint
    try:
        response = requests.post(
            f"{base_url}/api/analyze",
            headers={"Content-Type": "application/json"},
            json=test_data
        )
        
        if response.status_code == 200:
            print("✅ Analysis Endpoint: Success")
            result = response.json()
            
            # Display key metrics
            print(f"   Complexity Score: {result['complexity']['creativity']}")
            print(f"   Energy Level: {result['energy']['level']}")
            print(f"   Persona: {result['energy']['persona']}")
            print(f"   Flow Consistency: {result['flow']['consistency']}")
            print(f"   Lexical Diversity: {result['dashboard']['lexicalDiversity']}")
            print(f"   Total Words: {result['dashboard']['words']}")
            print(f"   Total Syllables: {result['dashboard']['totalSyllables']}")
            
            # Show insights
            if result['insights']['strengths']:
                print(f"   Strengths: {', '.join(result['insights']['strengths'][:2])}")
            
        else:
            print(f"❌ Analysis Endpoint Failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Analysis Test Failed: {e}")
    
    print("\n" + "-" * 50)
    
    # Test simple endpoint
    try:
        response = requests.post(
            f"{base_url}/api/analyze/simple",
            headers={"Content-Type": "application/json"},
            json=test_data
        )
        
        if response.status_code == 200:
            print("✅ Simple Analysis Endpoint: Success")
            result = response.json()
            print(f"   Analysis Model: {result['metadata']['model']}")
            print(f"   Enhanced Analysis: {result['metadata']['enhancedAnalysis']}")
        else:
            print(f"❌ Simple Analysis Failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Simple Analysis Test Failed: {e}")
    
    print("\n" + "=" * 50)
    print("Test completed!")

def performance_test(base_url="http://localhost:8000", num_requests=5):
    """Test API performance with multiple requests"""
    
    print(f"\nPerformance Test - {num_requests} requests")
    print("-" * 30)
    
    times = []
    successes = 0
    
    for i in range(num_requests):
        try:
            start_time = datetime.now()
            response = requests.post(
                f"{base_url}/api/analyze/simple",
                headers={"Content-Type": "application/json"},
                json=test_data,
                timeout=10
            )
            end_time = datetime.now()
            
            duration = (end_time - start_time).total_seconds()
            times.append(duration)
            
            if response.status_code == 200:
                successes += 1
                print(f"Request {i+1}: ✅ {duration:.2f}s")
            else:
                print(f"Request {i+1}: ❌ {response.status_code}")
                
        except Exception as e:
            print(f"Request {i+1}: ❌ {e}")
    
    if times:
        avg_time = sum(times) / len(times)
        print(f"\nResults:")
        print(f"Success Rate: {successes}/{num_requests} ({successes/num_requests*100:.1f}%)")
        print(f"Average Response Time: {avg_time:.2f}s")
        print(f"Fastest: {min(times):.2f}s")
        print(f"Slowest: {max(times):.2f}s")

if __name__ == "__main__":
    import sys
    
    # Allow custom base URL
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    
    # Run basic tests
    test_api(base_url)
    
    # Run performance test
    performance_test(base_url)
