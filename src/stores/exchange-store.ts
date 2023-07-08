import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface ExchangeStore {
  btc: number;
  walletBalance: number;
  equity: number;
  availableToWithdraw: number;

  setBtc: (btc: number) => void;
  setBalance: (
    equity: number,
    walletBalance: number,
    availableToWithdraw: number,
  ) => void;
}

const useExchangeStore = create<ExchangeStore>()(
  devtools(
    persist(
      (set) => ({
        btc: 0,
        walletBalance: 0,
        equity: 0,
        availableToWithdraw: 0,
        setBtc: (btc: number) =>
          set((state) => ({
            ...state,
            btc,
          })),
        setBalance: (
          equity: number,
          walletBalance: number,
          availableToWithdraw: number,
        ) =>
          set((state) => ({
            ...state,
            equity,
            walletBalance,
            availableToWithdraw,
          })),
      }),
      {
        name: 'exchange-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    {
      name: 'exchange-store',
    },
  ),
);

export default useExchangeStore;
