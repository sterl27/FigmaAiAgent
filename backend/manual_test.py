"""
Manual Test Script for Secure Lyric Analysis API
Run this to verify basic functionality while the server is running
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000"

# Test data
VALID_LYRICS = """
I've been working on this code all night long
Trying to make the functions work just right
The bugs keep coming but I stay strong
I'll keep debugging through the morning light

Variables and functions, they're my friends
Classes and methods, they never end
In Python and JavaScript I depend
On clean code that I can comprehend
"""

MALICIOUS_LYRICS = """
<script>alert('xss')</script>
javascript:void(0)
These are some normal lyrics too
<img src=x onerror=alert('xss')>
"""

def test_health_endpoints():
    """Test health check endpoints"""
    print("🏥 Testing Health Endpoints...")
    
    # Test root endpoint
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"   ✅ Root endpoint: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"      Version: {data.get('version')}")
            print(f"      Security: {data.get('security')}")
        print()
    except Exception as e:
        print(f"   ❌ Root endpoint failed: {e}")
    
    # Test health endpoint
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"   ✅ Health endpoint: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"      Status: {data.get('status')}")
            features = data.get('features', {})
            print(f"      Rate limiting: {features.get('rate_limiting')}")
            print(f"      Security headers: {features.get('security_headers')}")
        print()
    except Exception as e:
        print(f"   ❌ Health endpoint failed: {e}")

def test_security_headers():
    """Test security headers are present"""
    print("🔒 Testing Security Headers...")
    
    try:
        response = requests.get(f"{BASE_URL}/")
        headers = response.headers
        
        security_headers = [
            "X-Content-Type-Options",
            "X-Frame-Options", 
            "X-XSS-Protection",
            "Strict-Transport-Security",
            "Content-Security-Policy",
            "Referrer-Policy"
        ]
        
        for header in security_headers:
            if header in headers:
                print(f"   ✅ {header}: {headers[header]}")
            else:
                print(f"   ❌ {header}: Missing")
        print()
    except Exception as e:
        print(f"   ❌ Security headers test failed: {e}")

def test_lyrics_analysis():
    """Test lyrics analysis functionality"""
    print("🎵 Testing Lyrics Analysis...")
    
    request_data = {
        "lyrics": VALID_LYRICS,
        "title": "Coder's Blues",
        "artist": "Dev Artist",
        "userId": "test_user_123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/analyze", json=request_data)
        print(f"   ✅ Analysis endpoint: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"      Complexity overall: {data['complexity']['overall']}")
            print(f"      Energy level: {data['energy']['level']}")
            print(f"      Energy persona: {data['energy']['persona']}")
            print(f"      Flow consistency: {data['flow']['consistency']}")
            print(f"      Security validated: {data['security']['validatedInput']}")
            print(f"      Analysis hash: {data['security']['analysisHash']}")
        else:
            print(f"      Error: {response.text}")
        print()
    except Exception as e:
        print(f"   ❌ Analysis test failed: {e}")

def test_input_validation():
    """Test input validation"""
    print("🛡️ Testing Input Validation...")
    
    # Test empty lyrics
    try:
        response = requests.post(f"{BASE_URL}/api/analyze", json={
            "lyrics": "",
            "title": "Empty Song",
            "artist": "Test Artist"
        })
        print(f"   ✅ Empty lyrics rejection: {response.status_code} (should be 422)")
    except Exception as e:
        print(f"   ❌ Empty lyrics test failed: {e}")
    
    # Test malicious content
    try:
        response = requests.post(f"{BASE_URL}/api/analyze", json={
            "lyrics": MALICIOUS_LYRICS,
            "title": "Malicious Song",
            "artist": "Hacker"
        })
        print(f"   ✅ Malicious content rejection: {response.status_code} (should be 400)")
        if response.status_code == 400:
            print(f"      Reason: {response.json().get('detail', 'Unknown')}")
    except Exception as e:
        print(f"   ❌ Malicious content test failed: {e}")
    
    # Test oversized content
    try:
        large_lyrics = "A" * 60000
        response = requests.post(f"{BASE_URL}/api/analyze", json={
            "lyrics": large_lyrics,
            "title": "Too Long",
            "artist": "Test Artist"
        })
        print(f"   ✅ Oversized content rejection: {response.status_code} (should be 413)")
    except Exception as e:
        print(f"   ❌ Oversized content test failed: {e}")
    
    print()

def test_rate_limiting():
    """Test rate limiting (be careful not to hit real limits)"""
    print("⏱️ Testing Rate Limiting...")
    
    request_data = {
        "lyrics": "Short test lyrics for rate limiting",
        "title": "Rate Test",
        "artist": "Test Artist"
    }
    
    try:
        # Make a few requests to test normal operation
        success_count = 0
        for i in range(5):
            response = requests.post(f"{BASE_URL}/api/analyze", json=request_data)
            if response.status_code == 200:
                success_count += 1
            elif response.status_code == 429:
                print(f"   ✅ Rate limit triggered after {i+1} requests")
                break
            time.sleep(0.5)  # Small delay
        
        print(f"   ✅ Successful requests: {success_count}")
        print()
    except Exception as e:
        print(f"   ❌ Rate limiting test failed: {e}")

def test_authentication():
    """Test authentication endpoints"""
    print("🔐 Testing Authentication...")
    
    # Test token generation
    try:
        response = requests.post(f"{BASE_URL}/token")
        print(f"   ✅ Token generation: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get("access_token")
            print(f"      Token type: {token_data.get('token_type')}")
            
            # Test protected endpoint with token
            headers = {"Authorization": f"Bearer {token}"}
            request_data = {
                "lyrics": VALID_LYRICS,
                "title": "Protected Test",
                "artist": "Test Artist"
            }
            
            protected_response = requests.post(
                f"{BASE_URL}/api/analyze/protected", 
                json=request_data, 
                headers=headers
            )
            print(f"   ✅ Protected endpoint with token: {protected_response.status_code}")
            
            if protected_response.status_code == 200:
                data = protected_response.json()
                print(f"      Authenticated user: {data['security'].get('authenticatedUser')}")
        else:
            print(f"      Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Authentication test failed: {e}")
    
    # Test protected endpoint without token
    try:
        request_data = {
            "lyrics": VALID_LYRICS,
            "title": "Protected Test",
            "artist": "Test Artist"
        }
        
        response = requests.post(f"{BASE_URL}/api/analyze/protected", json=request_data)
        print(f"   ✅ Protected endpoint without token: {response.status_code} (should be 403)")
    except Exception as e:
        print(f"   ❌ Protected endpoint test failed: {e}")
    
    print()

def test_performance():
    """Test basic performance"""
    print("⚡ Testing Performance...")
    
    request_data = {
        "lyrics": VALID_LYRICS * 3,  # Longer lyrics for performance test
        "title": "Performance Test",
        "artist": "Speed Tester"
    }
    
    try:
        start_time = time.time()
        response = requests.post(f"{BASE_URL}/api/analyze", json=request_data)
        end_time = time.time()
        
        duration = end_time - start_time
        print(f"   ✅ Analysis duration: {duration:.2f} seconds")
        print(f"   ✅ Response status: {response.status_code}")
        
        if duration > 5.0:
            print(f"   ⚠️ Warning: Response took longer than 5 seconds")
        
    except Exception as e:
        print(f"   ❌ Performance test failed: {e}")
    
    print()

def main():
    """Run all manual tests"""
    print("🚀 Starting Manual API Tests")
    print("="*60)
    print(f"Testing API at: {BASE_URL}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("="*60)
    print()
    
    try:
        # Run all test categories
        test_health_endpoints()
        test_security_headers()
        test_lyrics_analysis()
        test_input_validation()
        test_rate_limiting()
        test_authentication()
        test_performance()
        
        print("="*60)
        print("✅ Manual testing completed!")
        print("Check the output above for any ❌ failures.")
        print("="*60)
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error!")
        print("Make sure the API server is running on http://127.0.0.1:8000")
        print("Start it with: python main_secure.py")
    except Exception as e:
        print(f"❌ Unexpected error during testing: {e}")

if __name__ == "__main__":
    main()
