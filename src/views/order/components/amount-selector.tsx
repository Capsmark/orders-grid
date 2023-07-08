import RangeSelector from '@/components/range-selector';
import useExchangeStore from '@/stores/exchange-store';
import { FC } from 'react';

interface AmountProps {
  amount: number;
  setAmount: any;
  onAmountChange: any;
  quantity: number;
}

export const AmountSelector: FC<AmountProps> = ({
  amount,
  setAmount,
  onAmountChange,
  quantity,
}) => {
  const { availableToWithdraw } = useExchangeStore();

  return (
    <div className='flex flex-col justify-center items-center gap-8'>
      <section className='flex flex-row justify-center items-center gap-2'>
        <label htmlFor='quantity' className='block text-white-700'>
          Amount :
        </label>

        <input
          type='number'
          id='amount'
          value={amount}
          onChange={onAmountChange}
          className='border border-white-300 rounded  text-center px-3 py-2 w-36'
        />

        {!!quantity && !Number.isNaN(quantity) && (
          <p className='inline-block'>{`${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(amount / quantity)} each`}</p>
        )}
      </section>

      <div className='mr-1'>
        <RangeSelector setAmount={setAmount} balance={availableToWithdraw} />
      </div>
    </div>
  );
};
