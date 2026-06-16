import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AnimatedText, FadeIn } from "../components/AnimatedText";

const allProjects = [
  { 
    id: 1, 
    title: "Nexus E-Commerce", 
    category: "Web Development", 
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    description: "A modern digital checkout experience focusing on conversion and ease of use. Engineered with performance and brutalist aesthetics to elevate the brand's digital presence.",
    technologies: ["React", "Motion", "Tailwind CSS"],
    year: "2026"
  },
  { 
    id: 2, 
    title: "Fintech Dashboard", 
    category: "UI/UX Design", 
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    description: "A comprehensive financial dashboard that visualizes complex data sets with clarity and elegance. Tailored for enterprise-level scale.",
    technologies: ["Figma", "Prototyping", "Data Vis"],
    year: "2025"
  },
  { 
    id: 3, 
    title: "Travel App Mobile", 
    category: "Mobile App", 
    img: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&auto=format&fit=crop",
    description: "An intuitive mobile application designed to simplify travel planning. Features smooth transitions and a native feel across platforms.",
    technologies: ["React Native", "Expo", "GraphQL"],
    year: "2025"
  },
  { 
    id: 4, 
    title: "Agency Landing Page", 
    category: "Web Development", 
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    description: "A high-impact landing page crafted for a creative agency, showcasing their portfolio throughWebGL interactions and scroll-triggered animations.",
    technologies: ["Three.js", "GSAP", "WebGL"],
    year: "2024"
  },
  { 
    id: 5, 
    title: "Healthcare Platform", 
    category: "UI/UX Design", 
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
    description: "A user-centric healthcare portal focusing on accessibility and seamless patient-doctor communication.",
    technologies: ["Accessibility", "UX Research", "Wireframing"],
    year: "2024"
  },
  { 
    id: 6, 
    title: "Smart Home Interface", 
    category: "UI/UX Design", 
    img: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
    description: "A centralized control panel interface for smart home devices, bridging physical hardware with simple, elegant digital controls.",
    technologies: ["IoT Design", "Figma", "Interaction Design"],
    year: "2024"
  },
];

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const project = allProjects.find(p => p.id === Number(id));

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
                  <div className="absolute top-0 left-0 w-full h-full opacity-30 grayscale transition-all duration-700 bg-gradient-to-t from-[var(--bg-color)] via-transparent to-transparent z-10" style={{ backgroundImage: 'radial-gradient(circle at center, var(--text-color) 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                  <img 
                    src={project.img} 
                    alt={project.title} 
                    className="absolute top-0 left-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                  />
                </div>
              </FadeIn>
              
              <FadeIn delay={0.4}>
                <div className="text-base md:text-lg font-light text-[var(--gray-medium)] leading-relaxed space-y-6">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-color)] mb-4">Overview</h3>
                  <p>{project.description}</p>
                  <p>
                    Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur.
                  </p>
                </div>
              </FadeIn>
            </div>
            
            <div className="lg:col-span-4">
              <FadeIn delay={0.5}>
                <div className="p-8 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-color)]/50 backdrop-blur-sm sticky top-32">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-color)] mb-6">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span key={tech} className="px-3 py-1.5 border border-[var(--border-color)] rounded-full text-[9px] uppercase tracking-[0.2em] font-medium text-[var(--gray-medium)]">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="w-full h-[1px] bg-[var(--border-color)] my-8"></div>
                  
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-color)] mb-4">Client</h3>
                  <p className="text-sm font-light text-[var(--gray-medium)] uppercase tracking-wider">Independent Startups</p>
                  
                  <div className="mt-12">
                     <a href="#" className="w-full flex items-center justify-center px-6 py-4 bg-[var(--text-color)] text-[var(--bg-color)] text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:opacity-80 transition-opacity">
                       Visit Live Link
                     </a>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
