
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Save, Euro } from 'lucide-react';

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
  const paymentStatusLabels: { [key: string]: string } = {
    pending: 'Wachtend',
    paid: 'Betaald',
    failed: 'Mislukt',
    refunded: 'Terugbetaald',
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            Betaalbeheer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment-status" className="text-foreground">Betaalstatus</Label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="pending">Wachtend</SelectItem>
                  <SelectItem value="paid">Betaald</SelectItem>
                  <SelectItem value="failed">Mislukt</SelectItem>
                  <SelectItem value="refunded">Terugbetaald</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="refund-amount" className="text-foreground">Terug te betalen bedrag (€)</Label>
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
              Betaalstatus bijwerken
            </Button>
            
            <Button 
              onClick={onProcessRefund} 
              disabled={refundAmount <= 0 || paymentStatus === 'refunded'}
              variant="outline"
              className="border-destructive/20 text-destructive hover:bg-destructive/10"
            >
              <Euro className="w-4 h-4 mr-2" />
              Verwerk terugbetaling
            </Button>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-foreground space-y-1">
              <div><strong>Serviceprijs:</strong> €{booking.service.price}</div>
              <div><strong>Huidige status:</strong> <Badge variant="outline" className={`
                ${paymentStatus === 'paid' ? 'text-green-600 border-green-600' : ''}
                ${paymentStatus === 'pending' ? 'text-yellow-600 border-yellow-600' : ''}
                ${paymentStatus === 'failed' ? 'text-red-600 border-red-600' : ''}
                ${paymentStatus === 'refunded' ? 'text-muted-foreground border-muted-foreground' : ''}
              `}>{paymentStatusLabels[paymentStatus] || paymentStatus}</Badge></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
