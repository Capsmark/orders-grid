import ToggleSwitch from '@/components/toggle-switch';
import useGridStore from '@/stores/grid-store';
import { ChangeEvent, FC, useEffect, useState } from 'react';
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
    setAmount(parseInt(event.target.value));
  };

  const onStartingRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStartingRange(parseInt(event.target.value));
  };

  const onEndingRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEndingRange(parseInt(event.target.value));
  };

  useEffect(() => {
    setBoundaries(generateBoundaries(quantity, endingRange, startingRange));
    setOrders(new Map());
  }, [amount, quantity, startingRange, endingRange]);

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

  return (
    <div className='p-6 grid-container'>
      <div className='p-4 flex flex-col justify-start items-start'>
        <section className='flex flex-row justify-center items-center mb-2 gap-2'>
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

          <label htmlFor='quantity' className='block text-white-700 ml-12 mb-2'>
            Amount :
          </label>

          <input
            type='number'
            id='amount'
            value={amount}
            onChange={onAmountChange}
            className='border border-white-300 rounded  text-center px-3 py-2 mb-2 w-36'
          />

          {!!quantity && !Number.isNaN(quantity) && (
            <p className='inline-block pl-4'>{`${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(amount / quantity)} each`}</p>
          )}
        </section>

        <section className='flex flex-row justify-center items-center mb-2 gap-2'>
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

          {boundaries?.length && (
            <p className='ml-10'>
              Boundaries:{' ['}
              {boundaries.map(
                (b, index) => `${b}${index + 1 === boundaries.length ? '' : ', '}`,
              )}
              {']'}
            </p>
          )}

          {!Number.isNaN(totalAverage) && (
            <p className='inline-block pl-4'>Average: {totalAverage}</p>
          )}
        </section>
      </div>

      <section className='flex flex-row justify-start align-middle p-4  gap-2'>
        <p className='text-center mr-3 mt-1'>
          TP/SL Input type: {isPercent ? 'Percentage' : 'Numerical'}
        </p>
        <ToggleSwitch
          activeColorClass='bg-blue-500'
          defaultColorClass='bg-gray-500'
          state={isPercent}
          onChange={setPercent}
        />{' '}
      </section>

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

      <section className='flex flex-row items-center justify-start p-4 gap-4'>
        <button
          type='submit'
          className={`${
            !isSell ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          }  text-white font-bold py-2 px-4 rounded`}
        >
          {isSell ? 'Sell' : 'Buy'}
        </button>

        <ToggleSwitch state={isSell} onChange={setSell} />

        <div className='flex flex-row justify-center items-center gap-4 pl-4'>
          <div className='h-full flex flex-row justify-center align-middle'>
            <p>Over All:</p>
          </div>

          <div>
            <p className={'text-green-500 hover:text-green-600 font-bold py-1 px-2'}>
              Profit: {(totalProfitPercent * amount) / quantity / 100}$
            </p>
            <p className={'text-green-500 hover:text-green-600 font-bold py-1 px-2'}>
              Profit Percent: {totalProfitPercent / quantity}%
            </p>

            <p className={'text-red-500 hover:text-red-600 font-bold py-1 px-2'}>
              Loss: {(totalLossPercent * amount) / quantity / 100}$
            </p>
            <p className={'text-red-500 hover:text-red-600 font-bold py-1 px-2'}>
              Loss Percent: {totalLossPercent / quantity}%
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
