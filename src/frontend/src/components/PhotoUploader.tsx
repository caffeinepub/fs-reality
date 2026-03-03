import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Camera, Loader2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useStorageUpload } from "../hooks/useStorageUpload";

interface PhotoItem {
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

interface PhotoUploaderProps {
  /** Existing remote URLs (e.g. from an existing property) */
  initialUrls?: string[];
  /** Called whenever the list of confirmed URLs changes */
  onChange: (urls: string[]) => void;
  maxPhotos?: number;
  disabled?: boolean;
}

export default function PhotoUploader({
  initialUrls = [],
  onChange,
  maxPhotos = 10,
  disabled = false,
}: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { uploadFile } = useStorageUpload();

  const [photos, setPhotos] = useState<PhotoItem[]>(() =>
    initialUrls.map((url, i) => ({
      id: `existing-${i}`,
      previewUrl: url,
      file: null,
      progress: 100,
      uploaded: true,
      uploadedUrl: url,
    })),
  );

  /** Derive committed URL list from current photos state */
  function getUrls(items: PhotoItem[]): string[] {
    return items
      .filter((p) => p.uploaded && p.uploadedUrl)
      .map((p) => p.uploadedUrl as string);
  }

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = maxPhotos - photos.length;
      if (remaining <= 0) {
        toast.error(`Maximum ${maxPhotos} photos allowed.`);
        return;
      }

      const toAdd = fileArray.slice(0, remaining);
      const invalid = toAdd.filter(
        (f) =>
          !["image/jpeg", "image/png", "image/webp"].includes(f.type) ||
          f.size > 5 * 1024 * 1024,
      );
      if (invalid.length > 0) {
        toast.error(
          "Some files were skipped (only JPEG/PNG/WebP up to 5MB allowed).",
        );
      }

      const valid = toAdd.filter(
        (f) =>
          ["image/jpeg", "image/png", "image/webp"].includes(f.type) &&
          f.size <= 5 * 1024 * 1024,
      );

      const newItems: PhotoItem[] = valid.map((file) => ({
        id: `new-${Date.now()}-${Math.random()}`,
        previewUrl: URL.createObjectURL(file),
        file,
        progress: 0,
        uploaded: false,
        uploadedUrl: null,
      }));

      setPhotos((prev) => {
        const next = [...prev, ...newItems];
        return next;
      });

      // trigger uploads outside of state update
      for (const item of newItems) {
        doUploadPhoto(item);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [photos.length, maxPhotos],
  );

  async function doUploadPhoto(item: PhotoItem) {
    if (!item.file) return;

    try {
      const url = await uploadFile(item.file, (pct) => {
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, progress: Math.round(pct) } : p,
          ),
        );
      });

      setPhotos((prev) => {
        const next = prev.map((p) =>
          p.id === item.id
            ? { ...p, progress: 100, uploaded: true, uploadedUrl: url }
            : p,
        );
        onChange(getUrls(next));
        return next;
      });

      // Revoke the object URL to free memory
      URL.revokeObjectURL(item.previewUrl);
    } catch (err) {
      console.error("Photo upload failed:", err);
      toast.error("Failed to upload a photo. Please try again.");
      setPhotos((prev) => {
        const next = prev.filter((p) => p.id !== item.id);
        onChange(getUrls(next));
        return next;
      });
    }
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
      const next = prev.filter((p) => p.id !== id);
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
      // reset input so same file can be re-added
      e.target.value = "";
    }
  }

  const isUploading = photos.some((p) => !p.uploaded && p.file);

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      {photos.length < maxPhotos && (
        <div
          data-ocid="photos.dropzone"
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
              <Camera className="w-6 h-6 text-brand" />
            </div>
            <div className="pointer-events-none">
              <p className="font-semibold text-foreground text-sm">
                {isDragging ? "Drop photos here" : "Upload Property Photos"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag & drop or click to browse · JPEG, PNG, WebP · Max 5MB each
                · Up to {maxPhotos} photos
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 border-brand text-brand hover:bg-brand/5"
              disabled={disabled}
              data-ocid="photos.upload_button"
              onClick={() => !disabled && fileInputRef.current?.click()}
            >
              <Upload className="w-3.5 h-3.5" />
              Choose Photos
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={handleFileInput}
            disabled={disabled}
          />
        </div>
      )}

      {/* Upload in progress indicator */}
      {isUploading && (
        <div
          className="flex items-center gap-2 text-sm text-muted-foreground"
          data-ocid="photos.loading_state"
        >
          <Loader2 className="w-4 h-4 animate-spin text-brand shrink-0" />
          <span>Uploading photos…</span>
        </div>
      )}

      {/* Thumbnails */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group aspect-square">
              <img
                src={photo.previewUrl}
                alt={`Preview ${photo.id}`}
                className={`w-full h-full object-cover rounded-lg border border-border transition-opacity ${
                  photo.uploaded ? "opacity-100" : "opacity-60"
                }`}
              />

              {/* Progress overlay */}
              {!photo.uploaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-lg gap-1 px-2">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <Progress
                    value={photo.progress}
                    className="h-1 w-full bg-white/30"
                  />
                  <span className="text-white text-xs font-medium">
                    {photo.progress}%
                  </span>
                </div>
              )}

              {/* Remove button */}
              {photo.uploaded && (
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-destructive/80"
                  aria-label="Remove photo"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Uploaded checkmark */}
              {photo.uploaded && (
                <div
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500/90 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <svg
                    className="w-3 h-3 text-white"
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {photos.filter((p) => p.uploaded).length} / {maxPhotos} photos
          uploaded
          {photos.length < maxPhotos &&
            ` · ${maxPhotos - photos.length} more allowed`}
        </p>
      )}
    </div>
  );
}
