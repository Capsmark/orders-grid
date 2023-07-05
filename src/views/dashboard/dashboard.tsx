import Link from 'next/link';
import { FC } from 'react';

export const Dashboard: FC = () => {
  return (
    <div className='fixed top-0 left-0 flex flex-col items-center justify-between w-full h-full bg-gray-900 text-white'>
      <div className='flex flex-col items-center justify-center flex-grow'>
        <div className='p-4 mb-8 flex gap-4'>
          <div className='bg-gray-800 rounded-lg p-10 w-150'>
            <h1 className='text-5xl font-extrabold mb-6 text-center'>Total Balance:</h1>
            <div className='bg-white text-gray-900 rounded-lg p-4'>
              <span className='text-4xl font-bold text-center'>$1000</span>
            </div>
          </div>

          <div className='bg-gray-800 rounded-lg p-10 w-150'>
            <h2 className='text-5xl font-extrabold mb-6 text-center'>
              Unrealized Balance:
            </h2>
            <div className='bg-white text-gray-900 rounded-lg p-4'>
              <span className='text-4xl font-bold text-center'>$1000</span>
            </div>
          </div>
        </div>
      </div>

      <div className='mb-16'>
        <Link href='/order'>
          <button className='bg-orange-500 text-white rounded-full py-4 px-8 text-3xl font-bold'>
            Submit Order Grid
          </button>
        </Link>
      </div>
    </div>
  );
};
