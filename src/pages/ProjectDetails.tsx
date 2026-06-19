import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AnimatedText, FadeIn } from "../components/AnimatedText";
import { getProject, type Project } from "../lib/firestore";

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchProject() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const data = await getProject(id);
        if (!cancelled) {
          setProject(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load project:", err);
        if (!cancelled) {
          setProject(null);
          setLoading(false);
        }
      }
    }

    fetchProject();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center pt-[var(--nav-height,80px)] xl:pt-0">
        <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">
          Loading project...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center pt-[var(--nav-height,80px)] xl:pt-0">
        <div className="text-center">
          <h1 className="text-3xl font-bold italic uppercase tracking-tight mb-4">Project Not Found</h1>
          <Link to="/projects" className="text-[10px] uppercase tracking-[0.2em] underline underline-offset-4">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-[var(--nav-height,80px)] pb-32">
      <div className="container mx-auto px-6 max-w-[1000px]">
        <div className="pt-20">
          <FadeIn delay={0.1}>
            <Link to="/projects" className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] font-medium opacity-60 hover:opacity-100 transition-opacity mb-12">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-12">
              <FadeIn delay={0.2}>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)] mb-6 block">
                  {project.category} &bull; {project.year}
                </span>
              </FadeIn>

              <AnimatedText
                el="h1"
                text={project.title}
                className="text-5xl md:text-[80px] font-black italic uppercase tracking-tighter leading-[0.9] mb-12"
              />
            </div>

            <div className="lg:col-span-8 flex flex-col gap-10">
              <FadeIn delay={0.3}>
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-[var(--gray-light)] border border-[var(--border-color)] relative group">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="text-base md:text-lg font-light text-[var(--gray-medium)] leading-relaxed space-y-6">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-color)] mb-4">Overview</h3>
                  <p>{project.description}</p>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-4">
              <FadeIn delay={0.5}>
                <div className="p-8 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-color)]/50 backdrop-blur-sm sticky top-32">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-color)] mb-6">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1.5 border border-[var(--border-color)] rounded-full text-[9px] uppercase tracking-[0.2em] font-medium text-[var(--gray-medium)]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="w-full h-[1px] bg-[var(--border-color)] my-8"></div>

                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-color)] mb-4">Client</h3>
                  <p className="text-sm font-light text-[var(--gray-medium)] uppercase tracking-wider">{project.client}</p>

                  {project.liveUrl && project.liveUrl !== "#" && (
                    <div className="mt-12">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center px-6 py-4 bg-[var(--text-color)] text-[var(--bg-color)] text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:opacity-80 transition-opacity">
                        Visit Live Link
                      </a>
                    </div>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
