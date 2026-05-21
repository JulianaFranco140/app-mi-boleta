export type GameType = 'Lotería' | 'Rifa' | 'Sorteo' | 'Boleta' | 'Juego ocasional';
export type TicketStatus = 'Pendiente' | 'Ganado' | 'Perdido';

export interface Ticket {
  id: string;
  title: string;
  gameType: GameType;
  gameNumber?: string;
  gameDate: string;
  amount?: number;
  place?: string;
  status: TicketStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TicketListResponse {
  data: Ticket[];
  meta: TicketMeta;
}

export interface TicketFilters {
  status?: TicketStatus;
  gameType?: GameType;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface AdminTicketOwner {
  id: string;
  name: string;
  email: string;
}

export interface AdminTicket extends Ticket {
  owner: AdminTicketOwner;
}

export interface AdminTicketListResponse {
  data: AdminTicket[];
  meta: TicketMeta;
}

export interface AdminTicketFilters extends TicketFilters {
  userId?: string;
}
