import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ADMIN_EMAIL } from "../../lib/admin-config";
import { adminRoutes } from "../../lib/admin-routes";
import { AnimatedText, FadeIn } from "../../components/AnimatedText";

export function AdminLogin() {
  const { signIn, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate(adminRoutes.dashboard, { replace: true });
    }
  }, [isAdmin, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signIn(email, password);
      navigate(adminRoutes.dashboard, { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Sign in failed. Please try again.";
      if (message.includes("invalid-credential") || message.includes("wrong-password")) {
        setError("Invalid email or password.");
      } else if (message.includes("auth/too-many-requests")) {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full min-h-screen pt-[var(--nav-height,80px)] pb-24">
      <div className="container mx-auto px-6 max-w-[500px]">
        <div className="pt-20">
          <AnimatedText
            el="h1"
            text="Admin Login"
            className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-12"
          />

          <FadeIn delay={0.2}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={ADMIN_EMAIL}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--border-color)] rounded-lg text-base focus:outline-none focus:border-[var(--text-color)] transition-colors"
                  disabled={submitting}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)]"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--border-color)] rounded-lg text-base focus:outline-none focus:border-[var(--text-color)] transition-colors"
                  disabled={submitting}
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 border border-red-500/30 bg-red-500/5 rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 px-6 py-4 bg-[var(--text-color)] text-[var(--bg-color)] text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Signing in..." : "Sign In"}
              </button>

              <div className="text-center mt-4">
                <Link
                  to="/"
                  className="text-[10px] uppercase tracking-[0.2em] text-[var(--gray-medium)] hover:text-[var(--text-color)] transition-colors"
                >
                  ← Back to site
                </Link>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
