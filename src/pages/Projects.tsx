import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedText, FadeIn } from "../components/AnimatedText";
import { getProjects, type Project } from "../lib/firestore";

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      try {
        const data = await getProjects();
        if (!cancelled) {
          setProjects(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load projects:", err);
          setError("Failed to load projects. Please try again later.");
          setLoading(false);
        }
      }
    }

    fetchProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = Array.from(new Set(projects.map((p) => p.category)));
  const categoryCounts = projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const filteredProjects = selectedTags.length === 0
    ? projects
    : projects.filter((p) => selectedTags.includes(p.category));

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="w-full min-h-screen pt-[var(--nav-height,80px)] pb-24">
      <div className="container mx-auto px-6 max-w-[1000px]">

        <div className="pt-20 mb-16">
          <AnimatedText
            el="h1"
            text="Selected Project"
            className="text-[60px] md:text-[100px] leading-[0.85] font-black tracking-tighter mb-8 italic uppercase"
          />

          {categories.length > 0 && (
            <FadeIn delay={0.2}>
              <div className="flex flex-wrap gap-4 mt-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleTag(cat)}
                    className={`px-6 py-3 rounded-full border text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                      selectedTags.includes(cat)
                        ? "bg-[var(--text-color)] text-[var(--bg-color)] border-[var(--text-color)]"
                        : "bg-transparent text-[var(--text-color)] border-[var(--border-color)] hover:border-[var(--text-color)]"
                    }`}
                  >
                    {cat}
                    <span className="ml-2 opacity-50 font-mono normal-case tracking-normal">
                      {String(categoryCounts[cat]).padStart(2, "0")}
                    </span>
                  </button>
                ))}
              </div>
            </FadeIn>
          )}
        </div>

        {loading && (
          <div className="py-20 text-center text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">
            Loading projects...
          </div>
        )}

        {error && (
          <div className="py-20 text-center text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">
            {error}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="py-20 text-center text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">
            No projects yet. Add some via Firebase Console.
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={project.id}
                  className="group flex flex-col gap-4"
                >
                  <div className={`w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--gray-light)] border relative ${project.frequentThisMonth ? 'border-[var(--text-color)]' : 'border-[var(--border-color)]'}`}>
                    {project.frequentThisMonth && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-color)] animate-pulse"></span>
                          <span className="text-[9px] uppercase tracking-[0.2em] font-mono font-medium text-[var(--text-color)]">Frequent This Month</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700 bg-gradient-to-t from-[var(--bg-color)] via-transparent to-transparent z-10" style={{ backgroundImage: 'radial-gradient(circle at center, var(--text-color) 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                    <img
                      src={project.img}
                      alt={project.title}
                      className={`absolute top-0 left-0 w-full h-full object-cover mix-blend-overlay transition-transform duration-700 group-hover:scale-105 ${project.frequentThisMonth ? 'opacity-80' : 'opacity-50'}`}
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-[var(--gray-medium)] uppercase tracking-[0.2em] mb-2 font-mono">
                      {project.category}
                    </div>
                    <h3 className="text-2xl font-bold italic uppercase tracking-tight mb-2">{project.title}</h3>
                    <Link to={`/projects/${project.id}`} className="text-xs uppercase tracking-widest font-medium underline underline-offset-4 hover:text-[var(--gray-medium)] transition-colors">
                      View Case Study
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
}
