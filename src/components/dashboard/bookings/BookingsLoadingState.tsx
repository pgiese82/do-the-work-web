
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function BookingsLoadingState() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-muted/50 rounded-lg w-64 animate-pulse"></div>
        <div className="h-5 bg-muted/50 rounded w-96 animate-pulse"></div>
      </div>
      
      {/* Filters skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-muted/30 rounded-md animate-pulse"></div>
        ))}
      </div>
      
      {/* View toggle skeleton */}
      <div className="h-10 bg-muted/30 rounded-md w-48 animate-pulse"></div>
      
      {/* Content skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-6 bg-muted/50 rounded w-48 animate-pulse"></div>
                  <div className="h-4 bg-muted/50 rounded w-64 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-muted/50 rounded w-20 animate-pulse"></div>
                  <div className="h-6 bg-muted/50 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="h-4 bg-muted/50 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-muted/50 rounded w-16 animate-pulse"></div>
                </div>
                <div className="h-16 bg-muted/30 rounded-lg animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
