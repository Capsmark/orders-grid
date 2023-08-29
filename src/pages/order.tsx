import withAuth from '@/components/withAuth';
import { Order } from '@/views/order/order';

function OrderPage() {
  return <Order />;
}

export default withAuth(OrderPage);
