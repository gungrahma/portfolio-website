import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Twitter, Linkedin, Github } from "lucide-react";
import { AnimatedText, FadeIn } from "../components/AnimatedText";
import { getProjects, type Project } from "../lib/firestore";

export function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      try {
        const data = await getProjects();
        if (!cancelled) {
          setProjects(data.slice(0, 2));
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load projects:", err);
          setLoading(false);
        }
      }
    }

    fetchProjects();

    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <div className="w-full">
      <section className="min-h-[90vh] flex flex-col justify-center pt-[var(--nav-height,80px)] xl:min-h-screen xl:pt-0">
        <div className="container mx-auto px-6 max-w-[1000px]">
          <div className="flex flex-col justify-center max-w-[800px]">
            <FadeIn delay={0.1}>
              <div className="mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-green-600 dark:text-green-500/80">WebDev, Machine Learning &bull; {new Date().getFullYear()}</span>
              </div>
            </FadeIn>
            
            <h1 className="text-[80px] md:text-[120px] leading-[0.85] font-black tracking-tighter mb-4 italic uppercase relative z-10 w-full">
              <AnimatedText el="span" text="Agung Rahma" className="block" />
            </h1>

            <FadeIn delay={0.3}>
              <p className="max-w-md text-[var(--gray-medium)] text-sm leading-relaxed mb-8 font-light">
                Full-stack web developer that's passionate about building interactive digital experiences. I combine web technologies with machine learning experimentation, particularly in medical informatics. I also explore visual storytelling through photography.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase opacity-40 mb-1 font-mono">Specialization</span>
                  <span className="text-xs font-medium">Web Developer and Machine Learning</span>
                </div>
                <div className="w-[1px] h-8 bg-[var(--border-color)]"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase opacity-40 mb-1 font-mono">Timezone</span>
                  <span className="text-xs font-medium">GMT +8</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section id="quick-introduction" className="py-24 md:py-32">
        <div className="container mx-auto px-6 max-w-[1000px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <AnimatedText
                el="h2"
                text="Quick introduction"
                className="text-4xl md:text-[40px] font-black italic uppercase tracking-tighter mb-8 md:mb-12"
              />
              <FadeIn delay={0.2}>
                <div className="space-y-6 text-base text-[var(--gray-medium)] font-light max-w-[600px] leading-relaxed">
                  <p>
                    I'm Agung, a developer from Bali who is interested in web development with machine learning. 
                    My internship in medical informatics sparked a passion for applying AI to real-world healthcare challenges. 
                    When I'm not building digital experiences, I'm exploring composition through photography.
                  </p>
                </div>
                <div className="flex gap-6 mt-8">
                  <a href="https://x.com/gungrahmaa" className="flex items-center gap-2 text-[10px] uppercase tracking-widest hover:text-[var(--text-color)] transition-all opacity-60 hover:opacity-100">
                    <Twitter size={14} /> <span>Twitter</span>
                  </a>
                  <a href="https://github.com/gungrahma" className="flex items-center gap-2 text-[10px] uppercase tracking-widest hover:text-[var(--text-color)] transition-all opacity-60 hover:opacity-100">
                    <Github size={14} /> <span>GitHub</span>
                  </a>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={0.4}>
              <div className="w-full aspect-square bg-[var(--gray-light)] rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gray-medium)] to-transparent opacity-20"></div>
                <img 
                  src="https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1000&auto=format&fit=crop" 
                  alt="Workspace" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-[var(--border-color)]">
        <div className="container mx-auto px-6 max-w-[1000px]">
          <div className="flex justify-between items-end mb-12">
            <AnimatedText
              el="h2"
              text="Selected Works"
              className="text-4xl md:text-[60px] font-black italic uppercase tracking-tighter m-0"
            />
            <Link to="/projects" className="hidden md:flex items-center text-[10px] uppercase tracking-[0.2em] font-medium opacity-60 hover:opacity-100 hover:text-[var(--text-color)] transition-colors group">
              View all works <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-col gap-10">
            {loading && (
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)] py-8">
                Loading projects...
              </div>
            )}

            {!loading && projects.length === 0 && (
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)] py-8">
                No projects yet. Add some via Firebase Console.
              </div>
            )}

            {!loading && projects.map((project, i) => (
              <FadeIn key={project.id} delay={i * 0.1}>
                <div className="group border-t border-[var(--border-color)] pt-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-10 transition-transform duration-300 hover:translate-x-2">
                  <div className="text-[10px] text-[var(--gray-medium)] uppercase tracking-[0.2em] mt-2 font-mono">
                    {project.category}
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold italic uppercase tracking-tight mb-3">{project.title}</h3>
                    <p className="text-[var(--gray-medium)] text-sm font-light mb-6 leading-relaxed max-w-xl">
                      {project.description}
                    </p>
                    <Link to={`/projects/${project.id}`} className="text-[10px] uppercase tracking-[0.2em] underline underline-offset-4 font-medium opacity-60 hover:opacity-100 transition-colors">
                      View Project
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          
          <div className="mt-10 md:hidden flex justify-center">
             <Link to="/projects" className="px-6 py-3 rounded-full border border-[var(--border-color)] text-[10px] uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] inline-flex items-center justify-center">
              View all works
            </Link>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 md:py-40">
        <div className="container mx-auto px-6 max-w-[1000px]">
          <FadeIn>
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-mono opacity-60 mb-8">Let's work together</h2>
            <a 
              href="mailto:agungrahmasuputraa@gmail.com" 
              className="block text-[32px] md:text-[60px] lg:text-[80px] font-black italic uppercase tracking-tighter hover:opacity-70 transition-opacity break-all leading-[0.9] text-transparent text-stroke stroke-[var(--text-color)]"
            >
              agungrahmasuputraa@gmail.com
            </a>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-24">
             <FadeIn delay={0.2} className="w-full">
                <form className="space-y-10 w-full" onSubmit={(e) => e.preventDefault()}>
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">01. Name</label>
                      <input type="text" className="bg-transparent border-b border-[var(--border-color)] py-3 text-sm focus:outline-none focus:border-[var(--text-color)] transition-colors placeholder:text-[var(--border-color)]" placeholder="John Doe" />
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">02. Email</label>
                      <input type="email" className="bg-transparent border-b border-[var(--border-color)] py-3 text-sm focus:outline-none focus:border-[var(--text-color)] transition-colors placeholder:text-[var(--border-color)]" placeholder="john@example.com" />
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">03. Project Details</label>
                      <textarea className="bg-transparent border-b border-[var(--border-color)] py-3 text-sm focus:outline-none focus:border-[var(--text-color)] transition-colors min-h-[120px] resize-none placeholder:text-[var(--border-color)]" placeholder="Tell me about your vision..."></textarea>
                   </div>
                   <button type="submit" className="px-8 py-4 bg-[var(--text-color)] text-[var(--bg-color)] text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:opacity-80 transition-opacity w-full sm:w-auto">
                     Submit
                   </button>
                </form>
             </FadeIn>
             <FadeIn delay={0.4} className="flex flex-col justify-end">
                <div className="text-sm font-light text-[var(--gray-medium)] leading-relaxed space-y-6 max-w-sm">
                   <p>
                     I am currently <span className="text-[var(--text-color)] font-medium">available for freelance work</span> and open to discussing full-time opportunities. Let's create something extraordinary together.
                   </p>
                   <p>
                     Typically responds 24/7. For immediate inquiries, please reach out via LinkedIn or Twitter.
                   </p>
                </div>
             </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}