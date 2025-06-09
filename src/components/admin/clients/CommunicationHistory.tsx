
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
    const variants = {
      email: 'bg-blue-500/20 text-blue-300 border-blue-500/20',
      sms: 'bg-green-500/20 text-green-300 border-green-500/20',
      call: 'bg-purple-500/20 text-purple-300 border-purple-500/20',
      in_person: 'bg-orange-500/20 text-orange-300 border-orange-500/20',
      note: 'bg-gray-500/20 text-gray-300 border-gray-500/20'
    };

    return (
      <Badge className={variants[type as keyof typeof variants] || variants.note}>
        {type.replace('_', ' ')}
      </Badge>
    );
  };

  const getDirectionBadge = (direction: string) => {
    return direction === 'outbound' ? (
      <Badge className="bg-green-500/20 text-green-300 border-green-500/20">
        Outbound
      </Badge>
    ) : (
      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/20">
        Inbound
      </Badge>
    );
  };

  return (
    <Card className="bg-gray-800/50 border-orange-900/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-orange-400" />
            Communication History
          </span>
          <Button 
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Communication
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search communications by client or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-700/50 border-orange-900/20 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border border-orange-900/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-orange-900/20 hover:bg-gray-700/30">
                <TableHead className="text-gray-300">Client</TableHead>
                <TableHead className="text-gray-300">Type</TableHead>
                <TableHead className="text-gray-300">Direction</TableHead>
                <TableHead className="text-gray-300">Subject/Content</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                    Loading communications...
                  </TableCell>
                </TableRow>
              ) : communications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                    No communications found
                  </TableCell>
                </TableRow>
              ) : (
                communications.map((comm) => (
                  <TableRow key={comm.id} className="border-orange-900/20 hover:bg-gray-700/20">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-white font-medium">{comm.user?.name}</div>
                          <div className="text-gray-400 text-xs">{comm.user?.email}</div>
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
                          <div className="text-white font-medium text-sm mb-1">{comm.subject}</div>
                        )}
                        <div className="text-gray-400 text-sm truncate">{comm.content}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {format(new Date(comm.created_at), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="text-gray-300">
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
