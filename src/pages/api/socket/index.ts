import { WebsocketClient } from 'bybit-api';

const wsClient = new WebsocketClient({
  market: 'v5',
});

export const connectWs = (setBtc: any) => {
  wsClient.on('update', (data: any) => {
    console.log('raw message received ', data.data.markPrice);
    if (data.data.markPrice) {
      setBtc(data.data.markPrice);
    }
  });

  wsClient.subscribeV5('tickers.BTCUSDT', 'linear');
};

export const unSub = () => {
  wsClient.unsubscribeV5('tickers.BTCUSDT', 'linear');
};
