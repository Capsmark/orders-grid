import { Dollar } from '@/components/dollar';
import RangeSelector from '@/components/range-selector';
import { dollarInputConverter, isNumber } from '@/helpers/converts.helper';
import useExchangeStore from '@/stores/exchange-store';
import useRangeSelectorStore from '@/stores/range-selector.store';
import { ChangeEvent, FC, useCallback, useMemo } from 'react';

export const AmountSelector: FC = () => {
  const { availableToWithdraw } = useExchangeStore();
  const { quantity, amount, onRangeChanges } = useRangeSelectorStore();

  const onAmountChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      if (value === '$') {
        onRangeChanges(0, 0);
      }

      const numericValue = value.replace(/,/g, '');
      const valueWithoutCommas = value.length > 1 ? numericValue.slice(1) : numericValue;
      const parsedValue = parseFloat(valueWithoutCommas);

      if (!Number.isNaN(parsedValue)) {
        onRangeChanges(parsedValue, (parsedValue * 100) / availableToWithdraw);
      }
    },
    [],
  );

  const formattedAmount = useMemo(() => {
    return amount !== undefined && !Number.isNaN(amount) && amount !== 0
      ? dollarInputConverter.format(amount)
      : '';
  }, [amount]);

  return (
    <div className='flex flex-col items-center justify-center gap-8'>
      <section className='flex flex-row items-center justify-center gap-2'>
        <label htmlFor='quantity' className='block text-white-700'>
          Amount :
        </label>

        <input
          type='text'
          id='amount'
          value={formattedAmount}
          onChange={onAmountChange}
          className='px-3 py-2 text-center border rounded border-white-300 w-36'
        />

        {isNumber(quantity) && (
          <p>
            <Dollar amount={amount / quantity} />
            <span> each</span>
          </p>
        )}
      </section>

      <div className='mr-1'>
        <RangeSelector />
      </div>
    </div>
  );
};
