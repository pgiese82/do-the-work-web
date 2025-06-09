
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useBookingTrends, useServicePopularity } from '@/hooks/useAdminDashboardData';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

export function DashboardCharts() {
  const { data: bookingTrends, isLoading: trendsLoading } = useBookingTrends(7);
  const { data: servicePopularity, isLoading: popularityLoading } = useServicePopularity();

  const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Booking Trends Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
            Boekingstrends (Laatste 7 Dagen)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trendsLoading ? (
            <div className="h-[200px] md:h-[300px] flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground text-sm">Grafiek laden...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('nl-NL', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  fontSize={12}
                />
                <YAxis yAxisId="left" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" fontSize={12} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('nl-NL')}
                  formatter={(value, name) => [
                    name === 'count' ? `${value} boekingen` : `€${value}`,
                    name === 'count' ? 'Boekingen' : 'Omzet'
                  ]}
                />
                <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="count" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="revenue" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Service Popularity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <BarChart3 className="h-4 w-4 md:h-5 md:w-5" />
            Service Populariteit
          </CardTitle>
        </CardHeader>
        <CardContent>
          {popularityLoading ? (
            <div className="h-[200px] md:h-[250px] flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground text-sm">Grafiek laden...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={servicePopularity?.slice(0, 5)} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="service_name" type="category" width={80} fontSize={10} />
                <Tooltip formatter={(value, name) => [`${value} boekingen`, 'Boekingen']} />
                <Bar dataKey="booking_count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Revenue by Service */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <PieChartIcon className="h-4 w-4 md:h-5 md:w-5" />
            Omzet per Service
          </CardTitle>
        </CardHeader>
        <CardContent>
          {popularityLoading ? (
            <div className="h-[200px] md:h-[250px] flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground text-sm">Grafiek laden...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={servicePopularity?.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ service_name, percent }) => `${service_name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total_revenue"
                  fontSize={10}
                >
                  {servicePopularity?.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`€${value}`, 'Omzet']} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
