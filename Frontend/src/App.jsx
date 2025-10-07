import Playlist from './Playlist.jsx';
import './App.css';
import Welcomepage from './Welcome.jsx';
import Quiz from './Quiz.jsx'; // Import the Quiz component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcomepage />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/quiz/:youtubeId" element={<Quiz />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;