
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
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            Payment Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment-status" className="text-foreground">Payment Status</Label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="refund-amount" className="text-foreground">Refund Amount (€)</Label>
              <Input
                id="refund-amount"
                type="number"
                min="0"
                max={booking.service.price}
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={onSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Save className="w-4 h-4 mr-2" />
              Update Payment Status
            </Button>
            
            <Button 
              onClick={onProcessRefund} 
              disabled={refundAmount <= 0 || paymentStatus === 'refunded'}
              variant="outline"
              className="border-destructive/20 text-destructive hover:bg-destructive/10"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Process Refund
            </Button>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-foreground space-y-1">
              <div><strong>Service Price:</strong> €{booking.service.price}</div>
              <div><strong>Current Status:</strong> <Badge variant="outline" className={`
                ${paymentStatus === 'paid' ? 'text-green-600 border-green-600' : ''}
                ${paymentStatus === 'pending' ? 'text-yellow-600 border-yellow-600' : ''}
                ${paymentStatus === 'failed' ? 'text-red-600 border-red-600' : ''}
                ${paymentStatus === 'refunded' ? 'text-muted-foreground border-muted-foreground' : ''}
              `}>{paymentStatus}</Badge></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
