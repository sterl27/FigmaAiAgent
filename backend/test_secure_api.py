"""
Comprehensive Test Suite for Secure Lyric Analysis API
Tests security features, rate limiting, validation, and functionality
"""

import pytest
import asyncio
from fastapi.testclient import TestClient
from fastapi import status
import time
import json
from datetime import datetime

# Import the secure app
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main_secure import app

client = TestClient(app)

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

MINIMAL_LYRICS = "This is a short test lyric for validation purposes"

MALICIOUS_LYRICS = """
<script>alert('xss')</script>
javascript:void(0)
<img src=x onerror=alert('xss')>
"""

LARGE_LYRICS = "A" * 60000  # Exceeds 50k limit

class TestHealthEndpoints:
    """Test health check and root endpoints"""
    
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert data["version"] == "2.0.0"
        assert "security" in data
        assert data["security"] == "enabled"
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "features" in data
        assert data["features"]["rate_limiting"] is True
        assert data["features"]["security_headers"] is True

class TestSecurityHeaders:
    """Test security headers are properly set"""
    
    def test_security_headers_present(self):
        """Test that security headers are included"""
        response = client.get("/")
        headers = response.headers
        
        assert "X-Content-Type-Options" in headers
        assert headers["X-Content-Type-Options"] == "nosniff"
        
        assert "X-Frame-Options" in headers
        assert headers["X-Frame-Options"] == "DENY"
        
        assert "X-XSS-Protection" in headers
        assert headers["X-XSS-Protection"] == "1; mode=block"
        
        assert "Strict-Transport-Security" in headers
        assert "Content-Security-Policy" in headers
        assert "Referrer-Policy" in headers

