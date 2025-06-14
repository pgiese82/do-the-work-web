
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
            <SelectItem value="all">Alle Statussen</SelectItem>
            <SelectItem value="pending">In Afwachting</SelectItem>
            <SelectItem value="confirmed">Bevestigd</SelectItem>
            <SelectItem value="completed">Voltooid</SelectItem>
            <SelectItem value="cancelled">Geannuleerd</SelectItem>
            <SelectItem value="no_show">Niet Verschenen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300 text-xs">Betaling</Label>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-32 bg-gray-700/50 border-orange-900/20 text-white">
            <SelectValue placeholder="Betaling" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-orange-900/20">
            <SelectItem value="all">Alle Betalingen</SelectItem>
            <SelectItem value="pending">In Afwachting</SelectItem>
            <SelectItem value="paid">Betaald</SelectItem>
            <SelectItem value="failed">Mislukt</SelectItem>
            <SelectItem value="refunded">Terugbetaald</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300 text-xs">Datum Van</Label>
        <Input
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          className="w-40 bg-gray-700/50 border-orange-900/20 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300 text-xs">Datum Tot</Label>
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
