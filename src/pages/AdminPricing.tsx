
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminPricingManager } from '@/components/admin/pricing/AdminPricingManager';

const AdminPricing = () => {
  return (
    <AdminLayout>
      <AdminPricingManager />
    </AdminLayout>
  );
};

export default AdminPricing;
