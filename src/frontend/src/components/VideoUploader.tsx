import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Upload, Video, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useStorageUpload } from "../hooks/useStorageUpload";

interface VideoItem {
  id: string;
  /** local preview URL (for newly selected files) or existing remote URL */
  previewUrl: string;
  /** the actual File to upload (null if it's an already-uploaded URL) */
  file: File | null;
  /** upload progress 0-100 */
  progress: number;
  /** set to true once uploaded */
  uploaded: boolean;
  /** the final blob URL after upload */
  uploadedUrl: string | null;
}

interface VideoUploaderProps {
  /** Existing remote URLs (e.g. from an existing property) */
  initialUrls?: string[];
  /** Called whenever the list of confirmed URLs changes */
  onChange: (urls: string[]) => void;
  maxVideos?: number;
  disabled?: boolean;
}

const ACCEPTED_MIME_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export default function VideoUploader({
  initialUrls = [],
  onChange,
  maxVideos = 3,
  disabled = false,
}: VideoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { uploadFile } = useStorageUpload();

  const [videos, setVideos] = useState<VideoItem[]>(() =>
    initialUrls.map((url, i) => ({
      id: `existing-${i}`,
      previewUrl: url,
      file: null,
      progress: 100,
      uploaded: true,
      uploadedUrl: url,
    })),
  );

  function getUrls(items: VideoItem[]): string[] {
    return items
      .filter((v) => v.uploaded && v.uploadedUrl)
      .map((v) => v.uploadedUrl as string);
  }

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = maxVideos - videos.length;
      if (remaining <= 0) {
        toast.error(`Maximum ${maxVideos} videos allowed.`);
        return;
      }

      const toAdd = fileArray.slice(0, remaining);
      const invalid = toAdd.filter(
        (f) => !ACCEPTED_MIME_TYPES.includes(f.type) || f.size > MAX_FILE_SIZE,
      );
      if (invalid.length > 0) {
        toast.error(
          "Some files were skipped (only MP4/WebM/MOV up to 50MB allowed).",
        );
      }

      const valid = toAdd.filter(
        (f) => ACCEPTED_MIME_TYPES.includes(f.type) && f.size <= MAX_FILE_SIZE,
      );

      const newItems: VideoItem[] = valid.map((file) => ({
        id: `new-${Date.now()}-${Math.random()}`,
        previewUrl: URL.createObjectURL(file),
        file,
        progress: 0,
        uploaded: false,
        uploadedUrl: null,
      }));

      setVideos((prev) => [...prev, ...newItems]);

      for (const item of newItems) {
        doUploadVideo(item);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [videos.length, maxVideos],
  );

  async function doUploadVideo(item: VideoItem) {
    if (!item.file) return;

    try {
      const url = await uploadFile(item.file, (pct) => {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === item.id ? { ...v, progress: Math.round(pct) } : v,
          ),
        );
      });

      setVideos((prev) => {
        const next = prev.map((v) =>
          v.id === item.id
            ? { ...v, progress: 100, uploaded: true, uploadedUrl: url }
            : v,
        );
        onChange(getUrls(next));
        return next;
      });

      URL.revokeObjectURL(item.previewUrl);
    } catch (err) {
      console.error("Video upload failed:", err);
      toast.error("Failed to upload video. Please try again.");
      setVideos((prev) => {
        const next = prev.filter((v) => v.id !== item.id);
        onChange(getUrls(next));
        return next;
      });
    }
  }

  function removeVideo(id: string) {
    setVideos((prev) => {
      const item = prev.find((v) => v.id === id);
      if (item?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
      const next = prev.filter((v) => v.id !== id);
      onChange(getUrls(next));
      return next;
    });
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    addFiles(e.dataTransfer.files);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  }

  const isUploading = videos.some((v) => !v.uploaded && v.file);

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      {videos.length < maxVideos && (
        <div
          data-ocid="videos.dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl px-6 py-8 text-center transition-all duration-200
            ${isDragging ? "border-brand bg-brand/5 scale-[1.01]" : "border-border hover:border-brand/50 hover:bg-muted/30"}
            ${disabled ? "opacity-50" : ""}
          `}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center pointer-events-none">
              <Video className="w-6 h-6 text-brand" />
            </div>
            <div className="pointer-events-none">
              <p className="font-semibold text-foreground text-sm">
                {isDragging ? "Drop video here" : "Upload Property Videos"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag & drop or click to browse · MP4, WebM, MOV · Max 50MB each
                · Up to {maxVideos} videos
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 border-brand text-brand hover:bg-brand/5"
              disabled={disabled}
              data-ocid="videos.upload_button"
              onClick={() => !disabled && fileInputRef.current?.click()}
            >
              <Upload className="w-3.5 h-3.5" />
              Choose Video
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            multiple
            className="sr-only"
            onChange={handleFileInput}
            disabled={disabled}
          />
        </div>
      )}

      {/* Uploading indicator */}
      {isUploading && (
        <div
          className="flex items-center gap-2 text-sm text-muted-foreground"
          data-ocid="videos.loading_state"
        >
          <Loader2 className="w-4 h-4 animate-spin text-brand shrink-0" />
          <span>Uploading video…</span>
        </div>
      )}

      {/* Video previews */}
      {videos.length > 0 && (
        <div className="space-y-3">
          {videos.map((video, idx) => (
            <div
              key={video.id}
              className="relative rounded-xl overflow-hidden border border-border bg-muted/30"
            >
              {/* Label */}
              <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                <Video className="w-3 h-3" />
                Video {idx + 1}
              </div>

              {/* Video preview */}
              <video
                src={video.previewUrl}
                muted
                playsInline
                className={`w-full max-h-48 object-cover transition-opacity ${
                  video.uploaded ? "opacity-100" : "opacity-50"
                }`}
              />

              {/* Progress overlay while uploading */}
              {!video.uploaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-2 px-4">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                  <Progress
                    value={video.progress}
                    className="h-1.5 w-full max-w-xs bg-white/30"
                  />
                  <span className="text-white text-sm font-medium">
                    {video.progress}% — Uploading…
                  </span>
                </div>
              )}

              {/* Remove button */}
              {video.uploaded && (
                <button
                  type="button"
                  onClick={() => removeVideo(video.id)}
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/80 transition-colors shadow-md"
                  aria-label="Remove video"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Uploaded badge */}
              {video.uploaded && (
                <div className="absolute bottom-2 right-2 z-10 bg-green-500/90 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Uploaded
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {videos.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {videos.filter((v) => v.uploaded).length} / {maxVideos} videos
          uploaded
          {videos.length < maxVideos &&
            ` · ${maxVideos - videos.length} more allowed`}
        </p>
      )}
    </div>
  );
}
