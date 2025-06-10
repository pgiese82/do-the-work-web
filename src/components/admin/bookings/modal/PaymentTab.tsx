
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Save, DollarSign } from 'lucide-react';

interface PaymentTabProps {
  booking: any;
  paymentStatus: string;
  setPaymentStatus: (value: string) => void;
  refundAmount: number;
  setRefundAmount: (value: number) => void;
  onSave: () => void;
  onProcessRefund: () => void;
  saving: boolean;
}

export function PaymentTab({
  booking,
  paymentStatus,
  setPaymentStatus,
  refundAmount,
  setRefundAmount,
  onSave,
  onProcessRefund,
  saving
}: PaymentTabProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gray-700/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-orange-400" />
            Payment Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment-status" className="text-gray-300">Payment Status</Label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger className="bg-gray-600 border-orange-900/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-orange-900/20">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="refund-amount" className="text-gray-300">Refund Amount (€)</Label>
              <Input
                id="refund-amount"
                type="number"
                min="0"
                max={booking.service.price}
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                className="bg-gray-600 border-orange-900/20 text-white"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={onSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
              <Save className="w-4 h-4 mr-2" />
              Update Payment Status
            </Button>
            
            <Button 
              onClick={onProcessRefund} 
              disabled={refundAmount <= 0 || paymentStatus === 'refunded'}
              variant="outline"
              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Process Refund
            </Button>
          </div>

          <div className="bg-gray-600/50 p-4 rounded-lg">
            <div className="text-gray-300 space-y-1">
              <div><strong>Service Price:</strong> €{booking.service.price}</div>
              <div><strong>Current Status:</strong> <Badge variant="outline" className={`
                ${paymentStatus === 'paid' ? 'text-green-400 border-green-400' : ''}
                ${paymentStatus === 'pending' ? 'text-yellow-400 border-yellow-400' : ''}
                ${paymentStatus === 'failed' ? 'text-red-400 border-red-400' : ''}
                ${paymentStatus === 'refunded' ? 'text-gray-400 border-gray-400' : ''}
              `}>{paymentStatus}</Badge></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
