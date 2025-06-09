
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  CalendarCheck, 
  DollarSign, 
  TrendingUp,
  Clock,
  FileText
} from 'lucide-react';

const statsData = [
  {
    title: "Total Clients",
    value: "1,234",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Active Bookings",
    value: "89",
    change: "+5%",
    changeType: "positive" as const,
    icon: CalendarCheck,
  },
  {
    title: "Monthly Revenue",
    value: "$45,670",
    change: "+23%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Growth Rate",
    value: "18.2%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Pending Sessions",
    value: "24",
    change: "-3%",
    changeType: "negative" as const,
    icon: Clock,
  },
  {
    title: "Documents",
    value: "156",
    change: "+8%",
    changeType: "positive" as const,
    icon: FileText,
  },
];

export function AdminStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {statsData.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className={`text-xs ${
              stat.changeType === 'positive' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
