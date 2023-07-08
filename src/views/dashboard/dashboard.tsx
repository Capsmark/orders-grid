import { Balance } from '@/components/balance';
import Link from 'next/link';
import { FC } from 'react';

export const Dashboard: FC = () => {
  return (
    <div className='fixed top-0 left-0 flex flex-col items-center justify-between w-full h-full bg-gray-900 text-white'>
      <div className='flex flex-col items-center justify-center flex-grow'>
        <Balance></Balance>
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
