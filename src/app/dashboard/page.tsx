"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../application/context/AuthContext';
import { ticketService } from '../../infrastructure/services/ticketService';
import { Ticket, TicketStatus, GameType } from '../../domain/entities/ticket';
import Navbar from '../../presentation/components/Navbar';
import StatsCards from '../../presentation/components/StatsCards';
import TicketFilters from '../../presentation/components/TicketFilters';
import ConfirmModal from '../../presentation/components/ConfirmModal';
import Link from 'next/link';
import {
  Plus,
  Eye,
  Trash2,
  Ticket as TicketIcon,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Hash,
  Banknote,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; ticketId: string | null }>({
    open: false,
    ticketId: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchTickets = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await ticketService.getAll({
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
      console.error('Error fetching tickets', error);
    } finally {
      setLoading(false);
    }
  }, [user, search, statusFilter, typeFilter, page, pageSize]);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [fetchTickets, user]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, typeFilter]);

  const handleDelete = async () => {
    if (!deleteModal.ticketId) return;
    try {
      setDeleting(true);
      await ticketService.delete(deleteModal.ticketId);
      setDeleteModal({ open: false, ticketId: null });
      fetchTickets();
    } catch (error) {
      console.error('Error deleting ticket', error);
      alert('No se pudo eliminar la boleta.');
    } finally {
      setDeleting(false);
    }
  };

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
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  };

  const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const now = new Date();
  const stats = {
    total: total,
    pending: tickets.filter((t) => t.status === 'Pendiente').length,
    won: tickets.filter((t) => t.status === 'Ganado').length,
    upcoming: tickets.filter((t) => new Date(t.gameDate) > now).length,
  };

  if (authLoading || !user) {
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
            <h1 className="text-2xl font-bold text-neutral-950 tracking-tight">Mis Boletas</h1>
            <p className="text-sm text-neutral-500 mt-1">
              {total > 0 ? `${total} registradas` : 'Gestiona tus sorteos y loterías'}
            </p>
          </div>
          <Link
            href="/tickets/new"
            className="group inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl text-white bg-neutral-950 hover:bg-neutral-800 transition-all"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Nueva boleta
          </Link>
        </div>

        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Filters */}
        <TicketFilters
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          gameType={typeFilter}
          onGameTypeChange={setTypeFilter}
        />

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
              <h3 className="text-lg font-semibold text-neutral-950 mb-2">
                {search || statusFilter || typeFilter ? 'No se encontraron boletas' : 'No tienes boletas aún'}
              </h3>
              <p className="text-sm text-neutral-500 max-w-sm mb-6">
                {search || statusFilter || typeFilter
                  ? 'Prueba ajustando los filtros de búsqueda.'
                  : 'Registra tu primera boleta para empezar a hacer seguimiento de tus sorteos.'}
              </p>
              {!search && !statusFilter && !typeFilter && (
                <Link
                  href="/tickets/new"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl text-white bg-neutral-950 hover:bg-neutral-800 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Crear primera boleta
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Sorteo
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Detalles
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-neutral-50/80 transition-colors group">
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
                                <MapPin className="w-3 h-3" />
                                {ticket.place}
                              </span>
                            )}
                            {ticket.amount && (
                              <span className="font-medium text-neutral-700">
                                ${ticket.amount.toLocaleString('es-CO')}
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
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/tickets/${ticket.id}`}
                              className="p-2 text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              title="Ver detalle"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setDeleteModal({ open: true, ticketId: ticket.id })}
                              className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-neutral-50">
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
                        {formatDateTime(ticket.gameDate)}
                      </div>
                      {ticket.place && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          {ticket.place}
                        </div>
                      )}
                      {ticket.amount && (
                        <div className="font-medium text-neutral-700">
                          <Banknote className="w-3 h-3 text-neutral-400 inline mr-1" />
                          ${ticket.amount.toLocaleString('es-CO')}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="flex-1 text-center py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-all"
                      >
                        Ver detalle
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ open: true, ticketId: ticket.id })}
                        className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
                    <span className="text-sm text-neutral-500 px-2 tabular-nums">
                      {page} / {totalPages}
                    </span>
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

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Eliminar boleta"
        message="¿Estás seguro de que quieres eliminar esta boleta? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, ticketId: null })}
        isLoading={deleting}
      />
    </div>
  );
}
