import React from 'react';

interface ToggleInput {
  state: boolean;
  onChange: (
    newState: Partial<boolean> | ((prevState: boolean) => Partial<boolean>),
    callback?: () => void,
  ) => void;
  activeColorClass?: string;
  defaultColorClass?: string;
}

const ToggleSwitch: React.FC<ToggleInput> = ({
  state,
  onChange,
  activeColorClass,
  defaultColorClass,
}) => {
  const handleToggle = () => {
    onChange((prevState: boolean) => !prevState);
  };

  return (
    <div onClick={handleToggle} className='flex items-center'>
      <input type='checkbox' className='hidden' />
      <label
        className={`${
          !state ? defaultColorClass || 'bg-green-500' : activeColorClass || 'bg-red-500'
        } w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors`}
      >
        <span
          className={`${
            !state ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-6 h-6 bg-white  rounded-full shadow-md transform transition-transform`}
        ></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
