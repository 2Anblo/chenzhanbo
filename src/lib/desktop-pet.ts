export const petAtlasSize = 1254;
export const petFrameWidth = petAtlasSize / 4;
export const petRows = {
  // Generated artwork has uneven row heights. Keep explicit source bounds
  // with transparent gutters rather than assuming a uniform four-row grid.
  idle: { top: 35, bottom: 350, columns: [0, 312, 624, 936, 1254] },
  walk: { top: 350, bottom: 655, columns: [16, 322, 634, 946, 1254] },
  rest: { top: 670, bottom: 895, columns: [16, 329, 640, 952, 1254] },
  happy: { top: 900, bottom: 1245, columns: [0, 310, 620, 936, 1254] },
};

export function getPetFrameStyle(mood: keyof typeof petRows, frame: number) {
  const row = petRows[mood];
  const scale = 96 / petFrameWidth;
  const left = row.columns[frame];
  const width = (row.columns[frame + 1] - left) * scale;
  return {
    left: (112 - width) / 2,
    width,
    height: (row.bottom - row.top) * scale,
    backgroundSize: `${petAtlasSize * scale}px ${petAtlasSize * scale}px`,
    backgroundPosition: `${-left * scale}px ${-row.top * scale}px`,
  };
}
