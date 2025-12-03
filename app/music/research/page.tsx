'use client';

export default function MusicResearchPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          🎵 Music Research Agent
        </h1>
        <p className="text-gray-600">
          Comprehensive music metadata research using multiple APIs and AI
        </p>
      </div>

      {/* Search Interface */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🔍 Song Research
        </h2>
        <p className="text-gray-600 mb-4">
          Enter a song title and artist to get comprehensive metadata including BPM, key, genre, and more
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Song Title *
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Midnight City"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-1">
              Artist (Optional)
            </label>
            <input
              id="artist"
              type="text"
              placeholder="e.g., M83"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                const title = (document.getElementById('title') as HTMLInputElement)?.value;
                const artist = (document.getElementById('artist') as HTMLInputElement)?.value;
                
                if (!title) {
                  alert('Please enter a song title');
                  return;
                }
                
                // Make API call
                fetch('/api/music/research', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ title, artist })
                })
                .then(res => res.json())
                .then(data => {
                  console.log('Music Research Result:', data);
                  alert('Check the browser console for results!');
                })
                .catch(err => {
                  console.error('Research failed:', err);
                  alert('Research failed. Check console for details.');
                });
              }}
            >
              🔍 Research Song
            </button>
          </div>
        </div>

        {/* Quick Search Examples */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Quick Search Examples:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { title: "Midnight City", artist: "M83" },
              { title: "Bohemian Rhapsody", artist: "Queen" },
              { title: "Blinding Lights", artist: "The Weeknd" },
              { title: "Shape of You", artist: "Ed Sheeran" },
              { title: "Hotel California", artist: "Eagles" }
            ].map((song, index) => (
              <button
                key={index}
                className="px-3 py-1 text-sm bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-blue-500"
                onClick={() => {
                  (document.getElementById('title') as HTMLInputElement).value = song.title;
                  (document.getElementById('artist') as HTMLInputElement).value = song.artist;
                }}
              >
                {song.title} - {song.artist}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* API Information */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🛠️ Music Research System</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">🧠 Data Sources</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Wikipedia - Encyclopedic information, genres, release years
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                SongBPM - Tempo, musical key, energy metrics
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                MusicBrainz - Music metadata database
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                GPT-4 - AI-powered analysis and synthesis
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">📊 Extracted Metadata</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Song title and artist verification</li>
              <li>• BPM (beats per minute)</li>
              <li>• Musical key and mode</li>
              <li>• Genre classification</li>
              <li>• Release year</li>
              <li>• Album information</li>
              <li>• Energy and danceability scores</li>
              <li>• Wikipedia summary and links</li>
            </ul>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🔗 API Endpoints</h2>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
              <code className="text-gray-800">/api/music/research</code>
            </div>
            <p className="text-gray-600 text-sm mb-2">Comprehensive song research with AI synthesis</p>
            <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
{`{
  "title": "Midnight City",
  "artist": "M83",
  "useGptFallback": true
}`}
            </pre>
          </div>
          
          <div className="border border-gray-200 rounded p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
              <code className="text-gray-800">/api/music/research?title=Song&artist=Artist</code>
            </div>
            <p className="text-gray-600 text-sm">Simple query-based research</p>
          </div>
        </div>
      </div>

      {/* Python Backend Option */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🐍 Python Backend Alternative
        </h2>
        <p className="text-gray-700 mb-4">
          For enhanced NLP processing and better performance, use the FastAPI backend:
        </p>
        
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
          <div>cd backend</div>
          <div>python -m venv venv</div>
          <div>venv\\Scripts\\activate  # Windows</div>
          <div>pip install -r requirements.txt</div>
          <div>python music_agent.py</div>
        </div>
        
        <p className="text-gray-600 text-sm mt-4">
          The Python backend provides more sophisticated analysis with dedicated music libraries
          and advanced natural language processing capabilities.
        </p>
      </div>

      {/* Test the API */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🧪 Test the API</h2>
        <p className="text-gray-600 mb-4">
          Open your browser's developer tools and try this API call:
        </p>
        
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
{`fetch('/api/music/research', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Midnight City',
    artist: 'M83'
  })
})
.then(res => res.json())
.then(data => console.log(data));`}
        </div>
      </div>

      {/* Integration Examples */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🔗 Integration Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium mb-2">JavaScript Integration</h3>
            <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
{`const researchSong = async (title, artist) => {
  const response = await fetch('/api/music/research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, artist })
  });
  return response.json();
};

const result = await researchSong('Midnight City', 'M83');
console.log(result.data.bpm); // 105`}
            </pre>
          </div>
          
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium mb-2">Python Integration</h3>
            <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
{`from music_agent import MusicResearchAgent

agent = MusicResearchAgent()
profile = agent.research_song('Midnight City', 'M83')

print(f"BPM: {profile.bpm}")
print(f"Key: {profile.key}")
print(f"Genre: {profile.genre}")
print(f"Confidence: {profile.confidence_score:.1%}")`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
