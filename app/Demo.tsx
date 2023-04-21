import { InputHTMLAttributes, useState } from 'react';
import { useSlotMachine } from 'modules/useSlotMachine';
import { Explaination } from 'modules/Explaination';
import { Canvas } from 'modules/Canvas';
import { SparklesIcon } from 'modules/icons';

type OnChange = InputHTMLAttributes<HTMLInputElement>['onChange'];

function Input({
  value,
  onChange,
  className,
}: {
  className?: string;
  value: string;
  onChange: OnChange;
}) {
  return (
    <div>
      <input
        value={value}
        onChange={onChange}
        className={
          'px-2 py-3 w-full text-center rounded-xl shadow' +
          (className ? ' ' + className : '')
        }
        placeholder={'Enter your name'}
        maxLength={20}
      />
      <div className='text-xs flex justify-end pr-1'>{value.length}/20</div>
    </div>
  );
}

function DemoDesktop() {
  const [username, setUsername] = useState('');
  const { grid, rgb, meta } = useSlotMachine(username);

  return (
    <main className='flex items-center justify-between max-w-6xl mx-auto p-8 w-full gap-10'>
      <div>
        <div className='grid content-start pb-8'>
          <h1 className='text-4xl font-bold text-gray-700 mb-1'>
            The Slot Machine!
          </h1>
          <p className='text-xl text-gray-600 pb-4'>
            Based on an input, generate unique shape{' '}
            <SparklesIcon className='w-5 h-5 inline-block text-amber-400' />
          </p>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <Canvas size={400} grid={grid} color={rgb} />
      </div>
      <Explaination
        input={username}
        meta={meta}
        className='self-end p-5 pb-0'
      />
    </main>
  );
}

function DemoMobile() {
  const [username, setUsername] = useState('');
  const { grid, rgb, meta } = useSlotMachine(username);
  return (
    <main className='p-5 grid gap-8'>
      <div>
        <div className='flex items-start gap-4'>
          <Canvas size={100} grid={grid} color={rgb} className='shrink-0' />
          <div className='grid content-start'>
            <h1 className='text-2xl font-bold text-gray-700 mb-1'>
              The Slot Machine!
            </h1>
            <p className='text-lg text-gray-600'>
              Based on an input, generate unique shape{' '}
              <SparklesIcon className='w-5 h-5 inline-block text-amber-400' />
            </p>
          </div>
        </div>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='mt-2'
        />
      </div>
      <Explaination input={username} meta={meta} />
    </main>
  );
}

function Mobile({ children }: { children: any }) {
  return <div className='block md:hidden'>{children}</div>;
}

function Desktop({ children }: { children: any }) {
  return <div className='hidden md:block'>{children}</div>;
}

export function Demo() {
  return (
    <>
      <Desktop>
        <DemoDesktop />
      </Desktop>
      <Mobile>
        <DemoMobile />
      </Mobile>
      <div className='italic text-sm text-center'>
        made by{' '}
        <a
          className='text-blue-600 underline'
          rel='noopener noreferrer'
          href='https://github.com/5alidz'
          target='_blank'
        >
          @5alidz
        </a>
      </div>
    </>
  );
}
