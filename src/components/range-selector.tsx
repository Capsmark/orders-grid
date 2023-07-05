import { useState } from 'react';

const RangeSelector = () => {
  const [value, setValue] = useState(0);

  const handleChange = (e: any) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
  };

  return (
    <div className='w-64 flex flex-col justify-center items-start'>
      <input
        type='range'
        min='0'
        max='100'
        step='5'
        value={value}
        onChange={handleChange}
        className='w-full h-2 bg-gray-200 rounded-md appearance-none focus:outline-none focus:bg-indigo-500'
      />
      <div className='flex justify-between w-full mt-2'>
        <span className='text-xs text-gray-600'>0%</span>

        <div className='mt-2 self-center'>
          <span className='text-sm font-bold text-indigo-500'>{value}%</span>
        </div>

        <span className='text-xs text-gray-600'>100%</span>
      </div>
    </div>
  );
};

export default RangeSelector;
