import { BTC } from '@/components/btc';
import ToggleSwitch from '@/components/toggle-switch';
import { TradeOrder, placeOrders } from '@/pages/api/bybit';
import useGridStore from '@/stores/grid-store';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { AmountSelector } from './components/amount-selector';
import { OrderForm } from './components/order-form';
import { calculateAverage, generateBoundaries } from './order.helper';

export const Order: FC = () => {
  const symbol = 'BTCUSDT';
  const category = 'linear';
  const orderType = 'Limit';

  const { orders, setOrders } = useGridStore();

  const [isSell, setSell] = useState<boolean>(true);
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(0);
  const [isPercent, setPercent] = useState<boolean>(false);

  const [totalAverage, setTotalAverage] = useState<number>();

  const [totalLoss, setTotalLoss] = useState<number>(0);
  const [totalLossPercent, setTotalLossPercent] = useState<number>(0);

  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [totalProfitPercent, setTotalProfitPercent] = useState<number>(0);

  const [startingRange, setStartingRange] = useState<number>();
  const [endingRange, setEndingRange] = useState<number>();

  const [boundaries, setBoundaries] = useState<number[]>([]);

  const onQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const q = parseInt(event.target.value);

    if (q < 1) {
      return;
    }

    setQuantity(q);
  };

  const onAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+(+event.target.value).toFixed(2));
  };

  const onStartingRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStartingRange(parseInt(event.target.value));
  };

  const onEndingRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEndingRange(parseInt(event.target.value));
  };

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
    setTotalLoss(0);
    setTotalLossPercent(0);
    setTotalProfit(0);
    setTotalProfitPercent(0);

    [...orders].forEach(([boundary, { expectedLoss, expectedProfit }]) => {
      if (
        expectedLoss &&
        expectedProfit &&
        !Number.isNaN(expectedProfit.numeric) &&
        !Number.isNaN(expectedLoss.numeric)
      ) {
        setTotalProfit((perv) => perv + Math.abs(boundary - expectedProfit?.numeric));
        setTotalProfitPercent((perv) => perv + +expectedProfit?.percentage.slice(0, -1));

        setTotalLoss((perv) => perv + Math.abs(boundary - expectedLoss?.numeric));
        setTotalLossPercent((perv) => perv + +expectedLoss?.percentage.slice(0, -1));
      }
    });
  }, [orders]);

  // const onOrderBatch = async () => {
  //   const orderDTOs = [...orders.entries()].map(([price, { takeProfit, stopLoss }]) => {
  //     const orderObj = {
  //       category,
  //       symbol,
  //       orderType: 'Limit',
  //       side: isSell ? 'Sell' : 'Buy',
  //       qty: (amount / quantity / price).toFixed(5).toString(),
  //       price: price.toString(),
  //       stopLoss: stopLoss?.toString(),
  //       takeProfit: takeProfit?.toString(),
  //     } as TradeOrder;

  //     return orderObj;
  //   });

  //   await placeBatchOrders(orderDTOs);
  // };

  const onNormalOrder = async () => {
    const orderDTOs = [...orders.entries()].map(([price, { takeProfit, stopLoss }]) => {
      const orderObj = {
        category,
        symbol,
        orderType: 'Limit',
        side: isSell ? 'Sell' : 'Buy',
        qty: (amount / quantity / price).toFixed(5),
        price: price.toString(),
        stopLoss: stopLoss?.toString(),
        takeProfit: takeProfit?.toString(),
      } as TradeOrder;

      return orderObj;
    });

    await placeOrders(orderDTOs);
    setOrders(new Map());
    onReset();
  };

  return (
    <div className='p-6 h-full w-full flex flex-col grid-container'>
      <div className='self-end'>
        <BTC />
      </div>
      <div className='flex flex-row justify-between items-center self-start'>
        <section className='flex flex-row justify-center items-center gap-12'>
          <div className='flex flex-col justify-center items-center gap-6 self-baseline'>
            <div className='flex flex-row gap-4'>
              <p>Side: {isSell ? 'Sell' : 'Buy'}</p>
              <ToggleSwitch state={isSell} onChange={setSell} />
            </div>

            <div className='flex flex-row justify-center items-center gap-3 '>
              <label htmlFor='quantity' className='block text-white-700 mb-2'>
                Grid Quantity:
              </label>

              <input
                type='number'
                id='quantity'
                value={quantity}
                onChange={onQuantityChange}
                className='border border-white-300 rounded text-center py-2 mb-2 w-16'
              />
            </div>

            <section className='flex flex-row justify-start align-middle p-4  gap-2'>
              <p className='text-center mr-3 mt-1'>
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
            <div className='flex flex-row justify-center items-center gap-2'>
              <label htmlFor='range' className='block h-full text-white-700 text-center'>
                Range :
              </label>

              <input
                type='number'
                id='range'
                placeholder='From'
                value={startingRange ?? ''}
                onChange={onStartingRangeChange}
                className='border border-white-300 rounded px-3 py-2 w-32 text-center'
              />

              <p className='h-full'> - </p>

              <input
                type='number'
                id='second_range'
                placeholder='To'
                value={endingRange ?? ''}
                onChange={onEndingRangeChange}
                className='border border-white-300 rounded px-3 py-2  w-32 text-center'
              />
            </div>

            <div className='flex flex-col justify-center align-middle gap-3 ml-16'>
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

          <AmountSelector
            amount={amount}
            setAmount={setAmount}
            onAmountChange={onAmountChange}
            quantity={quantity}
          />
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

      <section className='flex flex-row items-center justify-around p-4 gap-4'>
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

        <div className='flex flex-row justify-center items-center gap-4'>
          <div>
            <p className={'text-green-500 hover:text-green-600 font-bold py-1 px-2'}>
              Profit: {((totalProfitPercent * amount) / quantity / 100).toFixed(2)}$
            </p>
            <p className={'text-green-500 hover:text-green-600 font-bold py-1 px-2'}>
              Profit Percent: {(totalProfitPercent / quantity).toFixed(2)}%
            </p>

            <p className={'text-red-500 hover:text-red-600 font-bold py-1 px-2'}>
              Loss: {((totalLossPercent * amount) / quantity / 100).toFixed(2)}$
            </p>
            <p className={'text-red-500 hover:text-red-600 font-bold py-1 px-2'}>
              Loss Percent: {(totalLossPercent / quantity).toFixed(2)}%
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
