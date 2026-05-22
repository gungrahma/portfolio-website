import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AnimatedText, FadeIn } from "../components/AnimatedText";

const posts = {
  "1": {
    title: "10 Tips for Better UX Design in 2026",
    date: "April 15, 2026",
    content: "Discover the latest trends and practical strategies to elevate user experience in modern web applications.",
  },
  "2": {
    title: "Why Framer Motion is my favorite animation library",
    date: "March 22, 2026",
    content: "A deep dive into how Framer Motion simplifies complex animations in React while keeping performance high.",
  },
  "3": {
    title: "The Future of Frontend Development",
    date: "February 10, 2026",
    content: "Exploring upcoming technologies, AI tools, and architectural shifts that will define the next era of UI engineering.",
  },
  "4": {
    title: "Integrate Openclaw to discord bot",
    date: "December 01, 2025",
    content: "Explore about what is openclaw and how being integrated in Discord bots as a personal assistance"
  }
};

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const post = id ? posts[id as keyof typeof posts] : null;

  if (!post) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-[10px] uppercase tracking-[0.2em] underline underline-offset-4">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-[var(--nav-height,80px)] pb-24">
      <div className="container mx-auto px-6 max-w-[800px]">
        <div className="pt-20">
          <FadeIn delay={0.1}>
            <Link to="/blog" className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] font-medium opacity-60 hover:opacity-100 transition-opacity mb-12">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Link>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)] mb-6 block">
              {post.date}
            </span>
          </FadeIn>
          
          <AnimatedText 
            el="h1" 
            text={post.title} 
            className="text-4xl md:text-[4rem] font-bold italic uppercase tracking-tight leading-[1.05] mb-12" 
          />
          
          <FadeIn delay={0.4}>
            <div className="mb-12 p-8 bg-[var(--gray-light)] border border-[var(--border-color)] rounded-2xl">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)] mb-4 block">Table of Contents</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#introduction" className="hover:opacity-60 transition-opacity">Introduction</a></li>
                <li><a href="#embracing-the-aesthetics" className="hover:opacity-60 transition-opacity">Embracing the aesthetics</a></li>
                <li><a href="#conclusion" className="hover:opacity-60 transition-opacity">Conclusion</a></li>
              </ul>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.5}>
            <div className="text-lg md:text-xl font-light text-[var(--gray-medium)] leading-[1.8] space-y-8">
              <h2 id="introduction" className="text-2xl md:text-3xl font-bold italic uppercase tracking-tight text-[var(--text-color)] mt-12 mb-6">Introduction</h2>
              <p>{post.content}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              <h2 id="embracing-the-aesthetics" className="text-2xl md:text-3xl font-bold italic uppercase tracking-tight text-[var(--text-color)] mt-16 mb-6">Embracing the aesthetics</h2>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>

              <h2 id="conclusion" className="text-2xl md:text-3xl font-bold italic uppercase tracking-tight text-[var(--text-color)] mt-16 mb-6">Conclusion</h2>
              <p>
                In conclusion, optimizing these aspects helps users navigate information smoothly, creating a better reading experience that keeps them engaged and focused on the content itself.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
