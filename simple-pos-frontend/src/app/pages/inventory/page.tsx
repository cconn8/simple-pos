import InventoryDashboard from './InventoryDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function InventoryPage() {
  return (
    <ProtectedRoute>
      <InventoryDashboard />
    </ProtectedRoute>
  );
}