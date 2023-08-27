import { BTC } from '@/components/btc';
import ReactModal from 'react-modal';

import { Dollar } from '@/components/dollar';
import ToggleSwitch from '@/components/toggle-switch';
import { dollarInputConverter } from '@/helpers/converts.helper';
import { TradeOrder } from '@/pages/api/bybit';
import useGridStore from '@/stores/grid-store';
import useRangeSelectorStore from '@/stores/range-selector.store';
import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from 'react';
import { AmountSelector } from './components/amount-selector';
import { OrderForm } from './components/order-form';
import { calculateAverage, generateBoundaries } from './order.helper';

export const Order: FC = () => {
  const symbol = 'BTCUSDT';
  const category = 'linear';
  const orderType = 'Limit';

  const { orders, setOrders } = useGridStore();
  const { amount, quantity, setQuantity, setAmount } = useRangeSelectorStore();

  const [isSell, setSell] = useState<boolean>(true);
  const [isPercent, setPercent] = useState<boolean>(false);

  const [totalAverage, setTotalAverage] = useState<number>();

  const [totalLossPercent, setTotalLossPercent] = useState<number>(0);
  const [totalProfitPercent, setTotalProfitPercent] = useState<number>(0);

  const [startingRange, setStartingRange] = useState<number>();
  const [endingRange, setEndingRange] = useState<number>();

  const [boundaries, setBoundaries] = useState<number[]>([]);

  const onQuantityChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    const q = +value.replace(/,/g, '');

    if (q < 1) {
      return;
    }

    setQuantity(q);
  };

  const onStartingRangeChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    // move this logic to a helper func -> inputValueConverter
    if (value === '$') {
      setStartingRange(0);
    }

    const numericValue = value.replace(/,/g, '');
    const valueWithoutCommas = value.length > 1 ? numericValue.slice(1) : numericValue;
    const parsedValue = parseFloat(valueWithoutCommas);

    if (!Number.isNaN(parsedValue)) {
      setStartingRange(parsedValue);
    }
  };

  const formattedStartingRange = useMemo(() => {
    return startingRange !== undefined &&
      !Number.isNaN(startingRange) &&
      startingRange !== 0
      ? dollarInputConverter.format(startingRange)
      : '';
  }, [startingRange]);

  const onEndingRangeChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    if (value === '$') {
      setEndingRange(0);
    }

    const numericValue = value.replace(/,/g, '');
    const valueWithoutCommas = value.length > 1 ? numericValue.slice(1) : numericValue;
    const parsedValue = parseFloat(valueWithoutCommas);

    if (!Number.isNaN(parsedValue)) {
      setEndingRange(parsedValue);
    }
  };

  const formattedEndingRange = useMemo(() => {
    return endingRange !== undefined && !Number.isNaN(endingRange) && endingRange !== 0
      ? dollarInputConverter.format(endingRange)
      : '';
  }, [endingRange]);

  const onReset = () => {
    setAmount(0);
    setStartingRange(0);
    setEndingRange(0);
    setQuantity(1);
  };

  useEffect(() => {
    setBoundaries(generateBoundaries(quantity, endingRange, startingRange));
    setOrders(new Map());
  }, [quantity, startingRange, endingRange]);

  useEffect(() => {
    setTotalAverage(calculateAverage(amount, boundaries));
  }, [amount, quantity, startingRange, endingRange, boundaries]);

  useEffect(() => {
    setTotalLossPercent(0);
    setTotalProfitPercent(0);

    [...orders].forEach(([, { expectedLoss, expectedProfit }]) => {
      if (
        expectedLoss &&
        expectedProfit &&
        !Number.isNaN(expectedProfit.numeric) &&
        !Number.isNaN(expectedLoss.numeric)
      ) {
        setTotalProfitPercent((perv) => perv + +expectedProfit?.percentage.slice(0, -1));
        setTotalLossPercent((perv) => perv + +expectedLoss?.percentage.slice(0, -1));
      }
    });
  }, [orders]);

  const onNormalOrder = async () => {
    console.log('mapping the orders and then opening the modal');
    mappedOrders.current = [...orders.entries()].map(
      ([price, { takeProfit, stopLoss }], index) =>
        ({
          category,
          symbol,
          orderType,
          side: isSell ? 'Sell' : 'Buy',
          qty: (amount / quantity / price).toFixed(5),
          price: price.toString(),
          stopLoss: stopLoss?.toString(),
          takeProfit: takeProfit?.toString(),
          positionIdx: isSell ? 2 : 1,
          orderLinkId: Math.random() * 100 + 10 + 'cap-order-x1' + index,
        } as TradeOrder),
    );

    setOpen(true);

    // await placeOrders(mappedOrders.current);
    // setOrders(new Map());
    // onReset();
  };

  const [isOpen, setOpen] = useState<boolean>(false);

  const mappedOrders = useRef<TradeOrder[]>([]);

  return (
    <div className='flex flex-col w-full h-full p-6 grid-container'>
      <div className='self-end'>
        <BTC />
      </div>
      <div className='flex flex-row items-center self-start justify-between'>
        <section className='flex flex-row items-center justify-center gap-12'>
          <div className='flex flex-col items-center justify-center gap-6 self-baseline'>
            <div className='flex flex-row gap-4'>
              <p>Side: {isSell ? 'Sell' : 'Buy'}</p>
              <ToggleSwitch state={isSell} onChange={setSell} />
            </div>

            <div className='flex flex-row items-center justify-center gap-3 '>
              <label htmlFor='quantity' className='block mb-2 text-white-700'>
                Grid Quantity:
              </label>

              <input
                type='number'
                id='quantity'
                value={quantity}
                onChange={onQuantityChange}
                className='w-16 py-2 mb-2 text-center border rounded border-white-300'
              />
            </div>

            <section className='flex flex-row justify-start gap-2 p-4 align-middle'>
              <p className='mt-1 mr-3 text-center'>
                TP/SL: {isPercent ? 'Percentage' : 'Numerical'}
              </p>
              <ToggleSwitch
                activeColorClass='bg-blue-500'
                defaultColorClass='bg-gray-500'
                state={isPercent}
                onChange={setPercent}
              />{' '}
            </section>
          </div>

          <section
            className={`flex flex-col justify-center items-center gap-4 ${
              !!boundaries?.length && !Number.isNaN(totalAverage) ? 'self-baseline' : ''
            }`}
          >
            <div className='flex flex-row items-center justify-center gap-2'>
              <label htmlFor='range' className='block h-full text-center text-white-700'>
                Range :
              </label>

              <input
                type='text'
                id='range'
                placeholder='From'
                value={formattedStartingRange}
                onChange={onStartingRangeChange}
                className='w-32 px-3 py-2 text-center border rounded border-white-300'
              />

              <p className='h-full'> - </p>

              <input
                type='text'
                id='second_range'
                placeholder='To'
                value={formattedEndingRange}
                onChange={onEndingRangeChange}
                className='w-32 px-3 py-2 text-center border rounded border-white-300'
              />
            </div>

            <div className='flex flex-col justify-center gap-3 ml-16 align-middle'>
              {!!boundaries?.length && (
                <p id='boundaries' className='text-center'>
                  Boundaries:{' ['}
                  {boundaries.map(
                    (b, index) => `${b}${index + 1 === boundaries.length ? '' : ', '}`,
                  )}
                  {']'}
                </p>
              )}

              {!Number.isNaN(totalAverage) && (
                <p className='inline-block text-center'>
                  Average: {totalAverage?.toFixed(2)}
                </p>
              )}
            </div>
          </section>

          <AmountSelector />
        </section>
      </div>

      <div>
        {quantity > 0 && (
          <div className='flex flex-row'>
            {boundaries.map((boundary, index) => (
              <OrderForm
                key={index}
                index={index}
                isPercent={isPercent}
                isInvalid={quantity <= 0}
                boundary={boundary}
                isSale={isSell}
              />
            ))}
          </div>
        )}
      </div>

      <section className='flex flex-row items-center justify-around gap-4 p-4'>
        <div className='flex flex-row items-center justify-center gap-2'>
          <button
            type='submit'
            className={`${
              !isSell ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
            }  text-white font-bold py-2 px-4 w-48 rounded`}
            onClick={onNormalOrder}
          >
            {isSell ? 'Sell' : 'Buy'}
          </button>
        </div>

        <div className='flex flex-row items-center justify-center gap-4'>
          <div>
            <p className={'text-green-500 hover:text-green-600 font-bold py-1 px-2'}>
              Profit: {<Dollar amount={(totalProfitPercent * amount) / quantity / 100} />}
            </p>
            <p className={'text-green-500 hover:text-green-600 font-bold py-1 px-2'}>
              Profit Percent: {(totalProfitPercent / quantity).toFixed(2)}%
            </p>

            <p className={'text-red-500 hover:text-red-600 font-bold py-1 px-2'}>
              Loss: {<Dollar amount={(totalLossPercent * amount) / quantity / 100} />}
            </p>
            <p className={'text-red-500 hover:text-red-600 font-bold py-1 px-2'}>
              Loss Percent: {(totalLossPercent / quantity).toFixed(2)}%
            </p>
          </div>
        </div>
      </section>

      <ReactModal isOpen={isOpen}>
        <div className='flex flex-col justify-center w-full h-full align-middle gap-10'>
          <div className='flex flex-row justify-center align-middle gap-10'>
            {mappedOrders.current.map(
              (
                { orderType, category, price, qty, side, stopLoss, takeProfit, symbol },
                index,
              ) => (
                <div key={index}>
                  <p className='font-bold'>Order {`#${index + 1}:`}</p>
                  <br></br>
                  <p>
                    TP:
                    {` ${takeProfit} (${Math.abs(
                      ((+takeProfit - +price) * 100) / +price,
                    )}%)`}
                  </p>
                  <p>
                    SL:
                    {` ${stopLoss} (${Math.abs(((+stopLoss - +price) * 100) / +price)}%)`}
                  </p>
                  <p>Symbol: {symbol}</p>
                  <p>Category: {category}</p>
                  <p>Price: {price}</p>
                  <p>Quantity: {qty}</p>
                  <p>Order Type: {orderType}</p>
                  <p>
                    Side:
                    <span
                      className={`${side !== 'Sell' ? 'text-green-500' : 'text-red-600'}`}
                    >
                      {` ${side}`}
                    </span>
                  </p>
                </div>
              ),
            )}
          </div>

          <div className='w-full flex flex-row justify-center align-middle'>
            <button
              className='w-48 px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600'
              onClick={() => setOpen(false)}
            >
              Confirm
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};
