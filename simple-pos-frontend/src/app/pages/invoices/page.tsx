import ProtectedRoute from '@/components/ProtectedRoute';

export default function Invoices() {
    return (
        <ProtectedRoute>
            <div className="p-4">
                <h1 className="text-2xl font-bold">Invoices</h1>
                <p>Invoices page - coming soon</p>
            </div>
        </ProtectedRoute>
    );
}