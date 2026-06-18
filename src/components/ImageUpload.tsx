import { useRef, useState, useEffect, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, ImageIcon, AlertCircle, Loader2 } from "lucide-react";
import { uploadImage, validateImage, type UploadOptions } from "../lib/storage";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder: UploadOptions["folder"];
  disabled?: boolean;
  aspectRatio?: string;
  required?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  folder,
  disabled = false,
  aspectRatio = "aspect-video",
  required = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      abortControllerRef.current?.abort();
    };
  }, [previewUrl]);

  async function handleFile(file: File) {
    setError(null);

    const validationError = validateImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    abortControllerRef.current = new AbortController();
    setUploading(true);
    setProgress(0);

    try {
      const { promise } = uploadImage(file, {
        folder,
        onProgress: setProgress,
        signal: abortControllerRef.current.signal,
      });
      const result = await promise;
      onChange(result.url);
      setUploading(false);
      setProgress(100);
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl(null);
    } catch (err) {
      setUploading(false);
      setPreviewUrl(null);
      if (err instanceof Error) {
        if (err.message === "Upload aborted") {
          return;
        }
        if (err.message.includes("unauthorized") || err.message.includes("permission")) {
          setError("Permission denied. Check Storage security rules.");
        } else {
          setError(`Upload failed: ${err.message}`);
        }
      } else {
        setError("Upload failed. Please try again.");
      }
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !uploading) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled || uploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    e.target.value = "";
  }

  function handleClick() {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  }

  function handleRemove() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onChange("");
    setError(null);
    setProgress(0);
  }

  function handleCancelUpload() {
    abortControllerRef.current?.abort();
    setUploading(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  const displayUrl = previewUrl || value;
  const hasImage = !!displayUrl;

  return (
    <div className="flex flex-col gap-3">
      {hasImage ? (
        <div
          className={`relative ${aspectRatio} w-full rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--gray-light)] group`}
        >
          <img
            src={displayUrl}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 z-10">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <div className="text-white text-xs font-mono uppercase tracking-widest">
                Uploading {Math.round(progress)}%
              </div>
              <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <button
                type="button"
                onClick={handleCancelUpload}
                className="mt-2 px-4 py-1.5 border border-white/30 text-white text-[10px] uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {!uploading && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 z-10">
              <button
                type="button"
                onClick={handleClick}
                disabled={disabled}
                className="px-4 py-2 bg-white text-black text-[10px] uppercase tracking-widest font-bold rounded-full hover:bg-white/90 transition-colors"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative ${aspectRatio} w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? "border-[var(--text-color)] bg-[var(--text-color)]/5 scale-[1.01]"
              : "border-[var(--border-color)] hover:border-[var(--text-color)] bg-[var(--gray-light)]/30"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            onChange={handleInputChange}
            disabled={disabled || uploading}
            className="hidden"
            required={required}
          />
          <div className="flex flex-col items-center gap-2 text-center px-4">
            {isDragging ? (
              <>
                <Upload className="w-8 h-8 text-[var(--text-color)]" />
                <p className="text-[10px] uppercase tracking-[0.2em] font-mono font-medium">
                  Drop to upload
                </p>
              </>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-[var(--gray-medium)]" />
                <p className="text-[10px] uppercase tracking-[0.2em] font-mono font-medium">
                  Drag image here
                </p>
                <p className="text-[10px] text-[var(--gray-medium)] font-mono">
                  or click to browse
                </p>
                <p className="text-[9px] text-[var(--gray-medium)] font-mono mt-1">
                  JPG, PNG, WebP, GIF, AVIF · Max 5 MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-500 border border-red-500/30 bg-red-500/5 rounded-lg px-4 py-3">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!hasImage && !error && (
        <p className="text-[10px] text-[var(--gray-medium)] font-mono">
          Or paste an image URL below as fallback
        </p>
      )}
    </div>
  );
}
