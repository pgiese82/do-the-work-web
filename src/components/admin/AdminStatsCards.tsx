
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
    description: "from last month"
  },
  {
    title: "Active Bookings", 
    value: "89",
    change: "+5%",
    changeType: "positive" as const,
    icon: CalendarCheck,
    description: "this week"
  },
  {
    title: "Monthly Revenue",
    value: "$45,670",
    change: "+23%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "vs last month"
  },
  {
    title: "Growth Rate",
    value: "18.2%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "quarterly"
  },
  {
    title: "Pending Sessions",
    value: "24",
    change: "-3%",
    changeType: "negative" as const,
    icon: Clock,
    description: "awaiting confirmation"
  },
  {
    title: "Documents",
    value: "156",
    change: "+8%",
    changeType: "positive" as const,
    icon: FileText,
    description: "total uploaded"
  },
];

export function AdminStatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statsData.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                {stat.change}
              </span>{' '}
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
