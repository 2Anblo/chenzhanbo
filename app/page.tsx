import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Projects from '@/sections/Projects';
import Blog from '@/sections/Blog';
import Contact from '@/sections/Contact';
import { getAllBlogPosts, getBlogCategories } from '@/lib/blog';

export default function HomePage() {
  const posts = getAllBlogPosts();
  const categories = getBlogCategories();

  return (
    <main className="w-full bg-white">
      <Hero />
      <About />
      <Projects />
      <Blog posts={posts} categories={categories} />
      <Contact />
    </main>
  );
}
