import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Order {
  takeProfit?: number;
  stopLoss?: number;

  expectedProfit?: { numeric: number; percentage: string };
  expectedLoss?: { numeric: number; percentage: string };

  isValid: boolean;
}

interface GridStore {
  orders: Map<number, Order>;
  setOrders: (orders: Map<number, Order>) => void;
}

const useGridStore = create<GridStore>()(
  devtools(
    (set) => ({
      orders: new Map<number, Order>(),
      setOrders: (o: Map<number, Order>) => {
        return set((state) => {
          return {
            ...state,
            orders: o,
          };
        });
      },
    }),
    {
      name: 'grid-store',
    },
  ),
);

export default useGridStore;
