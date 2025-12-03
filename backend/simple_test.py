"""
Simple API Test - Test the original main.py first to establish baseline
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_original_api():
    """Test the original API endpoints"""
    print("🧪 Testing Original API...")
    
    # Test data
    test_data = {
        "lyrics": """
        I've been working on this code all night long
        Trying to make the functions work just right
        The bugs keep coming but I stay strong
        I'll keep debugging through the morning light
        """,
        "title": "Coder's Blues",
        "artist": "Dev Artist",
        "userId": "test_user"
    }
    
    try:
        # Test health
        print("Testing health endpoint...")
        response = requests.get(f"{BASE_URL}/")
        print(f"Health check: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        
        # Test analysis
        print("\nTesting analysis endpoint...")
        response = requests.post(f"{BASE_URL}/api/analyze", json=test_data)
        print(f"Analysis: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Complexity: {data.get('complexity', {}).get('overall', 'N/A')}")
            print(f"Energy: {data.get('energy', {}).get('level', 'N/A')}")
            print("✅ API is working correctly!")
        else:
            print(f"❌ Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure it's running on port 8000.")
        print("Run: python main.py (for original) or python main_secure.py (for secure)")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    test_original_api()
