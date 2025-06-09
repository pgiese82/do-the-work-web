
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, TrendingUp, DollarSign, Calendar } from 'lucide-react';

export default function AdminPayments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Manage and monitor payment transactions and financial data.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              -2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              +4% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Management</CardTitle>
          <CardDescription>
            Payment functionality will be implemented here. This includes transaction history, 
            payment processing, refunds, and financial reporting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Payment management features are coming soon. This will include:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• Transaction history and details</li>
            <li>• Payment processing and status tracking</li>
            <li>• Refund management</li>
            <li>• Financial reporting and analytics</li>
            <li>• Payment method management</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
