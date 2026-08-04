import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { IntroPage } from './pages/IntroPage';
import { BlogPage } from './pages/BlogPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/blog" element={<BlogPage />} />
          {/* Individual posts are pre-rendered static HTML in public/blog/*.html,
              so they are served directly and never reach the router. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
