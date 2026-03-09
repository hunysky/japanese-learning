import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Hiragana from './pages/Hiragana/Hiragana';
import Katakana from './pages/Katakana/Katakana';
import Vocabulary from './pages/Vocabulary/Vocabulary';
import Grammar from './pages/Grammar/Grammar';
import Dashboard from './pages/Dashboard/Dashboard';
import Bookmarks from './pages/Bookmarks/Bookmarks';
import AdvancedHub from './pages/Advanced/AdvancedHub';
import AdvancedKanji from './pages/Advanced/AdvancedKanji';
import AdvancedGrammar from './pages/Advanced/AdvancedGrammar';
import ReadingPractice from './pages/Advanced/ReadingPractice';
import JlptExamWrapper from './pages/Advanced/JlptExam';
import NotFound from './pages/NotFound/NotFound';

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
          <Route path="/advanced" element={<AdvancedHub />} />
          <Route path="/advanced/kanji" element={<AdvancedKanji />} />
          <Route path="/advanced/grammar" element={<AdvancedGrammar />} />
          <Route path="/advanced/reading" element={<ReadingPractice />} />
          <Route path="/advanced/jlpt" element={<JlptExamWrapper />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
