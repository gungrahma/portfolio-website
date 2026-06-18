import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type UploadTask,
} from "firebase/storage";
import { storage } from "./firebase";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export interface UploadOptions {
  folder: "projects" | "blog";
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

export interface UploadResult {
  url: string;
  path: string;
}

function getExtension(filename: string, mimeType: string): string {
  const fromName = filename.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  const mimeMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  };
  return mimeMap[mimeType] ?? "bin";
}

export function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Unsupported file type. Allowed: ${ALLOWED_TYPES.map((t) => t.split("/")[1]).join(", ")}.`;
  }
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return `File is too large (${sizeMB} MB). Maximum is 5 MB.`;
  }
  return null;
}

export function uploadImage(file: File, options: UploadOptions): {
  task: UploadTask;
  promise: Promise<UploadResult>;
} {
  const { folder, onProgress, signal } = options;

  const ext = getExtension(file.name, file.type);
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const fullPath = `${folder}/${filename}`;

  const storageRef = ref(storage, fullPath);
  const task = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });

  const promise = new Promise<UploadResult>((resolve, reject) => {
    if (signal?.aborted) {
      task.cancel();
      reject(new Error("Upload aborted"));
      return;
    }

    const abortHandler = () => {
      task.cancel();
      reject(new Error("Upload aborted"));
    };
    signal?.addEventListener("abort", abortHandler, { once: true });

    task.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => {
        signal?.removeEventListener("abort", abortHandler);
        reject(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          signal?.removeEventListener("abort", abortHandler);
          resolve({ url, path: fullPath });
        } catch (err) {
          reject(err);
        }
      }
    );
  });

  return { task, promise };
}

export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "storage/object-not-found") {
      return;
    }
    throw err;
  }
}
