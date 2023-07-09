import useExchangeStore from '@/stores/exchange-store';
import useRangeSelectorStore from '@/stores/range-selector.store';
import { FC } from 'react';

const RangeSelector: FC = () => {
  const { availableToWithdraw } = useExchangeStore();
  const { percentage, onRangeChanges } = useRangeSelectorStore();

  const onPercentageChange = ({ target: { value } }: any) => {
    const numericValue = +value.replace(/,/g, '');
    onRangeChanges(
      +((availableToWithdraw * numericValue) / 100).toFixed(2),
      numericValue,
    );
  };

  return (
    <div className='flex flex-col items-start justify-center w-64'>
      <input
        type='range'
        min='0'
        max='100'
        step='5'
        value={percentage}
        onChange={onPercentageChange}
        className='w-full h-2 bg-gray-200 rounded-md appearance-none focus:outline-none focus:bg-indigo-500'
      />
      <div className='flex justify-between w-full mt-2'>
        <span className='text-xs text-gray-600'>0%</span>

        <div className='self-center mt-2'>
          <span className='text-sm font-bold text-indigo-500'>
            {percentage.toFixed()}%
          </span>
        </div>

        <span className='text-xs text-gray-600'>100%</span>
      </div>
    </div>
  );
};

export default RangeSelector;
