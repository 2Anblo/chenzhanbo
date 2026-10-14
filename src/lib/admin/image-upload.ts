import sharp from 'sharp';

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function prepareUploadedImage(file: File): Promise<Buffer> {
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error('Image must be smaller than 2 MB.');
  if (!IMAGE_TYPES.includes(file.type)) throw new Error('Choose a JPEG, PNG, or WebP image.');
  try {
    const input = Buffer.from(await file.arrayBuffer());
    const image = sharp(input, { limitInputPixels: 40_000_000, failOn: 'error' });
    const metadata = await image.metadata();
    if (!['jpeg', 'png', 'webp'].includes(metadata.format ?? '')) throw new Error('Invalid image');
    // Re-encode pixels, strip metadata, and cap cover dimensions before persistence.
    return await image.rotate().resize(1600, 1200, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
  } catch {
    throw new Error('This image could not be read. Choose another file.');
  }
}
