export function Footer() {
  return (
    <footer className="h-20 flex flex-col md:flex-row items-center justify-between px-6 border-t border-[var(--border-color)] mt-20 text-[10px] uppercase tracking-[0.2em] opacity-40 max-w-[1000px] mx-auto w-full gap-4 md:gap-0 z-10 relative">
      <div className="flex gap-8">
        <span>Twitter (X)</span>
        <span>LinkedIn</span>
        <span>GitHub</span>
      </div>
      <div className="hidden md:block">
        <span>&copy; {new Date().getFullYear()} AGUNG RAHMA &mdash; DENPASAR, ID</span>
      </div>
    </footer>
  );
}
