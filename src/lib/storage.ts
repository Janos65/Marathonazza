import { supabase } from './supabase'

export interface UploadResult {
  url?: string
  error?: string
}

/**
 * Upload an image to a public bucket and return its public URL.
 * Stores under a fixed object name so re-uploads overwrite (upsert).
 */
export async function uploadImage(
  bucket: 'pair-photos' | 'hole-maps',
  objectBaseName: string,
  file: File,
  maxBytes: number,
): Promise<UploadResult> {
  if (!file.type.startsWith('image/')) return { error: 'Il file deve essere un’immagine.' }
  if (file.size > maxBytes) {
    return { error: `Immagine troppo grande (max ${Math.round(maxBytes / 1024 / 1024)}MB).` }
  }
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${objectBaseName}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type,
    cacheControl: '3600',
  })
  if (error) return { error: error.message }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  // bust cache so the overwritten image refreshes in the UI
  return { url: `${data.publicUrl}?v=${Date.now()}` }
}
