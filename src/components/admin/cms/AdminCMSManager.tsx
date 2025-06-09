
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentManager } from './ContentManager';
import { SettingsManager } from './SettingsManager';
import { AnnouncementManager } from './AnnouncementManager';
import { GalleryManager } from './GalleryManager';
import { ContentPreview } from './ContentPreview';

export function AdminCMSManager() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="content">Website Content</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="announcements">Announcements</TabsTrigger>
        <TabsTrigger value="gallery">Gallery</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="content">
        <ContentManager key={refreshKey} onUpdate={handleRefresh} />
      </TabsContent>

      <TabsContent value="settings">
        <SettingsManager key={refreshKey} onUpdate={handleRefresh} />
      </TabsContent>

      <TabsContent value="announcements">
        <AnnouncementManager key={refreshKey} onUpdate={handleRefresh} />
      </TabsContent>

      <TabsContent value="gallery">
        <GalleryManager key={refreshKey} onUpdate={handleRefresh} />
      </TabsContent>

      <TabsContent value="preview">
        <ContentPreview />
      </TabsContent>
    </Tabs>
  );
}
