import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Projects from '@/sections/Projects';
import Blog from '@/sections/Blog';
import Contact from '@/sections/Contact';

export default function Home() {
  return (
    <main className="w-full bg-white">
      <Hero />
      <About />
      <Projects />
      <Blog />
      <Contact />
    </main>
  );
}
