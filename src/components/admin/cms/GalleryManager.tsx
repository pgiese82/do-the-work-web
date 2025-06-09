
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Edit, Plus, Power, PowerOff, Image as ImageIcon, Trash2 } from 'lucide-react';
import { GalleryModal } from './GalleryModal';
import { useToast } from '@/hooks/use-toast';

interface GalleryManagerProps {
  onUpdate: () => void;
}

export function GalleryManager({ onUpdate }: GalleryManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: images = [], isLoading, refetch } = useQuery({
    queryKey: ['gallery-images', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      
      if (error) throw error;

      if (searchTerm) {
        return data.filter(image => 
          image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return data;
    },
  });

  const toggleImageStatus = async (imageId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_active: !currentStatus })
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: "Image updated",
        description: `Image ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
      });

      refetch();
      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating image",
        description: error.message,
      });
    }
  };

  const deleteImage = async (imageId: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      // Delete from database
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      // Delete from storage if it's a stored file
      if (imageUrl.includes('cms-images')) {
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('cms-images')
            .remove([`cms/${fileName}`]);
        }
      }

      toast({
        title: "Image deleted",
        description: "Image has been deleted successfully.",
      });

      refetch();
      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting image",
        description: error.message,
      });
    }
  };

  const handleEditImage = (imageId: string) => {
    setSelectedImageId(imageId);
    setModalOpen(true);
  };

  const handleCreateImage = () => {
    setSelectedImageId(null);
    setModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Gallery Images
            </CardTitle>
            <Button onClick={handleCreateImage}>
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Images Grid */}
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading images...
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No images found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={image.image_url}
                      alt={image.alt_text || image.title || 'Gallery image'}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={image.is_active ? "default" : "secondary"}>
                        {image.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-medium truncate">{image.title || 'Untitled'}</h3>
                      {image.description && (
                        <p className="text-sm text-muted-foreground truncate">
                          {image.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {image.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Order: {image.sort_order}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditImage(image.id)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={image.is_active ? "secondary" : "default"}
                        onClick={() => toggleImageStatus(image.id, image.is_active)}
                      >
                        {image.is_active ? (
                          <PowerOff className="w-4 h-4" />
                        ) : (
                          <Power className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteImage(image.id, image.image_url)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <GalleryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        imageId={selectedImageId}
        onUpdate={() => {
          refetch();
          onUpdate();
        }}
      />
    </>
  );
}
