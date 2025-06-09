
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function LoadingState() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-muted/50 rounded-lg w-64 animate-pulse"></div>
        <div className="h-5 bg-muted/50 rounded w-96 animate-pulse"></div>
      </div>
      
      {/* Tabs skeleton */}
      <div className="h-10 bg-muted/30 rounded-md w-full animate-pulse"></div>
      
      {/* Cards skeleton */}
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
