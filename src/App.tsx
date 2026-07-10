import { Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import Home from '@/pages/Home';
import BlogPostPage from '@/pages/BlogPostPage';
import BlogListPage from '@/pages/BlogListPage';
import ResumePage from '@/pages/ResumePage';

function App() {
  return (
    <>
      <CustomCursor />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/resume" element={<ResumePage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
