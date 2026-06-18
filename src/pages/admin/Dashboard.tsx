import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Edit2, Trash2, LogOut, ArrowUp, ArrowDown } from "lucide-react";
import { AnimatedText, FadeIn } from "../../components/AnimatedText";
import { useAuth } from "../../context/AuthContext";
import { adminRoutes } from "../../lib/admin-routes";
import {
  getProjects,
  deleteProject,
  getPosts,
  deletePost,
  type Project,
  type Post,
} from "../../lib/firestore";

type TabKey = "projects" | "posts";

export function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as TabKey) || "projects";

  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchAll() {
    setLoading(true);
    try {
      const [projectsData, postsData] = await Promise.all([getProjects(), getPosts()]);
      setProjects(projectsData);
      setPosts(postsData);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  function switchTab(tab: TabKey) {
    setSearchParams({ tab });
  }

  async function handleDeleteProject(id: string, title: string) {
    if (!confirm(`Delete project "${title}"? This cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteProject(id);
      await fetchAll();
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert("Failed to delete project. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeletePost(id: string, title: string) {
    if (!confirm(`Delete post "${title}"? This cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await deletePost(id);
      await fetchAll();
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="w-full min-h-screen pt-[var(--nav-height,80px)] pb-24">
      <div className="container mx-auto px-6 max-w-[1100px]">
        <div className="pt-20">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
            <div>
              <AnimatedText
                el="h1"
                text="Admin Dashboard"
                className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-2"
              />
              <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">
                Signed in as {user?.email}
              </p>
            </div>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-5 py-3 border border-[var(--border-color)] text-[10px] uppercase tracking-[0.2em] font-medium rounded-full hover:border-[var(--text-color)] transition-colors"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>

          <FadeIn delay={0.1}>
            <div className="flex gap-2 mb-8 border-b border-[var(--border-color)]">
              <TabButton
                active={activeTab === "projects"}
                onClick={() => switchTab("projects")}
                label="Projects"
                count={projects.length}
              />
              <TabButton
                active={activeTab === "posts"}
                onClick={() => switchTab("posts")}
                label="Posts"
                count={posts.length}
              />
            </div>
          </FadeIn>

          {loading && (
            <div className="py-20 text-center text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">
              Loading...
            </div>
          )}

          {!loading && activeTab === "projects" && (
            <ProjectsTab
              projects={projects}
              deletingId={deletingId}
              onDelete={handleDeleteProject}
            />
          )}

          {!loading && activeTab === "posts" && (
            <PostsTab
              posts={posts}
              deletingId={deletingId}
              onDelete={handleDeletePost}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 text-[10px] uppercase tracking-[0.2em] font-bold border-b-2 transition-colors -mb-px ${
        active
          ? "border-[var(--text-color)] text-[var(--text-color)]"
          : "border-transparent text-[var(--gray-medium)] hover:text-[var(--text-color)]"
      }`}
    >
      {label}
      <span className="ml-2 font-mono opacity-60">{String(count).padStart(2, "0")}</span>
    </button>
  );
}

function ProjectsTab({
  projects,
  deletingId,
  onDelete,
}: {
  projects: Project[];
  deletingId: string | null;
  onDelete: (id: string, title: string) => void;
}) {
  if (projects.length === 0) {
    return (
      <div className="py-20 text-center text-[var(--gray-medium)]">
        <p className="text-[10px] uppercase tracking-[0.2em] font-mono mb-6">
          No projects yet.
        </p>
        <Link
          to={adminRoutes.newProject}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--text-color)] text-[var(--bg-color)] text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:opacity-80 transition-opacity"
        >
          <Plus size={14} /> Add your first project
        </Link>
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="flex justify-end mb-4">
        <Link
          to={adminRoutes.newProject}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--text-color)] text-[var(--bg-color)] text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:opacity-80 transition-opacity"
        >
          <Plus size={14} /> Add Project
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 border border-[var(--border-color)] rounded-2xl hover:border-[var(--text-color)] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <span className="text-[10px] font-mono text-[var(--gray-medium)] uppercase tracking-wider">
                  #{project.order}
                </span>
                <h3 className="text-lg font-bold italic uppercase tracking-tight truncate">
                  {project.title}
                </h3>
                {project.frequentThisMonth && (
                  <span className="px-2 py-0.5 bg-[var(--text-color)] text-[var(--bg-color)] text-[8px] uppercase tracking-widest font-bold rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[var(--gray-medium)] uppercase tracking-[0.2em] font-mono">
                <span>{project.category}</span>
                <span>•</span>
                <span>{project.year}</span>
                <span>•</span>
                <span className="truncate">{project.id}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:flex-shrink-0">
              <Link
                to={adminRoutes.editProject(project.id)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] text-[10px] uppercase tracking-[0.2em] font-medium rounded-full hover:border-[var(--text-color)] transition-colors"
              >
                <Edit2 size={12} /> Edit
              </Link>
              <button
                onClick={() => onDelete(project.id, project.title)}
                disabled={deletingId === project.id}
                className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-500 text-[10px] uppercase tracking-[0.2em] font-medium rounded-full hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
              >
                <Trash2 size={12} />
                {deletingId === project.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}

function PostsTab({
  posts,
  deletingId,
  onDelete,
}: {
  posts: Post[];
  deletingId: string | null;
  onDelete: (id: string, title: string) => void;
}) {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center text-[var(--gray-medium)]">
        <p className="text-[10px] uppercase tracking-[0.2em] font-mono mb-6">
          No posts yet.
        </p>
        <Link
          to={adminRoutes.newPost}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--text-color)] text-[var(--bg-color)] text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:opacity-80 transition-opacity"
        >
          <Plus size={14} /> Write your first post
        </Link>
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="flex justify-end mb-4">
        <Link
          to={adminRoutes.newPost}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--text-color)] text-[var(--bg-color)] text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:opacity-80 transition-opacity"
        >
          <Plus size={14} /> New Post
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 border border-[var(--border-color)] rounded-2xl hover:border-[var(--text-color)] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold italic uppercase tracking-tight mb-1 line-clamp-2">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-[var(--gray-medium)] uppercase tracking-[0.2em] font-mono flex-wrap">
                <span>{post.date}</span>
                <span>•</span>
                <span className="truncate">{post.id}</span>
                {post.sections && post.sections.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <ArrowUp size={10} className="rotate-90" />
                      {post.sections.length} {post.sections.length === 1 ? "section" : "sections"}
                      <ArrowDown size={10} className="-rotate-90 -ml-1" />
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:flex-shrink-0">
              <Link
                to={adminRoutes.editPost(post.id)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] text-[10px] uppercase tracking-[0.2em] font-medium rounded-full hover:border-[var(--text-color)] transition-colors"
              >
                <Edit2 size={12} /> Edit
              </Link>
              <button
                onClick={() => onDelete(post.id, post.title)}
                disabled={deletingId === post.id}
                className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-500 text-[10px] uppercase tracking-[0.2em] font-medium rounded-full hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
              >
                <Trash2 size={12} />
                {deletingId === post.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
