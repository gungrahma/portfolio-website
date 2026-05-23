import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatedText, FadeIn } from "../components/AnimatedText";
import { getPosts, type Post } from "../lib/firestore";

export function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen pt-[var(--nav-height,80px)] pb-24">
      <div className="container mx-auto px-6 max-w-[800px]">

        <div className="pt-20 mb-16">
          <AnimatedText
            el="h1"
            text="Blog"
            className="text-[60px] md:text-[100px] leading-[0.85] font-black tracking-tighter mb-8 italic uppercase"
          />
          <FadeIn delay={0.2}>
            <p className="text-[var(--gray-medium)] text-sm font-light mb-12 max-w-xl leading-relaxed">Thoughts, tutorials, and insights of everythings.</p>
            <div className="flex flex-col gap-2 mb-8">
              <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">Search Archive</label>
              <input
                type="text"
                placeholder="Type to filter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-[var(--border-color)] py-3 text-sm focus:outline-none focus:border-[var(--text-color)] transition-colors placeholder:text-[var(--border-color)]"
              />
            </div>
          </FadeIn>
        </div>

        {loading ? (
          <FadeIn>
            <p className="text-[var(--gray-medium)] text-sm font-light">Loading posts...</p>
          </FadeIn>
        ) : (
          <div className="flex flex-col gap-16">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <FadeIn key={post.id} delay={index * 0.1}>
                  <article className="border-b border-[var(--border-color)] pb-10 last:border-0 last:pb-0 group">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)] mb-4 block">
                      {post.date}
                    </span>
                    <Link to={`/blog/${post.id}`}>
                      <h2 className="text-3xl md:text-[3rem] font-bold italic uppercase tracking-tight leading-[1.1] mb-4 group-hover:opacity-60 transition-opacity">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-sm font-light text-[var(--gray-medium)] mb-6 max-w-2xl leading-relaxed">
                      {post.excerpt}
                    </p>
                    <Link to={`/blog/${post.id}`} className="text-[10px] uppercase tracking-[0.2em] underline underline-offset-4 font-medium opacity-60 hover:opacity-100 transition-colors">
                      Read Article
                    </Link>
                  </article>
                </FadeIn>
              ))
            ) : (
              <FadeIn>
                <p className="text-[var(--gray-medium)] text-sm font-light">No posts found matching your search.</p>
              </FadeIn>
            )}
          </div>
        )}

      </div>
    </div>
  );
}