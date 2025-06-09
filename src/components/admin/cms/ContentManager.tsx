
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Search, Edit, Plus, Eye, Power, PowerOff } from 'lucide-react';
import { ContentModal } from './ContentModal';
import { useToast } from '@/hooks/use-toast';

interface ContentManagerProps {
  onUpdate: () => void;
}

export function ContentManager({ onUpdate }: ContentManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: content = [], isLoading, refetch } = useQuery({
    queryKey: ['website-content', searchTerm, sectionFilter],
    queryFn: async () => {
      let query = supabase
        .from('website_content')
        .select('*')
        .order('section_type', { ascending: true })
        .order('sort_order', { ascending: true });

      if (sectionFilter !== 'all') {
        query = query.eq('section_type', sectionFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      if (searchTerm) {
        return data.filter(item => 
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.section_type.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return data;
    },
  });

  const toggleContentStatus = async (contentId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('website_content')
        .update({ is_active: !currentStatus })
        .eq('id', contentId);

      if (error) throw error;

      toast({
        title: "Content updated",
        description: `Content ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
      });

      refetch();
      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating content",
        description: error.message,
      });
    }
  };

  const handleEditContent = (contentId: string) => {
    setSelectedContentId(contentId);
    setModalOpen(true);
  };

  const handleCreateContent = () => {
    setSelectedContentId(null);
    setModalOpen(true);
  };

  const getSectionBadge = (sectionType: string) => {
    const variants = {
      hero: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
      about: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
      service: 'bg-green-500/20 text-green-400 border-green-500/20',
      testimonial: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
      contact: 'bg-red-500/20 text-red-400 border-red-500/20',
    };

    return (
      <Badge className={variants[sectionType as keyof typeof variants] || 'bg-gray-500/20 text-gray-400 border-gray-500/20'}>
        {sectionType}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle>Website Content</CardTitle>
            <Button onClick={handleCreateContent}>
              <Plus className="w-4 h-4 mr-2" />
              Add Content
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                <SelectItem value="hero">Hero</SelectItem>
                <SelectItem value="about">About</SelectItem>
                <SelectItem value="service">Services</SelectItem>
                <SelectItem value="testimonial">Testimonials</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading content...
                    </TableCell>
                  </TableRow>
                ) : content.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No content found
                    </TableCell>
                  </TableRow>
                ) : (
                  content.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {getSectionBadge(item.section_type)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.title || 'Untitled'}</div>
                          {item.content && (
                            <div className="text-muted-foreground text-xs truncate max-w-xs">
                              {item.content.substring(0, 100)}...
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.is_active ? "default" : "secondary"}>
                          {item.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.sort_order}</TableCell>
                      <TableCell>
                        {format(new Date(item.updated_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditContent(item.id)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant={item.is_active ? "secondary" : "default"}
                            onClick={() => toggleContentStatus(item.id, item.is_active)}
                          >
                            {item.is_active ? (
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

      <ContentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        contentId={selectedContentId}
        onUpdate={() => {
          refetch();
          onUpdate();
        }}
      />
    </>
  );
}
