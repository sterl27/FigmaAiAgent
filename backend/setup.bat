@echo off
REM FastAPI Lyric Analysis Backend Setup Script for Windows

echo Setting up FastAPI Lyric Analysis Backend...

REM Create virtual environment
python -m venv venv

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
pip install -r requirements.txt

REM Download NLTK data (optional for enhanced analysis)
python -c "import nltk; nltk.download('vader_lexicon'); nltk.download('punkt'); nltk.download('stopwords')"

echo Setup complete!
echo.
echo To run the server:
echo 1. Activate the virtual environment:
echo    venv\Scripts\activate.bat
echo 2. Start the server:
echo    python main.py
echo.
echo API will be available at: http://localhost:8000
echo Interactive docs at: http://localhost:8000/docs

pause
