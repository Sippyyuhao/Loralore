import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import ImageModal from './components/ImageModal/ImageModal';
import Home from './pages/Home';
import Albums from './pages/Albums';
import About from './pages/About';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <ImageModal />
      </div>
    </Router>
  );
}

export default App;