import assert from 'node:assert/strict';
import sharp from 'sharp';
import { petAtlasSize, petRows } from '../src/lib/desktop-pet';

// Check the actual source strips rendered by DesktopPet, including every frame.
// Clear gutters catch clipped paws and neighboring sprites in either direction.
const { data, info } = await sharp('public/pet/calico-atlas.png').ensureAlpha().raw()
  .toBuffer({ resolveWithObject: true });
assert.equal(info.width, petAtlasSize);
assert.equal(info.height, petAtlasSize);
const failures: string[] = [];
for (const [mood, rect] of Object.entries(petRows)) {
  for (let frame = 0; frame < 4; frame++) {
    let edgePixels = 0;
    let bodyPixels = 0;
    for (let y = Math.ceil(rect.top); y < Math.floor(rect.bottom); y++) {
      for (let x = rect.columns[frame]; x < rect.columns[frame + 1]; x++) {
        if (data[(y * info.width + x) * 4 + 3] <= 200) continue;
        bodyPixels++;
        if (y < rect.top + 4 || y >= rect.bottom - 4 ||
            x < rect.columns[frame] + 4 || x >= rect.columns[frame + 1] - 4) edgePixels++;
      }
    }
    if (edgePixels || bodyPixels < 1000) {
      failures.push(`${mood}[${frame}]: ${edgePixels} opaque pixels in gutters, ${bodyPixels} body pixels`);
    }
  }
}
assert.deepEqual(failures, [], failures.join('\n'));
console.log('PASS: all 16 pet frames contain a cat and clear gutters on all four sides.');
