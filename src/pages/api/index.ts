import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  TestCase().then(() => {
    res.status(200).json({ message: 'Hello from the backend API!' });
  });
}

import axios, { AxiosRequestConfig } from 'axios';
import crypto from 'crypto';

const url = 'https://api.bybit.com';
const apiKey = 'dKGtfNOCf9Jl1ChzFg';
const secret = 'K8lfltYmQf7o2WxXjeQZpJW0sv38GOnQJA1W';
const recvWindow = 10000;
const d = new Date();
const timestamp = Date.UTC(d.getUTCFullYear(), d.getUTCMonth()).toString();

function getSignature(parameters: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(timestamp + apiKey + recvWindow + parameters)
    .digest('hex');
}

async function http_request(
  endpoint: string,
  method: string,
  data: string,
  info: string,
): Promise<void> {
  const sign = getSignature(data, secret);
  let fullendpoint: string;

  if (method === 'POST') {
    fullendpoint = url + endpoint;
  } else {
    fullendpoint = url + endpoint + '?' + data;
    data = '';
  }

  const config: AxiosRequestConfig = {
    method: method,
    url: fullendpoint,
    headers: {
      'X-BAPI-SIGN-TYPE': '2',
      'X-BAPI-SIGN': sign,
      'X-BAPI-API-KEY': apiKey,
      'X-BAPI-TIMESTAMP': timestamp,
      'X-BAPI-RECV-WINDOW': '5000',
      'Content-Type': 'application/json; charset=utf-8',
    },
    data: data,
  };

  console.log(info + ' Calling....');
  try {
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.log(error);
  }
}

// Create Order
export async function TestCase(): Promise<void> {
  let endpoint = '/v5/order/create';
  const orderLinkId = crypto.randomBytes(16).toString('hex');

  let data =
    '{"category":"linear","symbol": "BTCUSDT","side": "Buy","orderType": "Limit","qty": "0.001","price": "10000","takeProfit": "12000", "stopLoss": "9000","timeInForce": "GTC","orderLinkId": "' +
    orderLinkId +
    '"}';
  await http_request(endpoint, 'POST', data, 'Create');

  // Get unfilled Order List
  endpoint = '/v5/order/realtime';
  data = 'category=linear&settleCoin=USDT';
  await http_request(endpoint, 'GET', data, 'Order List');

  // Cancel order
  // endpoint = '/v5/order/cancel';
  // data = '{"category":"linear","symbol": "BTCUSDT","orderLinkId": "' + orderLinkId + '"}';
  // await http_request(endpoint, 'POST', data, 'Cancel');
}

export async function submitOrder(
  side: 'Buy' | 'Sell',
  qty: string,
  price: string,
  takeProfit: string,
  stopLoss: string,
): Promise<void> {
  let endpoint = '/v5/order/create';
  const orderLinkId = crypto.randomBytes(16).toString('hex');

  let data = `{"category":"linear","symbol": "BTCUSDT","side": ${side},"orderType": Limit,"qty": ${qty},"price": ${price},"takeProfit": ${takeProfit}, "stopLoss": ${stopLoss},"timeInForce": "GTC","orderLinkId": ${orderLinkId}}`;
  await http_request(endpoint, 'POST', data, 'Create');
}

export interface OrderInput {
  side: 'Buy' | 'Sell';
  qty: string;
  price: string;
  takeProfit: string;
  stopLoss: string;
}

export function getOrdersArray(ordersDTO: OrderInput[]): string[] {
  return ordersDTO.map(({ side, qty, price, takeProfit, stopLoss }) => {
    return `{"category":"linear","symbol": "BTCUSDT","side": ${side},"orderType": Limit,"qty": ${qty},"price": ${price},"takeProfit": ${takeProfit}, "stopLoss": ${stopLoss},"timeInForce": "GTC"}`;
  });
}

export async function createOrderBatch(ordersDTO: OrderInput[]) {
  let endpoint = '/v5/order/create-batch';

  // const requests = getOrdersArray(ordersDTO);
  // const data = `{"category":"linear","request": [${requests.join(',')}]}`;
  const data = {
    category: 'linear',
    request: ordersDTO,
  };
  console.log(data);

  await http_request(endpoint, 'POST', JSON.stringify(data), 'Create Batch');
}

// Create, List and Cancel Orders
// TestCase();
