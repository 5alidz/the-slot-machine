import { useMemo } from 'react';
import { useSha } from './useSha';

function hexToBinary(hex: string): string {
  let binary = '';
  for (let i = 0; i < hex.length; i++) {
    const bits = parseInt(hex[i], 16).toString(2).padStart(4, '0');
    binary += bits;
  }
  return binary;
}

function chunk(string: string, size: number) {
  const chunks = [];
  for (let i = 0; i < string.length; i += size) {
    chunks.push(string.slice(i, i + size));
  }
  return chunks;
}

function map(
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number
) {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function hexgroupToNumber(hexgroup: string) {
  return map(parseInt(hexgroup, 16), 0, 1048576, 0, 255);
}

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

type RuleEntry = {
  chunk: string;
  asInt: number;
  position: [number, number];
  grid: number[][];
};

const createRuleEntry = (
  binaryChunks: string[][],
  position: [number, number],
  grid: number[][]
): RuleEntry => {
  const [i, j] = position;
  const chunk = binaryChunks[i][j];
  return {
    chunk,
    asInt: parseInt(chunk, 2),
    position,
    grid,
  };
};

function evenRule(entry: RuleEntry) {
  return entry.asInt % 2 === 0 ? 0 : 1;
}

const x: Record<string, (grid: number[][], ...rest: any[]) => number[][]> = {
  none: (grid) => grid,
  flipVertical: (grid) => grid.slice().reverse(),
  flipHorizontal: (grid) => grid.map((row) => row.slice().reverse()),
  transpose: (grid) => grid[0].map((_, i) => grid.map((row) => row[i])),
  rotate90: (grid) =>
    grid[0].map((_, i) => grid.map((row) => row.reverse()[i])),
  rotate180: (grid) => grid.map((row) => row.reverse()).reverse(),
  swapColors: (grid: number[][]) =>
    grid.map((row) => row.map((cell) => (cell === 0 ? 1 : 0))),
  shiftLeft: (grid: number[][]) => grid.map((row) => [...row.slice(1), row[0]]),
  shiftRight: (grid: number[][]) =>
    grid.map((row) => [row[row.length - 1], ...row.slice(0, -1)]),
  shiftUp: (grid: number[][]) => {
    const topRow = grid[0];
    return grid.slice(1).concat([topRow]);
  },
  shiftDown: (grid: number[][]) => {
    const bottomRow = grid[grid.length - 1];
    return [bottomRow].concat(grid.slice(0, -1));
  },
  flipLowDensity: (grid: number[][]) => {
    const newGrid: number[][] = [];
    for (let i = 0; i < grid.length; i++) {
      const newRow: number[] = [];
      for (let j = 0; j < grid[i].length; j++) {
        const neighbors =
          (grid[i - 1]?.[j - 1] || 0) +
          (grid[i - 1]?.[j] || 0) +
          (grid[i - 1]?.[j + 1] || 0) +
          (grid[i][j - 1] || 0) +
          (grid[i][j + 1] || 0) +
          (grid[i + 1]?.[j - 1] || 0) +
          (grid[i + 1]?.[j] || 0) +
          (grid[i + 1]?.[j + 1] || 0);
        newRow.push(neighbors <= 2 ? 1 - grid[i][j] : grid[i][j]);
      }
      newGrid.push(newRow);
    }
    return newGrid;
  },
  horizontalMirror: (grid: number[][]) => {
    const newGrid = grid.map((row) => [...row]);
    const mid = Math.floor(newGrid[0].length / 2);
    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < mid; col++) {
        newGrid[row][newGrid[0].length - col - 1] = newGrid[row][col];
      }
    }
    return newGrid;
  },
  verticalMirror: (grid: number[][]) => {
    const newGrid = grid.map((row) => [...row]);
    const mid = Math.floor(newGrid.length / 2);
    for (let row = 0; row < mid; row++) {
      for (let col = 0; col < newGrid[0].length; col++) {
        newGrid[newGrid.length - row - 1][col] = newGrid[row][col];
      }
    }
    return newGrid;
  },
  cellularAutomaton: (grid: number[][]) => {
    const newGrid: number[][] = [];
    for (let i = 0; i < grid.length; i++) {
      const newRow: number[] = [];
      for (let j = 0; j < grid[i].length; j++) {
        const neighbors =
          (grid[i - 1]?.[j - 1] || 0) +
          (grid[i - 1]?.[j] || 0) +
          (grid[i - 1]?.[j + 1] || 0) +
          (grid[i][j - 1] || 0) +
          (grid[i][j + 1] || 0) +
          (grid[i + 1]?.[j - 1] || 0) +
          (grid[i + 1]?.[j] || 0) +
          (grid[i + 1]?.[j + 1] || 0);
        newRow.push(
          (grid[i][j] === 1 && (neighbors === 2 || neighbors === 3)) ||
            (grid[i][j] === 0 && neighbors === 3)
            ? 1
            : 0
        );
      }
      newGrid.push(newRow);
    }
    return newGrid;
  },
};

const presets: typeof x = {
  avatar(_grid) {
    let grid = x.rotate90(_grid);
    grid = x.shiftLeft(grid);
    grid = x.verticalMirror(grid);
    return grid;
  },
};
function transform(_grid: number[][]) {
  // this is to make it match the array
  return presets.avatar(_grid);
}

const DEFAULT_RULE = evenRule;
const DEFAULT_TRANSOFORM = transform;

export function useSlotMachine(
  input: string,
  f = DEFAULT_RULE,
  t = DEFAULT_TRANSOFORM
) {
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

    let grid: number[][] = [];
    for (let i = 0; i < binChunksChunks.length; i++) {
      grid[i] = [];
      for (let j = 0; j < binChunksChunks[i].length; j++) {
        const entry = createRuleEntry(binChunksChunks, [i, j], grid);
        grid[i][j] = f(entry);
      }
    }

    grid = t(grid);

    return {
      grid,
      rgb: rgb.css,
      meta: { hash, shapeSlice, bin, binChunks, binChunksChunks, rgb, grid },
    };
  }, [hash]);

  return api;
}
