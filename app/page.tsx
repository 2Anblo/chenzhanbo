import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Projects from '@/sections/Projects';
import Blog from '@/sections/Blog';
import HomeIntro from '@/components/HomeIntro';
import { getAllBlogPosts, getBlogCategories } from '@/lib/blog';
import { getAllProjects } from '@/lib/projects';

export default function HomePage() {
  const posts = getAllBlogPosts();
  const categories = getBlogCategories();
  const projects = getAllProjects();

  return (
    <HomeIntro>
      <Hero />
      <About />
      <Projects projects={projects} />
      <Blog posts={posts} categories={categories} />
    </HomeIntro>
  );
}
