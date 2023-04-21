import { useMemo } from 'react';
import { useSha } from './useSha1';
import { chunk, hexToBinary, hexgroupToNumber } from './utils';

const parseParts = (parts: string[]) => {};

const createRGB = (rSlice: string, gSlice: string, bSlice: string) => {
  const r = hexgroupToNumber(rSlice);
  const g = hexgroupToNumber(gSlice);
  const b = hexgroupToNumber(bSlice);

  return {
    raw: [rSlice, gSlice, bSlice],
    rgb: [r, g, b],
    css: `rgb(${r}, ${g}, ${b})`,
    r,
    g,
    b,
  };
};

export function useSlotMachine(input: string) {
  const hash = useSha(input);

  const api = useMemo(() => {
    const rgb = createRGB(
      hash.slice(0, 5),
      hash.slice(5, 10),
      hash.slice(10, 15)
    );
    const shapeSlice = hash.slice(15);
    const bin = hexToBinary(shapeSlice);
    const binChunks = chunk(bin, bin.length / 5);
    const binChunksChunks = binChunks.map((_chunk) =>
      chunk(_chunk, _chunk.length / 5)
    );

    const grid: number[][] = [];
    for (let i = 0; i < binChunksChunks.length; i++) {
      grid[i] = [];
      for (let j = 0; j < binChunksChunks[i].length; j++) {
        const binToInt = parseInt(binChunksChunks[i][j], 2);
        grid[i][j] = binToInt % 2 === 0 ? 0 : 1;
      }
    }

    return {
      grid,
      rgb: rgb.css,
      meta: { hash, shapeSlice, bin, binChunks, binChunksChunks, rgb, grid },
    };
  }, [hash]);

  return api;
}
