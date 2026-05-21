import { apiClient } from '../http/apiClient';
import {
  Ticket,
  TicketListResponse,
  TicketFilters,
  AdminTicketListResponse,
  AdminTicketFilters,
} from '../../domain/entities/ticket';

export interface CreateTicketInput {
  title: string;
  gameType: string;
  gameNumber?: string;
  gameDate: string;
  amount?: number;
  place?: string;
  status: string;
  notes?: string;
}

export const ticketService = {
  getAll: async (filters?: TicketFilters): Promise<TicketListResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.gameType) params.append('gameType', filters.gameType);
      if (filters.q) params.append('q', filters.q);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.pageSize) params.append('pageSize', String(filters.pageSize));
    }
    const query = params.toString();
    const { data } = await apiClient.get(`/tickets${query ? `?${query}` : ''}`);
    return data;
  },

  getById: async (id: string): Promise<Ticket> => {
    const { data } = await apiClient.get(`/tickets/${id}`);
    return data.data;
  },

  create: async (ticket: CreateTicketInput): Promise<Ticket> => {
    const { data } = await apiClient.post('/tickets', ticket);
    return data.data;
  },

  update: async (id: string, ticket: Partial<CreateTicketInput>): Promise<Ticket> => {
    const { data } = await apiClient.put(`/tickets/${id}`, ticket);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tickets/${id}`);
  },

  getAdminTickets: async (filters?: AdminTicketFilters): Promise<AdminTicketListResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.gameType) params.append('gameType', filters.gameType);
      if (filters.q) params.append('q', filters.q);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.pageSize) params.append('pageSize', String(filters.pageSize));
    }
    const query = params.toString();
    const { data } = await apiClient.get(`/admin/tickets${query ? `?${query}` : ''}`);
    return data;
  },
};
