import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { MovieDetail } from './pages/MovieDetail';
import { Watch } from './pages/Watch';
import { Search } from './pages/Search';
import { Category } from './pages/Category';
import { Favorites } from './pages/Favorites';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="movie/:slug" element={<MovieDetail />} />
          <Route path="watch/:slug/:episodeSlug" element={<Watch />} />
          <Route path="search" element={<Search />} />
          <Route path="type/:type" element={<Category />} />
          <Route path="category/:type" element={<Category />} />
          <Route path="favorites" element={<Favorites />} />
        </Route>
      </Routes>
    </Router>
  );
}
