import { BalanceResponse } from '@/types/api.types';
import { toast } from 'react-toastify';

const { RestClientV5 } = require('bybit-api');

const API_KEY = 'dKGtfNOCf9Jl1ChzFg';
const API_SECRET = 'K8lfltYmQf7o2WxXjeQZpJW0sv38GOnQJA1W';

const client = new RestClientV5({
  key: API_KEY,
  secret: API_SECRET,
  testnet: false,
  enable_time_sync: true,
});

export const placeOrders = (orders: TradeOrder[]) => {
  try {
    orders.forEach(async (o) => {
      const buyResult = await client.submitOrder(o);

      console.log('Order Result: ', buyResult);
      const isOk = buyResult.retMsg === 'OK';

      isOk
        ? toast.success('Success!')
        : toast.warn(buyResult.retMsg, { autoClose: false });
    });
  } catch (e: any) {
    console.error('request failed: ', e);
    toast.error(e?.retMsg, { autoClose: false });
  }
};

export const getAccountInfo = (setBalance: any) => {
  (async () => {
    try {
      client
        .getWalletBalance({
          accountType: 'CONTRACT',
        })
        .then(({ result: { list } }: BalanceResponse) => {
          const [{ coin }] = list;
          const [{ equity, walletBalance, availableToWithdraw }] = coin;

          console.log(list);

          setBalance(equity, walletBalance, availableToWithdraw);
        })
        .catch((error: any) => {
          console.error(error);
        });
    } catch (e) {
      console.error('request failed: ', e);
    }
  })();
};

export interface TradeOrder {
  category: string;
  symbol: string;
  orderType: string;
  qty: string;
  side: string;
  price: string;
  stopLoss: string;
  takeProfit: string;
  positionIdx: 1 | 2;
  orderLinkId: string;
}
