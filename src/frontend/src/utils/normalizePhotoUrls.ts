// Unwraps photoUrls which may be a plain array, an ICP Option type, null, or undefined
export function normalizePhotoUrls(photoUrls: unknown): string[] {
  if (!photoUrls) return [];
  if (Array.isArray(photoUrls)) return photoUrls as string[];
  // Handle ICP Candid Option type: { __kind__: "Some", value: string[] }
  if (typeof photoUrls === "object" && "__kind__" in (photoUrls as object)) {
    const opt = photoUrls as { __kind__: string; value?: string[] };
    if (opt.__kind__ === "Some" && Array.isArray(opt.value)) return opt.value;
    return [];
  }
  return [];
}
