import useGridStore from '@/stores/grid-store';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  calculateLossValue,
  calculatePercent,
  calculateProfitValue,
} from '../order.helper';
import { SLTPFormInput } from './sltp-form-input';

interface OrderParameters {
  takeProfit: string;
  stopLoss: string;
}

export const OrderForm: React.FC<{
  isInvalid: boolean;
  boundary: number;
  isSale: boolean;
  isPercent: boolean;
  index: number;
}> = ({ isInvalid, boundary, isSale: isSell, isPercent, index }) => {
  const [isTPInvalid, setTPInvalid] = useState<boolean>(false);
  const [tPPercent, setTPPercent] = useState<string>('0%');
  const [tPNumber, setTPNumber] = useState<number>(0);

  const [isSLInvalid, setSLInvalid] = useState<boolean>(false);
  const [sLPercent, setSLPercent] = useState<string>('0%');
  const [sLNumber, setSLNumber] = useState<number>(0);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<OrderParameters>();
  const tp = watch('takeProfit');
  const sl = watch('stopLoss');

  const { orders, setOrders } = useGridStore();

  // Sets the isValid of TP
  useEffect(() => {
    const isNotValid =
      tPNumber === null ||
      tPNumber === undefined ||
      Number.isNaN(tPNumber) ||
      tPNumber === 0;

    if (isNotValid) {
      return setTPInvalid(true);
    }

    const isMoreThanBoundary = tPNumber > boundary;
    setTPInvalid(isSell ? isMoreThanBoundary : !isMoreThanBoundary);
  }, [boundary, isSell, isPercent, tPNumber]);

  // Sets the Percent or Number of TP
  useEffect(() => {
    if (isPercent) {
      const tpVal = isSell
        ? calculateLossValue(+tp, boundary)
        : calculateProfitValue(+tp, boundary);
      setTPNumber(tpVal);
      setTPPercent(tp + '%');
      return;
    }

    if (!isPercent) {
      setTPNumber(+tp);
      setTPPercent(calculatePercent(+tp, boundary, isSell));
      return;
    }
  }, [boundary, isSell, tp, isPercent]);

  // Sets the Valid of SL
  useEffect(() => {
    const isNotValid =
      sLNumber === null ||
      sLNumber === undefined ||
      Number.isNaN(sLNumber) ||
      sLNumber === 0;

    if (isNotValid) {
      return setSLInvalid(true);
    }

    const isMoreThanBoundary = sLNumber > boundary;
    setSLInvalid(isSell ? !isMoreThanBoundary : isMoreThanBoundary);
  }, [boundary, isSell, isPercent, sLNumber]);

  // Sets the Percent or Number of SL
  useEffect(() => {
    if (isPercent) {
      const slVal = isSell
        ? calculateProfitValue(+sl, boundary)
        : calculateLossValue(+sl, boundary);
      setSLNumber(slVal);
      setSLPercent(sl + '%');
      return;
    }

    if (!isPercent) {
      setSLNumber(+sl);
      setSLPercent(calculatePercent(+sl, boundary, isSell));
      return;
    }
  }, [boundary, isSell, sl, isPercent]);

  // Sets the store values
  useEffect(() => {
    if (isTPInvalid && isSLInvalid) {
      return;
    }

    const tempOrders = new Map(orders);
    let order = tempOrders.get(boundary);

    if (!isTPInvalid) {
      order = {
        ...order,
        takeProfit: tPNumber,
        expectedProfit: { numeric: tPNumber, percentage: tPPercent },
        isValid: isTPInvalid && isSLInvalid,
      };

      tempOrders.set(boundary, order);
      setOrders(tempOrders);
    }

    if (!isSLInvalid) {
      order = {
        ...order,
        stopLoss: sLNumber,
        expectedLoss: { numeric: sLNumber, percentage: sLPercent },
        isValid: isTPInvalid && isSLInvalid,
      };

      tempOrders.set(boundary, order);
      setOrders(tempOrders);
    }
  }, [isTPInvalid, isSLInvalid, sLNumber, tPNumber, boundary]);

  return (
    <form className='p-4'>
      <p>
        {isTPInvalid} - {isSLInvalid}
      </p>

      <SLTPFormInput
        label='takeProfit'
        title='Take Profit'
        isLoss={false}
        numberValue={tPNumber}
        percentValue={tPPercent}
        isInvalid={isTPInvalid}
        boundary={boundary}
        errors={errors}
        isFormInvalid={isInvalid}
        isPercent={isPercent}
        register={register}
      />

      <SLTPFormInput
        label='stopLoss'
        title='Stop Loss'
        isLoss={true}
        numberValue={sLNumber}
        percentValue={sLPercent}
        isInvalid={isSLInvalid}
        boundary={boundary}
        errors={errors}
        isFormInvalid={isInvalid}
        isPercent={isPercent}
        register={register}
      />
    </form>
  );
};
