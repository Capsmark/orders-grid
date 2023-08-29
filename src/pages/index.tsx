import withAuth from '@/components/withAuth';
import { Dashboard } from '@/views/dashboard/dashboard';

function Home() {
  return <Dashboard />;
}

export default withAuth(Home);
