
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BookingsFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  paymentFilter: string;
  setPaymentFilter: (value: string) => void;
  dateRange: { from: string; to: string };
  setDateRange: (range: { from: string; to: string }) => void;
}

export function BookingsFilters({
  statusFilter,
  setStatusFilter,
  paymentFilter,
  setPaymentFilter,
  dateRange,
  setDateRange,
}: BookingsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="space-y-2">
        <Label className="text-gray-300 text-xs">Status</Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 bg-gray-700/50 border-orange-900/20 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-orange-900/20">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no_show">No Show</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300 text-xs">Payment</Label>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-32 bg-gray-700/50 border-orange-900/20 text-white">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-orange-900/20">
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300 text-xs">Date From</Label>
        <Input
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          className="w-40 bg-gray-700/50 border-orange-900/20 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300 text-xs">Date To</Label>
        <Input
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          className="w-40 bg-gray-700/50 border-orange-900/20 text-white"
        />
      </div>
    </div>
  );
}
