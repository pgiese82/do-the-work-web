
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, TrendingUp, Euro, Calendar } from 'lucide-react';

export default function AdminPayments() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Betalingen</h1>
          <p className="text-muted-foreground">
            Beheer en monitor betalingstransacties en financiële gegevens.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totale Omzet</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€45.231,89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% sinds vorige maand
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Succesvolle Betalingen</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-muted-foreground">
                +15% sinds vorige maand
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wachtende Betalingen</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                -2% sinds vorige maand
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Groeiratio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12.5%</div>
              <p className="text-xs text-muted-foreground">
                +4% sinds vorige maand
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Betaalbeheer</CardTitle>
            <CardDescription>
              Betaalfunctionaliteit wordt hier geïmplementeerd. Dit omvat transactiegeschiedenis, 
              betalingsverwerking, terugbetalingen en financiële rapportages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Functies voor betaalbeheer komen binnenkort beschikbaar. Dit zal omvatten:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Transactiegeschiedenis en -details</li>
              <li>• Betalingsverwerking en status-tracking</li>
              <li>• Terugbetalingsbeheer</li>
              <li>• Financiële rapportages en analyses</li>
              <li>• Beheer van betaalmethoden</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
