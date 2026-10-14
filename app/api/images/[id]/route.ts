import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { uploadedImages } from '@/lib/db/schema';

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return new Response(null, { status: 404 });
  }
  try {
    const [image] = await db.select({ data: uploadedImages.data }).from(uploadedImages).where(eq(uploadedImages.id, id)).limit(1);
    if (!image) return new Response(null, { status: 404 });
    return new Response(new Uint8Array(Buffer.from(image.data, 'base64')), {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response(null, { status: 503 });
  }
}
