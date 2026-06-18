import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface Section {
  id: string;
  title: string;
  content: string;
}

export interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  sections?: Section[];
  content?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  img: string;
  description: string;
  technologies: string[];
  year: string;
  frequentThisMonth: boolean;
  client: string;
  liveUrl?: string;
  order: number;
}

function formatDate(date: unknown): string {
  if (!date) return "";
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  if (date instanceof Date) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return String(date);
}

export async function getPosts(): Promise<Post[]> {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, orderBy("date", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      date: formatDate(data.date),
      excerpt: data.excerpt,
      sections: data.sections ?? [],
      content: data.content,
    };
  });
}

export async function getPost(id: string): Promise<Post | null> {
  const docRef = doc(db, "posts", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    title: data.title,
    date: formatDate(data.date),
    excerpt: data.excerpt,
    sections: data.sections,
    content: data.content,
  };
}

export async function getProjects(): Promise<Project[]> {
  const projectsRef = collection(db, "projects");
  const q = query(projectsRef, orderBy("order", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      category: data.category,
      img: data.img,
      description: data.description,
      technologies: data.technologies ?? [],
      year: data.year,
      frequentThisMonth: data.frequentThisMonth ?? false,
      client: data.client ?? "Independent",
      liveUrl: data.liveUrl ?? "#",
      order: data.order ?? 0,
    };
  });
}

export async function getProject(slug: string): Promise<Project | null> {
  const docRef = doc(db, "projects", slug);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    title: data.title,
    category: data.category,
    img: data.img,
    description: data.description,
    technologies: data.technologies ?? [],
    year: data.year,
    frequentThisMonth: data.frequentThisMonth ?? false,
    client: data.client ?? "Independent",
    liveUrl: data.liveUrl ?? "#",
    order: data.order ?? 0,
  };
}

export type ProjectInput = Omit<Project, "id">;

export async function createProject(id: string, data: ProjectInput): Promise<void> {
  await setDoc(doc(db, "projects", id), data);
}

export async function updateProject(id: string, data: Partial<ProjectInput>): Promise<void> {
  await setDoc(doc(db, "projects", id), data, { merge: true });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "projects", id));
}

export type PostInput = Omit<Post, "id">;

export async function createPost(id: string, data: PostInput): Promise<void> {
  await setDoc(doc(db, "posts", id), data);
}

export async function updatePost(id: string, data: Partial<PostInput>): Promise<void> {
  await setDoc(doc(db, "posts", id), data, { merge: true });
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, "posts", id));
}