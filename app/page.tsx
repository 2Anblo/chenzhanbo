import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Projects from '@/sections/Projects';
import Blog from '@/sections/Blog';
import HomeIntro from '@/components/HomeIntro';
import { getAllBlogPosts, getBlogCategories } from '@/lib/blog';
import { getAllProjects } from '@/lib/projects';

export const revalidate = 60;

export default async function HomePage() {
  const posts = await getAllBlogPosts();
  const categories = getBlogCategories();
  const projects = await getAllProjects();

  return (
    <HomeIntro>
      <Hero />
      <About />
      <Projects projects={projects} />
      <Blog posts={posts} categories={categories} />
    </HomeIntro>
  );
}
