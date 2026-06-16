import { collection, getDocs, doc, getDoc, orderBy, query, Timestamp } from "firebase/firestore";
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