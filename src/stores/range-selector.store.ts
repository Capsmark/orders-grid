import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface RangeSelectorStore {
  quantity: number;
  setQuantity: (quantity: number) => void;

  percentage: number;
  setPercentage: (percentage: number) => void;

  amount: number;
  setAmount: (amount: number) => void;

  onRangeChanges: (amount: number, percentage: number) => void;
}

const useRangeSelectorStore = create<RangeSelectorStore>()(
  devtools(
    (set) => ({
      quantity: 1,
      setQuantity: (quantity) => set((state) => ({ ...state, quantity })),

      percentage: 0,
      setPercentage: (percentage) => set((state) => ({ ...state, percentage })),

      amount: 0,
      setAmount: (amount) => set((state) => ({ ...state, amount })),

      onRangeChanges: (amount: number, percentage: number) =>
        set((state) => ({ ...state, amount, percentage })),
    }),
    {
      name: 'range-selector-store',
    },
  ),
);

export default useRangeSelectorStore;
