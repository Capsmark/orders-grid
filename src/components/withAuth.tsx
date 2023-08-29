import useUserStore from '@/stores/user-store';

import { useRouter } from 'next/router';
import { ComponentType, FC, useEffect } from 'react';

const withAuth =
  <P extends object>(WrappedComponent: ComponentType<P>): FC<P> =>
  (props: P) => {
    // FIXME change the logic of store to use real auth instead of mocked email
    const { isLoggedIn } = useUserStore();

    const { push } = useRouter();

    useEffect(() => {
      if (!isLoggedIn) {
        push('/login'); // Redirect to login page
      }
    }, [isLoggedIn]);

    if (isLoggedIn) {
      return <WrappedComponent {...props} />;
    }

    return null; // TODO add a <Loading /> component
  };

export default withAuth;
