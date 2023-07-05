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
        <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            stroke-width='2'
            stroke='currentColor'
            fill='none'
            stroke-linecap='round'
            stroke-linejoin='round'
          >
            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
            <path d='M17 17m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
            <path d='M7 7m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
            <path d='M6 18l12 -12' />
          </svg>
        </div>
      )}

      {!isPercent && (
        <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            stroke-width='2'
            stroke='currentColor'
            fill='none'
            stroke-linecap='round'
            stroke-linejoin='round'
          >
            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
            <path d='M5 9l14 0' />
            <path d='M5 15l14 0' />
            <path d='M11 4l-4 16' />
            <path d='M17 4l-4 16' />
          </svg>
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
