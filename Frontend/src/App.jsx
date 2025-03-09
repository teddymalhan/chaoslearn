
import Playlist from './Playlist.jsx'
import './App.css'
import Welcomepage from './Welcome.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcomepage />} />
        <Route path="/playlist" element={<Playlist />} />
      </Routes>
    </Router>
  );
}

export default App;