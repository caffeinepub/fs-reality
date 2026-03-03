# FS Realty

## Current State
Property listings support photo uploads (up to 10 photos) stored via blob-storage. The `Property` type has a `photoUrls: [Text]` field. The `PostPropertyPage` shows a "Property Photos" section with a `PhotoUploader` component. The `PropertyDetailPage` shows a photo carousel/gallery. `createProperty` and `updateProperty` backend calls accept `photoUrls`.

## Requested Changes (Diff)

### Add
- `videoUrls: [Text]` field on the `Property` type in `main.mo`
- Video upload section in `PostPropertyPage` (below photos), accepting MP4/WebM/MOV up to 50MB, max 3 videos
- `VideoUploader` component (similar to PhotoUploader) that uses blob-storage to upload video files and returns URLs
- Video playback section in `PropertyDetailPage` (below photo gallery), showing uploaded videos in a `<video>` player with controls

### Modify
- `createProperty` and `updateProperty` backend functions to accept `videoUrls: [Text]` parameter
- `PostPropertyPage` form state to include `videoUrls: string[]`
- `PostPropertyPage` form submit to pass `videoUrls` to backend
- `PropertyDetailPage` to display videos if present
- `backend.d.ts` to include `videoUrls` in `Property` interface and updated method signatures

### Remove
- Nothing

## Implementation Plan
1. Update `main.mo`: add `videoUrls: [Text]` to `Property` type; update `createProperty` and `updateProperty` to accept `videoUrls` parameter and store it
2. Regenerate `backend.d.ts` to reflect new `videoUrls` field and updated function signatures
3. Create `VideoUploader.tsx` component: drag-and-drop + file picker for video files (MP4/WebM/MOV, max 50MB each, up to 3 videos), uses `useStorageUpload`, shows progress and preview thumbnails
4. Update `PostPropertyPage.tsx`: add `videoUrls: string[]` to form state, add "Property Videos" section (badge 6) below photos section using `VideoUploader`, pass `videoUrls` to `createProperty`
5. Update `PropertyDetailPage.tsx`: render a "Property Videos" section below the gallery if `videoUrls` is non-empty, using HTML `<video>` player with controls