class TestInputValidation:
    """Test input validation and sanitization"""
    
    def test_valid_lyrics_analysis(self):
        """Test analysis with valid lyrics"""
        request_data = {
            "lyrics": VALID_LYRICS,
            "title": "Test Song",
            "artist": "Test Artist",
            "userId": "test_user"
        }
        
        response = client.post("/api/analyze", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "complexity" in data
        assert "energy" in data
        assert "flow" in data
        assert "security" in data
        assert data["security"]["validatedInput"] == "true"
    
    def test_minimal_lyrics_analysis(self):
        """Test analysis with minimal valid lyrics"""
        request_data = {
            "lyrics": MINIMAL_LYRICS,
            "title": "Short Song",
            "artist": "Test Artist"
        }
        
        response = client.post("/api/analyze", json=request_data)
        assert response.status_code == 200
    
    def test_empty_lyrics_rejection(self):
        """Test that empty lyrics are rejected"""
        request_data = {
            "lyrics": "",
            "title": "Empty Song",
            "artist": "Test Artist"
        }
        
        response = client.post("/api/analyze", json=request_data)
        assert response.status_code == 422  # Validation error
    
    def test_short_lyrics_rejection(self):
        """Test that very short lyrics are rejected"""
        request_data = {
            "lyrics": "Short",
            "title": "Too Short",
            "artist": "Test Artist"
        }
        
        response = client.post("/api/analyze", json=request_data)
        assert response.status_code == 422  # Validation error
    
    def test_large_lyrics_rejection(self):
        """Test that overly large lyrics are rejected"""
        request_data = {
            "lyrics": LARGE_LYRICS,
            "title": "Too Long",
            "artist": "Test Artist"
        }
        
        response = client.post("/api/analyze", json=request_data)
        assert response.status_code == 413  # Payload too large
    
    def test_malicious_content_rejection(self):
        """Test that malicious content is rejected"""
        request_data = {
            "lyrics": MALICIOUS_LYRICS,
            "title": "Malicious Song",
            "artist": "Hacker"
        }
        
        response = client.post("/api/analyze", json=request_data)
        assert response.status_code == 400
        assert "malicious content" in response.json()["detail"]
    
    def test_xss_in_title_cleaned(self):
        """Test that XSS in title is cleaned"""
        request_data = {
            "lyrics": VALID_LYRICS,
            "title": "<script>alert('xss')</script>Test",
            "artist": "Test Artist"
        }
        
        response = client.post("/api/analyze", json=request_data)
        # Should succeed after cleaning
        assert response.status_code == 200
    
    def test_invalid_json_structure(self):
        """Test invalid JSON structure rejection"""
        response = client.post("/api/analyze", json={"invalid": "structure"})
        assert response.status_code == 422

class TestRateLimiting:
    """Test rate limiting functionality"""
    
    def test_rate_limit_normal_usage(self):
        """Test normal usage within rate limits"""
        request_data = {
            "lyrics": MINIMAL_LYRICS,
            "title": "Rate Test",
            "artist": "Test Artist"
        }
        
        # Should work fine for normal usage
        for i in range(3):
            response = client.post("/api/analyze", json=request_data)
            assert response.status_code == 200
            time.sleep(0.1)  # Small delay to avoid hitting limits
    
    def test_rate_limit_exceeded(self):
        """Test that rate limiting triggers after too many requests"""
        request_data = {
            "lyrics": MINIMAL_LYRICS,
            "title": "Rate Test",
            "artist": "Test Artist"
        }
        
        # Make many requests quickly to trigger rate limit
        rate_limited = False
        for i in range(25):  # More than the 20/minute limit
            response = client.post("/api/analyze", json=request_data)
            if response.status_code == 429:
                rate_limited = True
                break
        
        assert rate_limited, "Rate limiting should have been triggered"

class TestAnalysisAccuracy:
    """Test analysis accuracy and consistency"""
    
    def test_complexity_analysis(self):
        """Test complexity analysis components"""
        request_data = {
            "lyrics": VALID_LYRICS,
            "title": "Complex Test",
            "artist": "Test Artist"
        }
        
        response = client.post("/api/analyze", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        complexity = data["complexity"]
        
        assert "overall" in complexity
        assert "lexicalDiversity" in complexity
        assert "avgSyllables" in complexity
        assert "readabilityScore" in complexity
        
        # Basic sanity checks
        assert 0 <= complexity["overall"] <= 100
        assert 0 <= complexity["lexicalDiversity"] <= 100
        assert complexity["avgSyllables"] > 0
    
    def test_energy_analysis(self):
        """Test energy analysis components"""
        request_data = {
            "lyrics": VALID_LYRICS,
            "title": "Energy Test",
            "artist": "Test Artist"
        }
        
        response = client.post("/api/analyze", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        energy = data["energy"]
        
        assert "persona" in energy
        assert "level" in energy
        assert "intensity" in energy
        
        assert energy["persona"] in ["Energetic", "Calm", "Emotional", "Intellectual", "Balanced"]
        assert 0 <= energy["level"] <= 100
        assert energy["intensity"] in ["High", "Moderate", "Low"]
    
    def test_flow_analysis(self):
        """Test flow analysis components"""
        request_data = {
            "lyrics": VALID_LYRICS,
            "title": "Flow Test",
            "artist": "Test Artist"
        }
        
        response = client.post("/api/analyze", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        flow = data["flow"]
        
        assert "consistency" in flow
        assert "avgSyllables" in flow
        assert "stressPoints" in flow
        assert "rhymeVariety" in flow
        
        assert 0 <= flow["consistency"] <= 100
        assert flow["avgSyllables"] > 0
        assert flow["rhymeVariety"] in ["Complex", "Moderate", "Simple"]
    
    def test_security_metadata(self):
        """Test security metadata is included"""
        request_data = {
            "lyrics": VALID_LYRICS,
            "title": "Security Test",
            "artist": "Test Artist"
        }
        
        response = client.post("/api/analyze", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        security = data["security"]
        
        assert "analysisHash" in security
        assert "validatedInput" in security
        assert "timestamp" in security
        assert security["validatedInput"] == "true"
        assert len(security["analysisHash"]) == 16  # SHA256 truncated to 16 chars

class TestAuthentication:
    """Test authentication endpoints"""
    
    def test_token_generation(self):
        """Test token generation endpoint"""
        response = client.post("/token")
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"
    
    def test_protected_endpoint_without_auth(self):
        """Test protected endpoint rejects unauthenticated requests"""
        request_data = {
            "lyrics": VALID_LYRICS,
            "title": "Protected Test",
            "artist": "Test Artist"
        }
        
        response = client.post("/api/analyze/protected", json=request_data)
        assert response.status_code == 403  # No authorization header
    
    def test_protected_endpoint_with_invalid_token(self):
        """Test protected endpoint rejects invalid tokens"""
        request_data = {
            "lyrics": VALID_LYRICS,
            "title": "Protected Test",
            "artist": "Test Artist"
        }
        
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.post("/api/analyze/protected", json=request_data, headers=headers)
        assert response.status_code == 401
    
    def test_protected_endpoint_with_valid_token(self):
        """Test protected endpoint accepts valid tokens"""
        # Get a token first
        token_response = client.post("/token")
        token = token_response.json()["access_token"]
        
        request_data = {
            "lyrics": VALID_LYRICS,
            "title": "Protected Test",
            "artist": "Test Artist"
        }
        
        headers = {"Authorization": f"Bearer {token}"}
        response = client.post("/api/analyze/protected", json=request_data, headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "authenticatedUser" in data["security"]

class TestErrorHandling:
    """Test error handling and edge cases"""
    
    def test_invalid_http_method(self):
        """Test invalid HTTP methods are rejected"""
        response = client.put("/api/analyze")
        assert response.status_code == 405  # Method not allowed
    
    def test_nonexistent_endpoint(self):
        """Test nonexistent endpoints return 404"""
        response = client.get("/api/nonexistent")
        assert response.status_code == 404
    
    def test_simple_endpoint_functionality(self):
        """Test the simple analysis endpoint"""
        request_data = {
            "lyrics": VALID_LYRICS,
            "title": "Simple Test",
            "artist": "Test Artist"
        }
        
        response = client.post("/api/analyze/simple", json=request_data)
        assert response.status_code == 200
        
        # Should return same structure as regular endpoint
        data = response.json()
        assert "complexity" in data
        assert "energy" in data
        assert "flow" in data

class TestPerformance:
    """Test performance and resource usage"""
    
    def test_response_time(self):
        """Test that responses are reasonably fast"""
        request_data = {
            "lyrics": VALID_LYRICS,
            "title": "Performance Test",
            "artist": "Test Artist"
        }
        
        start_time = time.time()
        response = client.post("/api/analyze", json=request_data)
        end_time = time.time()
        
        assert response.status_code == 200
        assert (end_time - start_time) < 5.0  # Should complete in under 5 seconds
    
    def test_memory_efficiency(self):
        """Test that analysis doesn't consume excessive memory"""
        # Test with moderately long lyrics
        long_lyrics = VALID_LYRICS * 10
        
        request_data = {
            "lyrics": long_lyrics,
            "title": "Memory Test",
            "artist": "Test Artist"
        }
        
        response = client.post("/api/analyze", json=request_data)
        assert response.status_code == 200

# Utility functions for running tests
def run_security_tests():
    """Run all security-related tests"""
    print("Running security tests...")
    pytest.main([__file__ + "::TestSecurityHeaders", "-v"])
    pytest.main([__file__ + "::TestInputValidation", "-v"])
    pytest.main([__file__ + "::TestAuthentication", "-v"])

def run_functionality_tests():
    """Run all functionality tests"""
    print("Running functionality tests...")
    pytest.main([__file__ + "::TestAnalysisAccuracy", "-v"])
    pytest.main([__file__ + "::TestHealthEndpoints", "-v"])

def run_performance_tests():
    """Run performance tests"""
    print("Running performance tests...")
    pytest.main([__file__ + "::TestPerformance", "-v"])

def run_all_tests():
    """Run all tests"""
    print("Running complete test suite...")
    pytest.main([__file__, "-v"])

if __name__ == "__main__":
    # Run all tests when script is executed directly
    run_all_tests()
