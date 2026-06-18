import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, X, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { AnimatedText, FadeIn } from "../../components/AnimatedText";
import { adminRoutes } from "../../lib/admin-routes";
import {
  getPost,
  createPost,
  updatePost,
  type PostInput,
  type Section,
} from "../../lib/firestore";

interface FormState {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  sections: Section[];
}

const EMPTY_FORM: FormState = {
  id: "",
  title: "",
  date: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  excerpt: "",
  content: "",
  sections: [],
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function slugifyPreserveDashes(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function BlogPostForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      try {
        const data = await getPost(id);
        if (cancelled || !data) return;
        setForm({
          id: data.id,
          title: data.title,
          date: data.date,
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          sections: data.sections ?? [],
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to load post:", err);
        if (!cancelled) {
          setError("Failed to load post.");
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addSection() {
    setForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { id: `section-${prev.sections.length + 1}`, title: "", content: "" },
      ],
    }));
  }

  function updateSection(index: number, patch: Partial<Section>) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
  }

  function removeSection(index: number) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  }

  function moveSection(index: number, direction: "up" | "down") {
    setForm((prev) => {
      const newSections = [...prev.sections];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newSections.length) return prev;
      [newSections[index], newSections[targetIndex]] = [
        newSections[targetIndex],
        newSections[index],
      ];
      return { ...prev, sections: newSections };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const finalId = isEdit ? id! : slugify(form.id || form.title);

      if (!finalId) {
        setError("Slug/ID is required. Provide a title to auto-generate one.");
        setSaving(false);
        return;
      }
      if (!form.title || !form.date || !form.excerpt) {
        setError("Title, date, and excerpt are required.");
        setSaving(false);
        return;
      }

      const sanitizedSections = form.sections
        .filter((s) => s.title.trim() !== "" || s.content.trim() !== "")
        .map((s) => ({
          id: s.id || slugifyPreserveDashes(s.title) || "section",
          title: s.title.trim(),
          content: s.content,
        }));

      const payload: PostInput = {
        title: form.title,
        date: form.date,
        excerpt: form.excerpt,
        content: form.content || undefined,
        sections: sanitizedSections.length > 0 ? sanitizedSections : undefined,
      };

      if (isEdit) {
        await updatePost(id!, payload);
      } else {
        await createPost(finalId, payload);
      }
      navigate(`${adminRoutes.dashboard}?tab=posts`, { replace: true });
    } catch (err) {
      console.error("Failed to save post:", err);
      const message = err instanceof Error ? err.message : "Failed to save post.";
      if (message.includes("permission-denied")) {
        setError("Permission denied. Check your security rules and make sure you're signed in as admin.");
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
          Loading post...
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
              to={`${adminRoutes.dashboard}?tab=posts`}
              className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] font-medium opacity-60 hover:opacity-100 transition-opacity mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </FadeIn>

          <AnimatedText
            el="h1"
            text={isEdit ? "Edit Post" : "New Post"}
            className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-12"
          />

          <FadeIn delay={0.2}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {!isEdit && (
                <Field
                  label="Slug (ID)"
                  hint="URL-friendly identifier. Auto-generated from title if empty."
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
                    placeholder="my-awesome-post"
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

              <Field label="Date" required hint='Any string format, e.g. "May 1, 2026"'>
                <input
                  type="text"
                  required
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Excerpt" required hint="Short summary shown on the blog list">
                <textarea
                  required
                  value={form.excerpt}
                  onChange={(e) => updateField("excerpt", e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-y`}
                />
              </Field>

              <div>
                <div className="flex items-end justify-between mb-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">
                    Sections
                    <span className="ml-2 text-[var(--gray-medium)] normal-case">
                      (rich content blocks)
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={addSection}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-[var(--border-color)] text-[10px] uppercase tracking-[0.2em] font-medium rounded-full hover:border-[var(--text-color)] transition-colors"
                  >
                    <Plus size={12} /> Add Section
                  </button>
                </div>

                {form.sections.length === 0 && (
                  <div className="text-center py-10 border border-dashed border-[var(--border-color)] rounded-2xl text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">
                    No sections yet. Click "Add Section" to create content blocks.
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {form.sections.map((section, index) => (
                    <div
                      key={index}
                      className="p-5 border border-[var(--border-color)] rounded-2xl flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]">
                          Section {index + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveSection(index, "up")}
                            disabled={index === 0}
                            className="p-1.5 hover:bg-[var(--border-color)] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Move up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSection(index, "down")}
                            disabled={index === form.sections.length - 1}
                            className="p-1.5 hover:bg-[var(--border-color)] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Move down"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSection(index)}
                            className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
                            aria-label="Remove section"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Section ID (e.g. introduction)"
                        value={section.id}
                        onChange={(e) => updateSection(index, { id: slugifyPreserveDashes(e.target.value) })}
                        className={inputClass}
                      />
                      <input
                        type="text"
                        placeholder="Section title"
                        value={section.title}
                        onChange={(e) => updateSection(index, { title: e.target.value })}
                        className={inputClass}
                      />
                      <textarea
                        placeholder="Section content"
                        value={section.content}
                        onChange={(e) => updateSection(index, { content: e.target.value })}
                        rows={6}
                        className={`${inputClass} resize-y`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Field label="Plain Content (optional)" hint="Used as fallback if no sections. Use sections for rich content.">
                <textarea
                  value={form.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  rows={4}
                  className={`${inputClass} resize-y`}
                />
              </Field>

              {error && (
                <div className="text-sm text-red-500 border border-red-500/30 bg-red-500/5 rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <Link
                  to={`${adminRoutes.dashboard}?tab=posts`}
                  className="px-6 py-4 border border-[var(--border-color)] text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:border-[var(--text-color)] transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-4 bg-[var(--text-color)] text-[var(--bg-color)] text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                  {saving ? "Saving..." : isEdit ? "Save Changes" : "Publish Post"}
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
