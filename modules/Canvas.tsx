import { useEffect, useRef } from 'react';

// canvas is simple just takes a grid and renders it.
export function Canvas({
  size,
  grid,
  color = '#000',
  background = '#fff',
  className,
}: {
  size: number;
  grid: number[][];
  color?: string;
  background?: string;
  className?: string;
}) {
  const ref = useRef<null | HTMLCanvasElement>(null);

  useEffect(() => {
    // here we render the canvas
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // now we draw the grid
    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        ctx.fillStyle = cell === 0 ? background : color;
        ctx.fillRect(i * (size / 5), j * (size / 5), size / 5, size / 5);
      });
    });
  }, [size, grid, color, background]);

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      className={
        'shadow rounded-3xl overflow-hidden' +
        (className ? ' ' + className : '')
      }
    />
  );
}
