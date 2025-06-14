
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
import { nl } from 'date-fns/locale';
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

  console.log('Current statusFilter value:', statusFilter);

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

      // Filter by search term and ensure client_status is not empty
      let filteredData = data || [];
      
      if (searchTerm) {
        filteredData = filteredData.filter(client => 
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Ensure client_status uses the new uniform system
      filteredData = filteredData.map(client => {
        let normalizedStatus = 'prospect';
        
        // Convert old statuses to new uniform system
        if (client.client_status) {
          switch (client.client_status.toLowerCase()) {
            case 'active':
            case 'actief':
              normalizedStatus = 'active';
              break;
            case 'inactive':
            case 'inactief':
            case 'churned':
            case 'weggevallen':
              normalizedStatus = 'inactive';
              break;
            default:
              normalizedStatus = 'prospect';
          }
        }
        
        return {
          ...client,
          client_status: normalizedStatus
        };
      });

      console.log('Filtered clients:', filteredData.map(c => ({ id: c.id, client_status: c.client_status })));

      return filteredData as Client[];
    },
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      prospect: 'bg-blue-100 text-blue-800 border-blue-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
      prospect: 'Prospect',
      active: 'Actieve Klant',
      inactive: 'Niet-actieve Klant'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.prospect}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const handleEditClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setProfileModalOpen(true);
  };

  const handleStatusFilterChange = (value: string) => {
    console.log('Status filter changing to:', value);
    setStatusFilter(value);
  };

  return (
    <>
      <Card className="bg-white border-gray-200">
        <CardContent className="space-y-6 p-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Zoeken op naam of e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-48 bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="Filter op status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">Alle Statussen</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="active">Actieve Klant</SelectItem>
                <SelectItem value="inactive">Niet-actieve Klant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-700">Klant</TableHead>
                  <TableHead className="text-gray-700">Status</TableHead>
                  <TableHead className="text-gray-700">Laatste Sessie</TableHead>
                  <TableHead className="text-gray-700">Totaal Uitgegeven</TableHead>
                  <TableHead className="text-gray-700">Lid Sinds</TableHead>
                  <TableHead className="text-gray-700">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Klanten laden...
                    </TableCell>
                  </TableRow>
                ) : clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Geen klanten gevonden
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{client.name}</div>
                            <div className="text-gray-500 text-xs">{client.email}</div>
                            {client.phone && (
                              <div className="text-gray-500 text-xs">{client.phone}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(client.client_status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {client.last_session_date 
                              ? format(new Date(client.last_session_date), 'dd MMM yyyy', { locale: nl })
                              : 'Nooit'
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">€{client.total_spent?.toFixed(2) || '0,00'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {format(new Date(client.created_at), 'dd MMM yyyy', { locale: nl })}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClient(client.id)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Bewerken
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
