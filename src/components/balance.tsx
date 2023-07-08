'use client';

import { getAccountInfo } from '@/pages/api/bybit';
import { connectWs, unSub } from '@/pages/api/socket';
import useExchangeStore from '@/stores/exchange-store';
import { useEffect, useState } from 'react';

export const Balance = () => {
  const [BTC, setBTC] = useState(0);
  const [tBalance, setTBalance] = useState(0);
  const [atw, setAWT] = useState(0);
  const [equityS, setEquity] = useState(0);

  const { setBtc, setBalance, walletBalance, equity, availableToWithdraw, btc } =
    useExchangeStore();

  useEffect(() => {
    getAccountInfo(setBalance);
    connectWs(setBtc);

    return () => {
      unSub();
    };
  }, []);

  useEffect(() => {
    setEquity(equity);
    setBTC(btc);
    setTBalance(walletBalance);
    setAWT(availableToWithdraw);
  }, [btc, equity, walletBalance, availableToWithdraw]);

  return (
    <>
      <div className='p-4 mb-8 flex gap-4'>
        <div className='bg-gray-800 rounded-lg p-10 w-150'>
          <h1 className='text-5xl font-extrabold mb-6 text-center'>Total Balance:</h1>
          <div className='bg-white text-gray-900 rounded-lg p-4'>
            <span className='text-4xl font-bold text-center'>
              ${Number(tBalance).toFixed(2)}
            </span>
          </div>
        </div>

        <div className='bg-gray-800 rounded-lg p-10 w-150'>
          <h2 className='text-5xl font-extrabold mb-6 text-center'>
            Unrealized Balance:
          </h2>
          <div className='bg-white text-gray-900 rounded-lg p-4'>
            <span className='text-4xl font-bold text-center'>
              ${Number(equityS).toFixed(2)}
            </span>
          </div>
        </div>

        <div className='bg-gray-800 rounded-lg p-10 w-150'>
          <h2 className='text-5xl font-extrabold mb-6 text-center'>
            Available to withdraw:
          </h2>
          <div className='bg-white text-gray-900 rounded-lg p-4'>
            <span className='text-4xl font-bold text-center'>
              ${Number(atw).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className='bg-gray-800 rounded-lg p-10 w-150'>
          <h2 className='text-5xl font-extrabold mb-6 text-center'>BTC:</h2>
          <div className='bg-white text-gray-900 rounded-lg p-4'>
            <span className='text-4xl font-bold text-center'>
              ${Number(BTC).toFixed(0)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
