"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../application/context/AuthContext';
import apiClient from '../../infrastructure/http/apiClient';
import { Ticket as TicketIcon, LogOut, Search, Filter, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  authorId: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function AdminPage() {
  const { user, token, logout, isLoading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (token && user?.role === 'ADMIN') {
      fetchTickets();
    }
  }, [token, user]);

  const fetchTickets = async () => {
    try {
      setLoadingTickets(true);
      // Admin route fetch...
      const res = await apiClient.get('/admin/tickets');
      setTickets(res.data);
    } catch (error) {
      console.error('Error fetching admin tickets', error);
    } finally {
      setLoadingTickets(false);
    }
  };

  if (isLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-neutral-100 text-neutral-800 border border-neutral-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'closed':
        return 'bg-green-50 text-green-700 border border-green-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border border-neutral-200';
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <ShieldCheck className="w-6 h-6 text-black mr-2" />
              <span className="font-semibold text-neutral-900 tracking-tight">Administración Central</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-sm font-medium text-neutral-500 hover:text-black transition-colors flex items-center">
                 <ArrowLeft className="w-4 h-4 mr-1"/> Volver
              </Link>
              <div className="h-4 w-px bg-neutral-200 mx-2"></div>
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium text-neutral-900">{user.name}</span>
                <span className="text-xs text-neutral-500">{user.role}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mb-2">Visión General</h1>
          <p className="text-sm text-neutral-500">Supervisa todos los tickets del sistema.</p>
        </div>

        <div className="bg-white shadow-sm border border-neutral-200 rounded-lg overflow-hidden mb-8">
          <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar tickets..."
                className="pl-10 w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-neutral-400" />
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm rounded-md bg-white transition-colors"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Todos los Estados</option>
                <option value="OPEN">Abiertos</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="CLOSED">Cerrados</option>
              </select>
            </div>
          </div>

          {loadingTickets ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-6 h-6 border-2 border-neutral-300 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Asunto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-100">
                  {filteredTickets.length > 0 ? (
                     filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-neutral-900">{ticket.title}</span>
                            <span className="text-xs text-neutral-500 truncate max-w-xs">{ticket.description}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900">{ticket.user?.name || 'Desconocido'}</div>
                          <div className="text-xs text-neutral-500">{ticket.user?.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={px-2.5 py-1 inline-flex text-xs leading-4 font-medium rounded-full }>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            href={/admin/tickets/}
                            className="text-neutral-400 hover:text-black transition-colors px-3 py-1 border border-neutral-200 rounded-md"
                          >
                            Gestionar
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-neutral-500">
                         No se encontraron tickets con los filtros actuales.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
