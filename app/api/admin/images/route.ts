import { randomUUID } from 'node:crypto';
import { isAuthenticated } from '@/lib/admin/auth';
import { prepareUploadedImage, MAX_IMAGE_BYTES } from '@/lib/admin/image-upload';
import { db } from '@/lib/db';
import { uploadedImages } from '@/lib/db/schema';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return Response.json({ error: 'Please sign in again.' }, { status: 401 });
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return Response.json({ error: 'Upload failed. Please try again.' }, { status: 403 });
  }
  if (Number(request.headers.get('content-length')) > MAX_IMAGE_BYTES + 64 * 1024) {
    return Response.json({ error: 'Image must be smaller than 2 MB.' }, { status: 413 });
  }
  let image: Buffer;
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) throw new Error('Choose a JPEG, PNG, or WebP image.');
    image = await prepareUploadedImage(file);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Upload failed. Please try again.' }, { status: 400 });
  }
  try {
    const id = randomUUID();
    await db.insert(uploadedImages).values({ id, data: image.toString('base64') });
    return Response.json({ url: `/api/images/${id}` });
  } catch {
    return Response.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
