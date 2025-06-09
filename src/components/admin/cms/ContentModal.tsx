
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ImageUpload } from './ImageUpload';

interface ContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string | null;
  onUpdate: () => void;
}

export function ContentModal({ open, onOpenChange, contentId, onUpdate }: ContentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    section_type: '',
    title: '',
    content: '',
    image_url: '',
    is_active: true,
    sort_order: 0,
    metadata: {}
  });
  const { toast } = useToast();

  useEffect(() => {
    if (contentId && open) {
      loadContent();
    } else if (!contentId && open) {
      setFormData({
        section_type: '',
        title: '',
        content: '',
        image_url: '',
        is_active: true,
        sort_order: 0,
        metadata: {}
      });
    }
  }, [contentId, open]);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .eq('id', contentId)
        .single();

      if (error) throw error;

      setFormData({
        section_type: data.section_type,
        title: data.title || '',
        content: data.content || '',
        image_url: data.image_url || '',
        is_active: data.is_active,
        sort_order: data.sort_order || 0,
        metadata: data.metadata || {}
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading content",
        description: error.message,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (contentId) {
        const { error } = await supabase
          .from('website_content')
          .update(formData)
          .eq('id', contentId);

        if (error) throw error;

        toast({
          title: "Content updated",
          description: "Website content has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('website_content')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Content created",
          description: "New website content has been created successfully.",
        });
      }

      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving content",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {contentId ? 'Edit Content' : 'Create New Content'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section_type">Section Type</Label>
              <Select
                value={formData.section_type}
                onValueChange={(value) => setFormData({ ...formData, section_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero</SelectItem>
                  <SelectItem value="about">About</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="testimonial">Testimonial</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter content title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter content text"
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : contentId ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
