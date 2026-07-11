import { useEffect, useRef, useState } from 'react';
import { Github, Linkedin, Mail, MapPin, Calendar, GraduationCap } from 'lucide-react';
import { resumeData } from '@/data/resume';

const keywords = [
  'Java', 'Spring Boot', 'Spring Cloud', 'MySQL', 'Redis',
  'Docker', 'Linux', 'Git', 'AI Agent', 'RAG', 'LLM', 'Microservices'
];

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

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
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function About() {
  const section1 = useInView();
  const section2 = useInView();
  const section3 = useInView();

  return (
    <section id="about" className="w-full py-32 md:py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          {/* Left: Profile Card */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32">
              <div
                className={`p-6 rounded-xl border border-black/[0.08] bg-[#F8F9FA] transition-all duration-700 ${
                  section1.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-[#F1F3F4] border border-black/[0.08] flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-[#3B82F6] font-mono">ZB</span>
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A2E]">{resumeData.name}</h3>
                <p className="text-sm text-[#5F6368] mt-1">{resumeData.title}</p>

                <div className="flex items-center gap-2 mt-4 text-xs text-[#5F6368]">
                  <MapPin size={12} />
                  <span>China</span>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <a
                    href="https://github.com/2Anblo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#F1F3F4] text-[#5F6368] hover:text-[#3B82F6] hover:bg-[#F1F3F4]/80 transition-all"
                    aria-label="GitHub"
                  >
                    <Github size={16} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/zhanbo-chen-884913296/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#F1F3F4] text-[#5F6368] hover:text-[#3B82F6] hover:bg-[#F1F3F4]/80 transition-all"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={16} />
                  </a>
                  <a
                    href="mailto:zhanbochen210@foxmail.com"
                    className="p-2 rounded-lg bg-[#F1F3F4] text-[#5F6368] hover:text-[#3B82F6] hover:bg-[#F1F3F4]/80 transition-all"
                    aria-label="Email"
                  >
                    <Mail size={16} />
                  </a>
                </div>
              </div>

              {/* Keywords */}
              <div className="mt-6 flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1 text-[10px] font-mono font-medium text-[#5F6368] bg-[#F8F9FA] border border-black/[0.08] rounded-full uppercase tracking-wider hover:border-[#3B82F6]/30 hover:text-[#3B82F6] transition-all cursor-default"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* 关于我 */}
            <div ref={section1.ref}>
              <h2 className="text-3xl font-semibold text-[#1A1A2E] tracking-tight">
                关于我
              </h2>
              <div className="mt-6 space-y-4">
                <p className="text-[#5F6368] text-sm leading-[1.8]">
                  {resumeData.summary}
                </p>
              </div>
            </div>

            {/* 教育经历 */}
            <div ref={section2.ref}>
              <h2 className="text-3xl font-semibold text-[#1A1A2E] tracking-tight flex items-center gap-3">
                <GraduationCap size={24} className="text-[#3B82F6]" />
                教育经历
              </h2>
              <div className="mt-6 space-y-6">
                {resumeData.education.map((edu) => (
                  <div
                    key={edu.school}
                    className={`p-6 rounded-xl border border-black/[0.08] bg-[#F8F9FA] transition-all duration-700 ${
                      section2.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-[#1A1A2E]">{edu.school}</h3>
                        <p className="text-sm text-[#5F6368] mt-1">{edu.major} · {edu.degree}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#5F6368] font-mono">
                        <Calendar size={12} />
                        {edu.startDate} - {edu.endDate}
                      </div>
                    </div>
                    {edu.description && (
                      <p className="mt-4 text-xs text-[#5F6368] leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 我的工作 */}
            <div ref={section3.ref}>
              <h2 className="text-3xl font-semibold text-[#1A1A2E] tracking-tight">
                我的工作
              </h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Java 后端 Development',
                    desc: '构建高性能、可扩展的企业级后端服务，精通 Spring 生态与微服务架构。',
                    icon: '☕'
                  },
                  {
                    title: 'AI Application Development',
                    desc: '基于大语言模型构建智能应用，探索 RAG、Agent 等前沿 AI 工程实践。',
                    icon: '🤖'
                  },
                  {
                    title: 'Distributed Systems',
                    desc: '设计和实现分布式系统架构，关注高可用、一致性、可观测性。',
                    icon: '🌐'
                  },
                  {
                    title: 'Technical Writing',
                    desc: '通过博客和技术文档分享学习心得，沉淀知识体系。',
                    icon: '✍️'
                  }
                ].map((item, i) => (
                  <div
                    key={item.title}
                    className={`p-6 rounded-xl border border-black/[0.08] bg-[#F8F9FA] hover:bg-[#F1F3F4] transition-all duration-700 ${
                      section3.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                    }`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="mt-3 text-base font-medium text-[#1A1A2E]">{item.title}</h3>
                    <p className="mt-2 text-xs text-[#5F6368] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
