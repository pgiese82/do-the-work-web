
import React from 'react';
import { CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { nl } from 'date-fns/locale';

interface CalendarHeaderProps {
    currentDate: Date;
    view: 'day' | 'week' | 'month';
    navigateDate: (direction: 'prev' | 'next') => void;
    setCurrentDate: (date: Date) => void;
    setView: (view: 'day' | 'week' | 'month') => void;
}

export function CalendarHeader({
    currentDate,
    view,
    navigateDate,
    setCurrentDate,
    setView
}: CalendarHeaderProps) {
    const formatDateRange = () => {
        switch (view) {
          case 'day':
            return format(currentDate, 'EEEE, d MMMM yyyy', { locale: nl });
          case 'week':
            const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
            const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
            return `${format(weekStart, 'd MMM', { locale: nl })} - ${format(weekEnd, 'd MMM yyyy', { locale: nl })}`;
          case 'month':
            return format(currentDate, 'MMMM yyyy', { locale: nl });
          default:
            return '';
        }
      };

    return (
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigateDate('prev')}
                variant="outline"
                size="sm"
                className="text-foreground border-border hover:bg-muted"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h2 className="text-xl font-semibold text-foreground min-w-[300px] text-center">
                {formatDateRange()}
              </h2>
              
              <Button
                onClick={() => navigateDate('next')}
                variant="outline"
                size="sm"
                className="text-foreground border-border hover:bg-muted"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setCurrentDate(new Date())}
                variant="outline"
                size="sm"
                className="text-foreground border-border hover:bg-muted"
              >
                Vandaag
              </Button>
              
              <Tabs value={view} onValueChange={(value) => setView(value as 'day' | 'week' | 'month')}>
                <TabsList className="bg-muted">
                  <TabsTrigger value="day" className="text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground">
                    Dag
                  </TabsTrigger>
                  <TabsTrigger value="week" className="text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground">
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="month" className="text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground">
                    Maand
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
    );
}
