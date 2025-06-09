
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Edit, Plus, Power, PowerOff, Megaphone } from 'lucide-react';
import { AnnouncementModal } from './AnnouncementModal';
import { useToast } from '@/hooks/use-toast';

interface AnnouncementManagerProps {
  onUpdate: () => void;
}

export function AnnouncementManager({ onUpdate }: AnnouncementManagerProps) {
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: announcements = [], isLoading, refetch } = useQuery({
    queryKey: ['announcement-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcement_banners')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const toggleAnnouncementStatus = async (announcementId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('announcement_banners')
        .update({ is_active: !currentStatus })
        .eq('id', announcementId);

      if (error) throw error;

      toast({
        title: "Announcement updated",
        description: `Announcement ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
      });

      refetch();
      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating announcement",
        description: error.message,
      });
    }
  };

  const handleEditAnnouncement = (announcementId: string) => {
    setSelectedAnnouncementId(announcementId);
    setModalOpen(true);
  };

  const handleCreateAnnouncement = () => {
    setSelectedAnnouncementId(null);
    setModalOpen(true);
  };

  const getBannerTypeBadge = (bannerType: string) => {
    const variants = {
      info: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
      success: 'bg-green-500/20 text-green-400 border-green-500/20',
      error: 'bg-red-500/20 text-red-400 border-red-500/20',
    };

    return (
      <Badge className={variants[bannerType as keyof typeof variants] || variants.info}>
        {bannerType}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              Announcement Banners
            </CardTitle>
            <Button onClick={handleCreateAnnouncement}>
              <Plus className="w-4 h-4 mr-2" />
              Add Announcement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading announcements...
                    </TableCell>
                  </TableRow>
                ) : announcements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No announcements found
                    </TableCell>
                  </TableRow>
                ) : (
                  announcements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{announcement.title}</div>
                          <div className="text-muted-foreground text-xs truncate max-w-xs">
                            {announcement.message.substring(0, 100)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getBannerTypeBadge(announcement.banner_type)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={announcement.is_active ? "default" : "secondary"}>
                          {announcement.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {announcement.start_date && (
                            <div>From: {format(new Date(announcement.start_date), 'MMM dd, yyyy')}</div>
                          )}
                          {announcement.end_date && (
                            <div>To: {format(new Date(announcement.end_date), 'MMM dd, yyyy')}</div>
                          )}
                          {!announcement.start_date && !announcement.end_date && (
                            <span className="text-muted-foreground">No schedule</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAnnouncement(announcement.id)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant={announcement.is_active ? "secondary" : "default"}
                            onClick={() => toggleAnnouncementStatus(announcement.id, announcement.is_active)}
                          >
                            {announcement.is_active ? (
                              <PowerOff className="w-4 h-4" />
                            ) : (
                              <Power className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AnnouncementModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        announcementId={selectedAnnouncementId}
        onUpdate={() => {
          refetch();
          onUpdate();
        }}
      />
    </>
  );
}
