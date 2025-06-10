
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Search, MessageCircle, Mail, Phone, User, Plus } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface CommunicationRecord {
  id: string;
  user_id: string;
  communication_type: string;
  subject: string | null;
  content: string;
  direction: string;
  status: string | null;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
  admin: {
    name: string;
  } | null;
}

interface CommunicationHistoryProps {
  key: number;
  onUpdate: () => void;
}

export function CommunicationHistory({ onUpdate }: CommunicationHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: communications = [], isLoading } = useQuery({
    queryKey: ['communication-history', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('communication_history')
        .select(`
          *,
          user:users!communication_history_user_id_fkey(name, email),
          admin:users!communication_history_admin_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      
      if (error) throw error;

      // Filter by search term
      if (searchTerm) {
        return data.filter(comm => 
          comm.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comm.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comm.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return data as CommunicationRecord[];
    },
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageCircle className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'in_person': return <User className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant="outline" className="capitalize">
        {type.replace('_', ' ')}
      </Badge>
    );
  };

  const getDirectionBadge = (direction: string) => {
    return direction === 'outbound' ? (
      <Badge variant="default">
        Outbound
      </Badge>
    ) : (
      <Badge variant="secondary">
        Inbound
      </Badge>
    );
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Communication History
          </span>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Communication
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search communications by client or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Subject/Content</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading communications...
                  </TableCell>
                </TableRow>
              ) : communications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No communications found
                  </TableCell>
                </TableRow>
              ) : (
                communications.map((comm) => (
                  <TableRow key={comm.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{comm.user?.name}</div>
                          <div className="text-muted-foreground text-xs">{comm.user?.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(comm.communication_type)}
                        {getTypeBadge(comm.communication_type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getDirectionBadge(comm.direction)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {comm.subject && (
                          <div className="font-medium text-sm mb-1">{comm.subject}</div>
                        )}
                        <div className="text-muted-foreground text-sm truncate">{comm.content}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(comm.created_at), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {comm.admin?.name || 'System'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
