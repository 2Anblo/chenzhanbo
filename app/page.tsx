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

  const latestProject = projects[0];
  const latestPost = posts[0];

  return (
    <HomeIntro>
      <Hero latestProject={latestProject} latestPost={latestPost} />
      <Blog posts={posts} categories={categories} />
      <About />
      <Projects projects={projects} />
    </HomeIntro>
  );
}
