import { dollarConverter } from '@/helpers/converts.helper';
import { FC } from 'react';

interface DollarProps {
  amount: number;
  style?: string;
}

export const Dollar: FC<DollarProps> = ({ amount, style }) => (
  <span className={style ?? 'inline-block'}>{dollarConverter.format(amount)}</span>
);
