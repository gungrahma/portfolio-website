import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion } from "motion/react";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CustomCursor } from "./components/CustomCursor";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Projects } from "./pages/Projects";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { ProjectDetails } from "./pages/ProjectDetails";
import { AdminLogin } from "./pages/admin/Login";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { ProjectForm } from "./pages/admin/ProjectForm";
import { BlogPostForm } from "./pages/admin/BlogPostForm";
import { adminRoutes } from "./lib/admin-routes";

// ScrollToTop on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

// Lenis initialization component
function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  return null;
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
        <Route path="/projects/:id" element={<PageWrapper><ProjectDetails /></PageWrapper>} />
        <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
        <Route path="/blog/:id" element={<PageWrapper><BlogPost /></PageWrapper>} />

        <Route path={adminRoutes.login} element={<PageWrapper><AdminLogin /></PageWrapper>} />
        <Route
          path={adminRoutes.dashboard}
          element={
            <ProtectedRoute>
              <PageWrapper><AdminDashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path={adminRoutes.newProject}
          element={
            <ProtectedRoute>
              <PageWrapper><ProjectForm /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path={adminRoutes.editProject(":slug")}
          element={
            <ProtectedRoute>
              <PageWrapper><ProjectForm /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path={adminRoutes.newPost}
          element={
            <ProtectedRoute>
              <PageWrapper><BlogPostForm /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path={adminRoutes.editPost(":id")}
          element={
            <ProtectedRoute>
              <PageWrapper><BlogPostForm /></PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function NotFound() {
  return (
    <div className="w-full min-h-screen pt-[var(--nav-height,80px)] pb-24">
      <div className="container mx-auto px-6 max-w-[600px] flex flex-col items-center justify-center text-center pt-40">
        <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter mb-4">
          404
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--gray-medium)] mb-8">
          Page not found
        </p>
        <a
          href="/"
          className="px-6 py-3 border border-[var(--border-color)] rounded-full text-[10px] uppercase tracking-[0.2em] hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] transition-all"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <SmoothScroll />
          <ScrollToTop />
          <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] selection:bg-[var(--text-color)] selection:text-[var(--bg-color)] transition-colors duration-300 font-sans">
            {/* Ambient Backgrounds */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-indigo-900/10 rounded-full blur-[120px] dark:bg-indigo-900/20"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-zinc-800/20 rounded-full blur-[100px] dark:bg-zinc-800/40"></div>
            </div>
            <CustomCursor />
            <Navbar />
            <main>
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
