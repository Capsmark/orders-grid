import { connectWs, unSub } from '@/pages/api/socket';
import useExchangeStore from '@/stores/exchange-store';
import { FC, useEffect, useState } from 'react';

export const BTC: FC = () => {
  const [bTC, setBTC] = useState(0);
  const [balance, setBalance] = useState(0);

  const { btc, setBtc, availableToWithdraw } = useExchangeStore();

  useEffect(() => {
    connectWs(setBtc);

    return () => {
      unSub();
    };
  }, []);

  useEffect(() => {
    if (btc) {
      setBTC(+btc);
    }
    if (availableToWithdraw) {
      setBalance(+availableToWithdraw);
    }
  }, [btc, availableToWithdraw]);

  return (
    <div>
      <p>BTC Mark Price: {bTC?.toFixed(0)}$</p>
      <p>Balance: {balance?.toFixed(2)}$</p>
    </div>
  );
};
