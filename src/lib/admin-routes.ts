const RAW_PATH = (import.meta.env.VITE_ADMIN_PATH as string | undefined) || "studio-ar";

export const ADMIN_PATH = RAW_PATH
  .trim()
  .replace(/^\/+/, "")
  .replace(/\/+$/, "");

function join(...parts: string[]): string {
  return "/" + [ADMIN_PATH, ...parts.filter(Boolean)].join("/");
}

export const adminRoutes = {
  base: `/${ADMIN_PATH}`,
  login: join("login"),
  dashboard: `/${ADMIN_PATH}`,
  newProject: join("new"),
  editProject: (slug: string) => join("edit", slug),
  newPost: join("blog", "new"),
  editPost: (id: string) => join("blog", "edit", id),
};
