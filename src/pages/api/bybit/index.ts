import { BalanceResponse } from '@/types/api.types';

const {
  InverseClient,
  LinearClient,
  InverseFuturesClient,
  SpotClientV3,
  UnifiedMarginClient,
  USDCOptionClient,
  USDCPerpetualClient,
  AccountAssetClient,
  CopyTradingClient,
  RestClientV5,
} = require('bybit-api');

interface restClientOptions {
  /** Your API key. Optional, if you plan on making private api calls */
  key?: string;

  /** Your API secret. Optional, if you plan on making private api calls */
  secret?: string;

  /** Set to `true` to connect to testnet. Uses the live environment by default. */
  testnet?: boolean;

  /** Override the max size of the request window (in ms) */
  recv_window?: number;

  /** Disabled by default. This can help on machines with consistent latency problems. */
  enable_time_sync?: boolean;

  /** How often to sync time drift with bybit servers */
  sync_interval_ms?: number | string;

  /** Default: false. If true, we'll throw errors if any params are undefined */
  strict_param_validation?: boolean;

  /**
   * Optionally override API protocol + domain
   * e.g baseUrl: 'https://api.bytick.com'
   **/
  baseUrl?: string;

  /** Default: true. whether to try and post-process request exceptions. */
  parse_exceptions?: boolean;
}

const API_KEY = 'dKGtfNOCf9Jl1ChzFg';
const API_SECRET = 'K8lfltYmQf7o2WxXjeQZpJW0sv38GOnQJA1W';
const useTestnet = false;

const client = new RestClientV5(
  {
    key: API_KEY,
    secret: API_SECRET,
    testnet: useTestnet,
    enable_time_sync: true,
  },
  // requestLibraryOptions
);

// For public-only API calls, simply don't provide a key & secret or set them to undefined
// const client = new RestClientV5({});

export const placeOrders = (orders: TradeOrder[]) => {
  (async () => {
    try {
      console.log({ orders });

      orders.forEach(async (o) => {
        const buyResult = await client.submitOrder(o);
        console.log('buyResult:', buyResult);
      });
    } catch (e) {
      console.error('request failed: ', e);
    }
  })();
};

export const placeBatchOrders = (orders: TradeOrder[]) => {
  (async () => {
    try {
      console.log({ orders });
      client
        .batchSubmitOrders('linear', orders)
        .then((response: any) => {
          console.log(response);
        })
        .catch((error: any) => {
          console.error(error);
        });
    } catch (e) {
      console.error('request failed: ', e);
    }
  })();
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

      // Trade USDT linear perps
      // const buyOrderResult = await client.submitOrder({
      //   category: 'linear',
      //   symbol: 'BTCUSDT',
      //   orderType: 'Limit',
      //   qty: '0.001',
      //   side: 'Buy',
      //   price: '10000',
      //   stopLoss: '9000',
      //   takeProfit: '12000',
      // });
      // console.log('buyOrderResult:', buyOrderResult);

      // const sellOrderResult = await client.submitOrder({
      //   category: 'linear',
      //   symbol: 'BTCUSDT',
      //   orderType: 'Limit',
      //   qty: '0.001',
      //   side: 'Sell',
      //   price: '60000',
      //   stopLoss: '70000',
      //   takeProfit: '50000',
      // });
      // console.log('sellOrderResult:', sellOrderResult);
    } catch (e) {
      console.error('request failed: ', e);
    }
  })();

  // .getAccountInfo()
  // .then((result: any) => {
  //   console.log('getAccountInfo result: ', result);
  // })
  // .catch((err: any) => {
  //   console.error('getAccountInfo error: ', err);
  // });
};

// client.getOrderbook({ category: 'linear', symbol: 'BTCUSD' })
//   .then(result => {
//     console.log("getOrderBook result: ", result);
//   })
//   .catch(err => {
//     console.error("getOrderBook error: ", err);
//   });
export interface TradeOrder {
  category: string;
  symbol: string;
  orderType: string;
  qty: string;
  side: string;
  price: string;
  stopLoss: string;
  takeProfit: string;
}
