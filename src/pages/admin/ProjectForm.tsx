import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, X, Plus } from "lucide-react";
import { AnimatedText, FadeIn } from "../../components/AnimatedText";
import { ImageUpload } from "../../components/ImageUpload";
import { adminRoutes } from "../../lib/admin-routes";
import {
  getProject,
  createProject,
  updateProject,
  type ProjectInput,
} from "../../lib/firestore";

interface FormState {
  id: string;
  title: string;
  category: string;
  img: string;
  description: string;
  technologies: string[];
  year: string;
  frequentThisMonth: boolean;
  client: string;
  liveUrl: string;
  order: number;
}

const EMPTY_FORM: FormState = {
  id: "",
  title: "",
  category: "Web Development",
  img: "",
  description: "",
  technologies: [],
  year: new Date().getFullYear().toString(),
  frequentThisMonth: false,
  client: "Independent Startups",
  liveUrl: "#",
  order: 0,
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ProjectForm() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEdit = !!slug;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    async function load() {
      try {
        const data = await getProject(slug);
        if (cancelled || !data) return;
        setForm({
          id: data.id,
          title: data.title,
          category: data.category,
          img: data.img,
          description: data.description,
          technologies: data.technologies,
          year: data.year,
          frequentThisMonth: data.frequentThisMonth,
          client: data.client,
          liveUrl: data.liveUrl ?? "#",
          order: data.order,
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to load project:", err);
        if (!cancelled) {
          setError("Failed to load project.");
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addTech() {
    const trimmed = techInput.trim();
    if (!trimmed) return;
    if (form.technologies.includes(trimmed)) {
      setTechInput("");
      return;
    }
    setForm((prev) => ({ ...prev, technologies: [...prev.technologies, trimmed] }));
    setTechInput("");
  }

  function removeTech(tech: string) {
    setForm((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const finalId = isEdit ? slug! : slugify(form.id || form.title);

      if (!finalId) {
        setError("Slug/ID is required. Set a custom ID or provide a title.");
        setSaving(false);
        return;
      }
      if (!form.title || !form.category || !form.img || !form.description) {
        setError("Title, category, image URL, and description are required.");
        setSaving(false);
        return;
      }

      const payload: ProjectInput = {
        title: form.title,
        category: form.category,
        img: form.img,
        description: form.description,
        technologies: form.technologies,
        year: form.year,
        frequentThisMonth: form.frequentThisMonth,
        client: form.client,
        liveUrl: form.liveUrl,
        order: Number(form.order) || 0,
      };

      if (isEdit) {
        await updateProject(slug!, payload);
      } else {
        await createProject(finalId, payload);
      }
      navigate(adminRoutes.dashboard, { replace: true });
    } catch (err) {
      console.error("Failed to save project:", err);
      const message = err instanceof Error ? err.message : "Failed to save project.";
      if (message.includes("permission-denied")) {
        setError("Permission denied. Make sure your security rules allow write for your account.");
      } else {
        setError(message);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">
          Loading project...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-[var(--nav-height,80px)] pb-32">
      <div className="container mx-auto px-6 max-w-[800px]">
        <div className="pt-12">
          <FadeIn delay={0.1}>
            <Link
              to={adminRoutes.dashboard}
              className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] font-medium opacity-60 hover:opacity-100 transition-opacity mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </FadeIn>

          <AnimatedText
            el="h1"
            text={isEdit ? "Edit Project" : "Add Project"}
            className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-12"
          />

          <FadeIn delay={0.2}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {!isEdit && (
                <Field
                  label="Slug (ID)"
                  hint="URL-friendly identifier, e.g. 'nexus-ecommerce'. Auto-generated from title if empty."
                >
                  <input
                    type="text"
                    value={form.id}
                    onChange={(e) => updateField("id", slugify(e.target.value))}
                    onBlur={(e) => {
                      if (!form.id && form.title) {
                        updateField("id", slugify(form.title));
                      }
                    }}
                    placeholder="nexus-ecommerce"
                    className={inputClass}
                  />
                </Field>
              )}

              <Field label="Title" required>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Category" required>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    placeholder="Web Development"
                    className={inputClass}
                  />
                </Field>

                <Field label="Year" required>
                  <input
                    type="text"
                    required
                    value={form.year}
                    onChange={(e) => updateField("year", e.target.value)}
                    placeholder="2026"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Order" hint="Lower numbers appear first">
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => updateField("order", Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>

                <Field label="Live URL" hint="Use '#' to hide the button">
                  <input
                    type="text"
                    value={form.liveUrl}
                    onChange={(e) => updateField("liveUrl", e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Client">
                <input
                  type="text"
                  value={form.client}
                  onChange={(e) => updateField("client", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Image" required>
                <ImageUpload
                  value={form.img}
                  onChange={(url) => updateField("img", url)}
                  folder="projects"
                  aspectRatio="aspect-[4/5]"
                />
                {!form.img && (
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-[10px] text-[var(--gray-medium)] font-mono">
                      Or paste an image URL:
                    </span>
                    <input
                      type="text"
                      value={form.img}
                      onChange={(e) => updateField("img", e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className={inputClass}
                    />
                  </div>
                )}
              </Field>

              <Field label="Description" required>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={5}
                  className={`${inputClass} resize-y`}
                />
              </Field>

              <Field
                label="Technologies"
                hint="Type a tech and press Enter or click Add"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTech();
                      }
                    }}
                    placeholder="React"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-4 py-3 border border-[var(--border-color)] rounded-lg hover:border-[var(--text-color)] transition-colors"
                    aria-label="Add technology"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {form.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--border-color)] rounded-full text-[10px] uppercase tracking-[0.2em] font-medium"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="hover:text-red-500 transition-colors"
                          aria-label={`Remove ${tech}`}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </Field>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.frequentThisMonth}
                  onChange={(e) => updateField("frequentThisMonth", e.target.checked)}
                  className="w-4 h-4 accent-[var(--text-color)]"
                />
                <span className="text-sm uppercase tracking-widest font-medium">
                  Frequent This Month
                </span>
              </label>

              {error && (
                <div className="text-sm text-red-500 border border-red-500/30 bg-red-500/5 rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <Link
                  to={adminRoutes.dashboard}
                  className="px-6 py-4 border border-[var(--border-color)] text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:border-[var(--text-color)] transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-4 bg-[var(--text-color)] text-[var(--bg-color)] text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                  {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 bg-transparent border border-[var(--border-color)] rounded-lg text-base focus:outline-none focus:border-[var(--text-color)] transition-colors";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && (
        <span className="text-[10px] text-[var(--gray-medium)] font-mono">{hint}</span>
      )}
    </div>
  );
}
