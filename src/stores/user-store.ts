import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface UserStore {
  isLoggedIn: boolean;
  setLogin: (isLoggedIn: boolean) => void;
}

const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        isLoggedIn: false,
        setLogin: (isLoggedIn: boolean) =>
          set((state) => ({
            ...state,
            isLoggedIn,
          })),
      }),
      {
        name: 'user-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    {
      name: 'user-store',
    },
  ),
);

export default useUserStore;
