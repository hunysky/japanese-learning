import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Hiragana from './pages/Hiragana/Hiragana';
import Katakana from './pages/Katakana/Katakana';
import Vocabulary from './pages/Vocabulary/Vocabulary';
import Grammar from './pages/Grammar/Grammar';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hiragana" element={<Hiragana />} />
          <Route path="/katakana" element={<Katakana />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/grammar" element={<Grammar />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
