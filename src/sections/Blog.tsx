import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { blogPosts, blogCategories } from '@/data/blogPosts';

export default function Blog() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filtered = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

  return (
    <section id="blog" className="w-full py-32 md:py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`mb-16 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <p className="text-xs font-mono uppercase tracking-widest text-[#3B82F6] mb-3">
            Blog
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A2E] tracking-tight">
            博客与思考
          </h2>
          <p className="mt-4 text-sm text-[#5F6368] max-w-xl">
            记录学习过程中的技术沉淀，分享 Java 后端、Spring 生态、AI Agent 等领域的实践心得。
          </p>
        </div>

        {/* Category Filter */}
        <div
          className={`flex flex-wrap gap-2 mb-10 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '100ms' }}
        >
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
              activeCategory === 'All'
                ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                : 'text-[#5F6368] border-black/[0.08] hover:border-[#3B82F6]/30 hover:text-[#1A1A2E]'
            }`}
          >
            All
          </button>
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                activeCategory === cat
                  ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                  : 'text-[#5F6368] border-black/[0.08] hover:border-[#3B82F6]/30 hover:text-[#1A1A2E]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Posts */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className={`group p-6 rounded-xl border border-black/[0.08] bg-[#F8F9FA] hover:bg-[#F1F3F4] hover:border-[#3B82F6]/20 transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-0.5 text-[9px] font-mono font-medium text-[#3B82F6] bg-[#3B82F6]/10 rounded uppercase tracking-wider">
                  {post.category}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-[#5F6368] font-mono">
                  <Clock size={10} />
                  {post.readingTime} 分钟阅读
                </div>
              </div>

              <h3 className="text-lg font-medium text-[#1A1A2E] group-hover:text-[#3B82F6] transition-colors line-clamp-2">
                {post.title}
              </h3>

              <p className="mt-2 text-sm text-[#5F6368] leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag size={10} className="text-[#5F6368]" />
                  <div className="flex gap-1.5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] font-mono text-[#5F6368]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#5F6368]">{post.publishedAt}</span>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs text-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity">
                阅读全文
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 border border-black/[0.08] text-sm text-[#5F6368] rounded-lg hover:border-[#3B82F6]/30 hover:text-[#3B82F6] transition-all duration-300"
          >
            查看全部博客
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
