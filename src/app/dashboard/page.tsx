"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../application/context/AuthContext';
import apiClient from '../../infrastructure/http/apiClient';
import { Ticket as TicketIcon, LogOut, Plus, Settings, Activity } from 'lucide-react';
import Link from 'next/link';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  authorId: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, token, logout, isLoading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (token) {
      fetchTickets();
    }
  }, [token]);

  const fetchTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await apiClient.get('/tickets');
      setTickets(res.data);
    } catch (error) {
      console.error('Error fetching tickets', error);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'closed':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TicketIcon className="w-6 h-6 text-black mr-2" />
              <span className="font-semibold text-neutral-900 tracking-tight">Mi Boleta</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium text-neutral-900">{user.name}</span>
                <span className="text-xs text-neutral-500">{user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-md transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Mis Tickets</h1>
            <p className="text-sm text-neutral-500 mt-1">Gestiona y da seguimiento a tus solicitudes.</p>
          </div>
          <div className="flex space-x-3">
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="inline-flex items-center px-4 py-2 border border-neutral-200 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Panel Admin
              </Link>
            )}
            <Link
              href="/dashboard/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Ticket
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-neutral-200 rounded-lg overflow-hidden">
          {loadingTickets ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
               <div className="w-6 h-6 border-2 border-neutral-300 border-t-black rounded-full animate-spin mb-4"></div>
               <p className="text-sm">Cargando tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4 border border-neutral-100">
                <TicketIcon className="w-8 h-8 text-neutral-300" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 max-w-sm">No tienes tickets.</h3>
              <p className="mt-2 text-sm text-neutral-500 max-w-sm mb-6">
                Crea tu primer ticket para empezar a gestionar tus solicitudes.
              </p>
               <Link
                href="/dashboard/new"
                className="inline-flex items-center px-4 py-2 border border-neutral-200 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 transition-colors"
              >
                Crear Ticket
              </Link>
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
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-neutral-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-neutral-900">{ticket.title}</span>
                          <span className="text-xs text-neutral-500 truncate max-w-xs">{ticket.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-medium rounded-full border ${getStatusStyle(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/dashboard/${ticket.id}`}
                          className="text-neutral-400 hover:text-black transition-colors"
                        >
                          Ver detalles
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
