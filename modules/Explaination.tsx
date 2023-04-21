import { useSlotMachine } from './useSlotMachine';

function Code({ children }: { children: any }) {
  return (
    <pre className='bg-white/90 p-2 md:p-4 rounded-lg md:rounded-2xl font-mono text-xs md:text-sm'>
      {children}
    </pre>
  );
}

const colorMap: Record<number, string> = {
  0: 'bg-rose-100 text-rose-600',
  1: 'bg-emerald-100 text-emerald-600',
  2: 'bg-blue-100 text-blue-600',
};

function Hash({ input, hash }: { input: string; hash: string }) {
  return (
    <Code>
      sha1({'\n\t'}&quot;{input}&quot;{'\n'}) {'=>'}
      <span className='pl-2'>{hash}</span>
    </Code>
  );
}

function HashSplit({
  rawRGB,
  shapeSlice,
}: {
  rawRGB: string[];
  shapeSlice: string;
}) {
  return (
    <div className='flex gap-px text-sm font-mono overflow-hidden text-ellipsis py-1'>
      {rawRGB.map((slice, i) => {
        return (
          <span key={i} className={'p-1 rounded ' + colorMap[i]}>
            {slice}
          </span>
        );
      })}
      <span className='p-1 bg-purple-100 text-purple-600 overflow-hidden text-ellipsis w-full rounded'>
        {shapeSlice}
      </span>
    </div>
  );
}

function HashSplitToBinary({
  shapeSlice,
  binChunksChunks,
}: {
  shapeSlice: string;
  binChunksChunks: string[][];
}) {
  return (
    <Code>
      binary({'\n\t'}&quot;{shapeSlice}&quot;{'\n'}) {'=> ['}
      {binChunksChunks.map((_chunkChunks, i) => {
        return (
          <span key={i} className='flex gap-2 pl-4'>
            {_chunkChunks.map((_chunk, j) => (
              <span key={i.toString() + j.toString()}>{_chunk}</span>
            ))}
            {'\n'}
          </span>
        );
      })}
      {']'}
    </Code>
  );
}

function BinaryToGridValues({
  grid,
  binChunksChunks,
}: {
  binChunksChunks: string[][];
  grid: number[][];
}) {
  const chunkLength = binChunksChunks[0][0].length;
  return (
    <Code>
      transform([{'\n'}
      {binChunksChunks.map((_chunkChunks, i) => {
        return (
          <span key={i} className='flex gap-2 pl-4'>
            {_chunkChunks.map((_chunk, j) => (
              <span key={i.toString() + j.toString()}>{_chunk}</span>
            ))}
            {'\n'}
          </span>
        );
      })}
      ]) {'=> ['}
      {grid.map((row, i) => {
        return (
          <div key={JSON.stringify(row) + i} className='flex gap-2 pl-4'>
            {row.map((cell, j) => {
              return (
                <span
                  key={JSON.stringify(cell) + j}
                  style={{ minWidth: `${chunkLength}ch` }}
                  className='text-center'
                >
                  {cell}
                </span>
              );
            })}
          </div>
        );
      })}
      {']'}
    </Code>
  );
}

export function Explaination({
  input,
  meta,
  className,
}: {
  input: string;
  meta: ReturnType<typeof useSlotMachine>['meta'];
  className?: string;
}) {
  return (
    <div className={'w-full grid gap-1 ' + (className ? className : '')}>
      <Hash input={input} hash={meta.hash} />
      <HashSplit rawRGB={meta.rgb.raw} shapeSlice={meta.shapeSlice} />
      <HashSplitToBinary
        binChunksChunks={meta.binChunksChunks}
        shapeSlice={meta.shapeSlice}
      />
      <BinaryToGridValues
        binChunksChunks={meta.binChunksChunks}
        grid={meta.grid}
      />
    </div>
  );
}
