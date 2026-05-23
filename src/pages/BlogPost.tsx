import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AnimatedText, FadeIn } from "../components/AnimatedText";
import { getPost, type Post } from "../lib/firestore";
import { useState, useEffect } from "react";

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getPost(id)
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--gray-medium)] text-sm font-light">Loading post...</p>
        </div>
      </div>
    );
  }

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

          {post.sections && post.sections.length > 0 && (
            <FadeIn delay={0.4}>
              <div className="mb-12 p-8 bg-[var(--gray-light)] border border-[var(--border-color)] rounded-2xl">
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)] mb-4 block">Table of Contents</h3>
                <ul className="space-y-3 text-sm font-medium">
                  {post.sections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className="hover:opacity-60 transition-opacity">
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          )}

          <FadeIn delay={0.5}>
            <div className="text-lg md:text-xl font-light text-[var(--gray-medium)] leading-[1.8] space-y-8">
              {post.sections?.map((section) => (
                <div key={section.id}>
                  <h2
                    id={section.id}
                    className="text-2xl md:text-3xl font-bold italic uppercase tracking-tight text-[var(--text-color)] mt-12 mb-6"
                  >
                    {section.title}
                  </h2>
                  <p>{section.content}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}