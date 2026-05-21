"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../application/context/AuthContext';
import { ticketService } from '../../infrastructure/services/ticketService';
import { AdminTicket, TicketStatus, GameType } from '../../domain/entities/ticket';
import Navbar from '../../presentation/components/Navbar';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, ShieldCheck, Ticket as TicketIcon, User, Calendar, Hash, Banknote } from 'lucide-react';

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role?.toLowerCase() !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, authLoading, router]);

  const fetchTickets = useCallback(async () => {
    if (!user || user.role?.toLowerCase() !== 'admin') return;
    try {
      setLoading(true);
      const res = await ticketService.getAdminTickets({
        q: search || undefined,
        status: (statusFilter as TicketStatus) || undefined,
        gameType: (typeFilter as GameType) || undefined,
        page,
        pageSize,
      });
      setTickets(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);
    } catch (error) {
      console.error('Error fetching admin tickets', error);
    } finally {
      setLoading(false);
    }
  }, [user, search, statusFilter, typeFilter, page, pageSize]);

  useEffect(() => {
    if (user?.role?.toLowerCase() === 'admin') {
      fetchTickets();
    }
  }, [fetchTickets, user]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, typeFilter]);

  const getStatusStyle = (status: TicketStatus) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Ganado':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Perdido':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (authLoading || !user || user.role?.toLowerCase() !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-6 h-6 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-neutral-950 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-950 tracking-tight">Administración</h1>
            </div>
            <p className="text-sm text-neutral-500">
              {total > 0 ? `${total} boletas registradas en total` : 'Visualiza todas las boletas del sistema'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-6 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por título, número, nombre o email..."
              className="pl-10 w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <select
                className="pl-8 pr-6 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-all appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Ganado">Ganado</option>
                <option value="Perdido">Perdido</option>
              </select>
            </div>

            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <select
                className="pl-8 pr-6 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-all appearance-none cursor-pointer"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                <option value="Lotería">Lotería</option>
                <option value="Rifa">Rifa</option>
                <option value="Sorteo">Sorteo</option>
                <option value="Boleta">Boleta</option>
                <option value="Juego ocasional">Juego ocasional</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
              <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-950 rounded-full animate-spin mb-3"></div>
              <p className="text-sm">Cargando boletas...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-5">
                <TicketIcon className="w-7 h-7 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-950 mb-2">No se encontraron boletas</h3>
              <p className="text-sm text-neutral-500">Prueba ajustando los filtros de búsqueda.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Sorteo</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Detalles</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Dueño</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <TicketIcon className="w-4 h-4 text-neutral-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-neutral-950 truncate">{ticket.title}</p>
                              <p className="text-xs text-neutral-400">{ticket.gameType}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                            {ticket.gameNumber && (
                              <span className="flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                {ticket.gameNumber}
                              </span>
                            )}
                            {ticket.place && (
                              <span className="flex items-center gap-1">
                                <span className="text-neutral-300">·</span>
                                {ticket.place}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="flex items-center gap-1.5 text-sm text-neutral-600">
                            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                            {formatDate(ticket.gameDate)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full border ${getStatusStyle(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-neutral-500" />
                            </div>
                            <div>
                              <p className="text-sm text-neutral-950">{ticket.owner?.name || '—'}</p>
                              <p className="text-xs text-neutral-400">{ticket.owner?.email || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-neutral-700 font-medium">
                          <span className="flex items-center justify-end gap-1">
                            <Banknote className="w-3.5 h-3.5 text-neutral-400" />
                            {ticket.amount ? `$${ticket.amount.toLocaleString('es-CO')}` : '—'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-neutral-50">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 hover:bg-neutral-50/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-neutral-950 truncate">{ticket.title}</h3>
                        <p className="text-xs text-neutral-400 mt-0.5">{ticket.gameType}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border flex-shrink-0 ml-2 ${getStatusStyle(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-neutral-500 mb-3">
                      {ticket.gameNumber && (
                        <div className="flex items-center gap-1.5">
                          <Hash className="w-3 h-3 text-neutral-400" />
                          Número: <span className="text-neutral-700 font-medium">{ticket.gameNumber}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        {formatDate(ticket.gameDate)}
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3 text-neutral-400" />
                          <span className="text-neutral-700 font-medium">{ticket.owner?.name}</span>
                        </div>
                        <span className="text-neutral-300">·</span>
                        <span>{ticket.owner?.email}</span>
                      </div>
                      {ticket.amount && (
                        <div className="font-medium text-neutral-700 flex items-center gap-1">
                          <Banknote className="w-3 h-3 text-neutral-400" />
                          ${ticket.amount.toLocaleString('es-CO')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between">
                  <p className="text-sm text-neutral-400">
                    <span className="font-medium text-neutral-600">{(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)}</span>
                    {' '}de <span className="font-medium text-neutral-600">{total}</span>
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="p-2 text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-neutral-500 px-2 tabular-nums">{page} / {totalPages}</span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="p-2 text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
