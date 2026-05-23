import { Twitter, Github } from "lucide-react";
import { AnimatedText, FadeIn } from "../components/AnimatedText";

const skills = {
  Frontend: ["React", "TypeScript", "Tailwind", "Next.js"],
  "ML/AI": ["Python", "TensorFlow", "PyTorch", "Scikit-learn"],
};

const experiences = [
  { role: "Machine Learning Engineer", company: "Phrazer.io", period: "2025 — Present" },
  { role: "ML Research Intern", company: "Bali AI Lab", period: "2024" },
  { role: "Full Stack Developer", company: "TechStartup Indonesia", period: "2023 — 2024" },
  { role: "Frontend Developer", company: "Digital Agency Bali", period: "2022 — 2023" },
  { role: "Freelance Developer", company: "Self-employed", period: "2020 — 2022" },
];

export function About() {
  return (
    <div className="w-full min-h-screen pt-[var(--nav-height,80px)] pb-24">
      <div className="container mx-auto px-6 max-w-[1000px]">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-10 md:gap-16 items-start pt-20">
          {/* Left Column */}
          <div className="space-y-8">
            <FadeIn>
              <div className="w-full aspect-square bg-[var(--gray-light)] rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gray-medium)] to-transparent opacity-20"></div>
                <img
                  src="https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1000&auto=format&fit=crop"
                  alt="Workspace"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-6 text-base text-[var(--gray-medium)] font-light leading-relaxed">
                <p>
                  I'm Agung, a developer based in Bali. Currently focusing on startup development and Machine Learning research.
                </p>
                <p>
                  I enjoy discussing about any technologies stuff or even rhythm games!
                </p>
              </div>
              <div className="flex gap-6 mt-8">
                <a
                  href="https://x.com/gungrahmaa"
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest hover:text-[var(--text-color)] transition-all opacity-60 hover:opacity-100"
                >
                  <Twitter size={14} /> <span>Twitter</span>
                </a>
                <a
                  href="https://github.com/gungrahma"
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest hover:text-[var(--text-color)] transition-all opacity-60 hover:opacity-100"
                >
                  <Github size={14} /> <span>GitHub</span>
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Right Column - Sticky on desktop */}
          <div className="space-y-12 md:sticky md:top-[calc(var(--nav-height,80px)+2rem)] md:self-start">
            {/* Skills Section */}
            <FadeIn delay={0.3}>
              <div>
                <AnimatedText
                  el="h2"
                  text="Skills"
                  className="text-4xl md:text-[60px] font-black italic uppercase tracking-tighter mb-8"
                />
                <div className="space-y-6">
                  {Object.entries(skills).map(([group, items]) => (
                    <div key={group}>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)] mb-4 block">
                        {group}
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {items.map((skill) => (
                          <span
                            key={skill}
                            className="px-4 py-2 bg-[var(--gray-light)] border border-[var(--border-color)] rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Experience Section */}
            <FadeIn delay={0.4}>
              <div>
                <AnimatedText
                  el="h2"
                  text="Experience"
                  className="text-4xl md:text-[60px] font-black italic uppercase tracking-tighter mb-8"
                />
                <div className="space-y-6">
                  {experiences.map((exp, i) => (
                    <div key={i} className="border-t border-[var(--border-color)] pt-6">
                      <h3 className="text-lg font-bold mb-1">{exp.role}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-[var(--gray-medium)]">{exp.company}</span>
                        <span className="text-[10px] font-mono text-[var(--gray-medium)] opacity-60">
                          {exp.period}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}