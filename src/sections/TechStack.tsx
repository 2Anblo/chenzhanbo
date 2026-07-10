import { useEffect, useRef, useState } from 'react';
import { resumeData } from '@/data/resume';

const categoryLabels: Record<string, { label: string; color: string }> = {
  backend: { label: '后端', color: '#3B82F6' },
  ai: { label: 'AI', color: '#8B5CF6' },
  tools: { label: '工具', color: '#10B981' },
};

function SkillCard({ skill, index, inView }: { skill: typeof resumeData.skills[0]; index: number; inView: boolean }) {
  const cat = categoryLabels[skill.category];

  return (
    <div
      className={`group relative p-5 rounded-xl border border-black/[0.08] bg-[#F8F9FA] hover:bg-[#F1F3F4] transition-all duration-500 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <span
            className="inline-block px-2 py-0.5 text-[9px] font-mono font-medium rounded uppercase tracking-wider mb-2"
            style={{ color: cat.color, backgroundColor: `${cat.color}15` }}
          >
            {cat.label}
          </span>
          <h3 className="text-base font-medium text-[#1A1A2E] group-hover:text-white transition-colors">
            {skill.name}
          </h3>
        </div>
        {skill.proficiency && (
          <span className="text-xs font-mono text-[#5F6368]">{skill.proficiency}%</span>
        )}
      </div>

      <p className="mt-2 text-xs text-[#5F6368] leading-relaxed">
        {skill.description}
      </p>

      {skill.proficiency && (
        <div className="mt-3 h-[2px] bg-[#F1F3F4] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: inView ? `${skill.proficiency}%` : '0%',
              backgroundColor: cat.color,
              transitionDelay: `${index * 50 + 200}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function TechStack() {
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
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const grouped = resumeData.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof resumeData.skills>);

  return (
    <section id="stack" className="w-full py-32 md:py-40 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`mb-16 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <p className="text-xs font-mono uppercase tracking-widest text-[#3B82F6] mb-3">
            技能
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A2E] tracking-tight">
            技术栈
          </h2>
          <p className="mt-4 text-sm text-[#5F6368] max-w-xl">
            我的核心技术栈覆盖 Java 后端开发、AI 应用开发与工程工具链。持续学习中。
          </p>
        </div>

        <div ref={ref} className="space-y-12">
          {Object.entries(grouped).map(([category, skills]) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: categoryLabels[category]?.color || '#3B82F6' }}
                />
                <h3 className="text-sm font-mono font-medium text-[#5F6368] uppercase tracking-wider">
                  {categoryLabels[category]?.label || category}
                </h3>
                <div className="flex-1 h-[1px] bg-white/[0.05]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {skills.map((skill, index) => (
                  <SkillCard key={skill.name} skill={skill} index={index} inView={inView} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
