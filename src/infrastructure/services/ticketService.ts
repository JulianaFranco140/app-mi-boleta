import { apiClient } from '../http/apiClient';

export interface Ticket {
  id?: string;
  title: string;
  gameType: string;
  gameNumber?: string;
  gameDate: string;
  amount?: number;
  place?: string;
  status: string;
  notes?: string;
  createdAt?: string;
}

export const ticketService = {
  getAll: async (): Promise<Ticket[]> => {
    const { data } = await apiClient.get('/tickets');
    return data.data; 
  },
  getById: async (id: string): Promise<Ticket> => {
    const { data } = await apiClient.get(`/tickets/${id}`);
    return data.data;
  },
  create: async (ticket: Ticket): Promise<Ticket> => {
    const { data } = await apiClient.post('/tickets', ticket);
    return data.data;
  },
  update: async (id: string, ticket: Partial<Ticket>): Promise<Ticket> => {
    const { data } = await apiClient.patch(`/tickets/${id}`, ticket);
    return data.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tickets/${id}`);
  }
};
