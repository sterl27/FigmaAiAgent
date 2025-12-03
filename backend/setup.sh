#!/bin/bash

# FastAPI Lyric Analysis Backend Setup Script

echo "Setting up FastAPI Lyric Analysis Backend..."

# Create virtual environment
python -m venv venv

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
pip install -r requirements.txt

# Download NLTK data (optional for enhanced analysis)
python -c "
import nltk
try:
    nltk.download('vader_lexicon')
    nltk.download('punkt')
    nltk.download('stopwords')
    print('NLTK data downloaded successfully')
except:
    print('NLTK download failed - basic analysis will still work')
"

echo "Setup complete!"
echo ""
echo "To run the server:"
echo "1. Activate the virtual environment:"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "   source venv/Scripts/activate"
else
    echo "   source venv/bin/activate"
fi
echo "2. Start the server:"
echo "   python main.py"
echo ""
echo "API will be available at: http://localhost:8000"
echo "Interactive docs at: http://localhost:8000/docs"
