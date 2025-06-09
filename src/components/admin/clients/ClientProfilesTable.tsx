
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClientProfileModal } from './ClientProfileModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Search, Edit, User, Calendar, DollarSign } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  client_status: string;
  last_session_date: string | null;
  total_spent: number | null;
  created_at: string;
  address: string | null;
  date_of_birth: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  health_notes: string | null;
  training_preferences: string | null;
  acquisition_source: string | null;
  notes: string | null;
}

interface ClientProfilesTableProps {
  key: number;
  onUpdate: () => void;
}

export function ClientProfilesTable({ onUpdate }: ClientProfilesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const { data: clients = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-clients', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('users')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('client_status', statusFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Filter by search term
      if (searchTerm) {
        return data.filter(client => 
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return data as Client[];
    },
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      prospect: 'bg-blue-500/20 text-blue-300 border-blue-500/20',
      active: 'bg-green-500/20 text-green-300 border-green-500/20',
      inactive: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20',
      churned: 'bg-red-500/20 text-red-300 border-red-500/20'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.prospect}>
        {status}
      </Badge>
    );
  };

  const handleEditClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setProfileModalOpen(true);
  };

  return (
    <>
      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-orange-400" />
            Client Profiles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700/50 border-orange-900/20 text-white placeholder:text-gray-400"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-gray-700/50 border-orange-900/20 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="churned">Churned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-orange-900/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-orange-900/20 hover:bg-gray-700/30">
                  <TableHead className="text-gray-300">Client</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Last Session</TableHead>
                  <TableHead className="text-gray-300">Total Spent</TableHead>
                  <TableHead className="text-gray-300">Member Since</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                      Loading clients...
                    </TableCell>
                  </TableRow>
                ) : clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                      No clients found
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id} className="border-orange-900/20 hover:bg-gray-700/20">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-white font-medium">{client.name}</div>
                            <div className="text-gray-400 text-xs">{client.email}</div>
                            {client.phone && (
                              <div className="text-gray-400 text-xs">{client.phone}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(client.client_status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-300">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {client.last_session_date 
                            ? format(new Date(client.last_session_date), 'MMM dd, yyyy')
                            : 'Never'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-300">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          €{client.total_spent?.toFixed(2) || '0.00'}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {format(new Date(client.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClient(client.id)}
                          className="border-orange-500/20 text-orange-300 hover:bg-orange-500/10"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ClientProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        clientId={selectedClientId}
        onUpdate={() => {
          refetch();
          onUpdate();
        }}
      />
    </>
  );
}
