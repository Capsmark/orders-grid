import Image from 'next/image';
import { FC } from 'react';

interface SLTPProps {
  label: string;
  title: string;
  boundary: number;
  isFormInvalid: boolean;
  isInvalid: boolean;
  isLoss: boolean;
  register: any;
  errors: any;
  isPercent: boolean;
  percentValue: string;
  numberValue: number;
}

export const SLTPFormInput: FC<SLTPProps> = ({
  label,
  title,
  boundary,
  isInvalid,
  isFormInvalid,
  register,
  errors,
  isLoss,
  isPercent,
  percentValue,
  numberValue,
}) => (
  <div className='my-6 mb-4'>
    <label htmlFor={label} className='block text-white-700 mb-2'>
      {title} Of {boundary}:
    </label>

    <div className='relative'>
      <input
        disabled={isFormInvalid}
        type='text'
        id={label}
        {...register(label, { required: true })}
        className='border border-white-300 rounded px-3 py-2 w-full'
      />

      {isPercent && (
        <div className='absolute inset-y-0 right-0 flex items-center pr-1.5 pointer-events-none'>
          <Image
            width={30}
            height={30}
            src={'/percentage.min.svg'}
            alt='Percentage Icon Caps Order Grid'
          ></Image>
        </div>
      )}

      {!isPercent && (
        <div className='absolute inset-y-0 right-0 flex items-center pr-1.5 pointer-events-none'>
          <Image
            width={30}
            height={30}
            src={'/hash.min.svg'}
            alt='Hash Icon Caps Order Grid'
          ></Image>
        </div>
      )}
    </div>

    {errors[label] && <span className='error mt-1'>This field is required</span>}

    <p
      className={
        isInvalid
          ? 'text-orange-500 py-4'
          : !isLoss
          ? 'text-green-500 py-4'
          : 'text-red-500 py-4'
      }
    >
      {isInvalid
        ? 'Invalid Input'
        : `${!isPercent ? (isLoss ? 'Loss:' : 'Profit:') : 'Price: '} ${
            !isPercent ? percentValue : numberValue
          }`}
    </p>
  </div>
);
