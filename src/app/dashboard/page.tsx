"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../application/context/AuthContext';
import { ticketService, Ticket } from '../../infrastructure/services/ticketService';
import { Ticket as TicketIcon, Clock, CalendarDays, CheckCircle, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  const loadTickets = async () => {
    try {
      setLoadingTickets(true);
      const data = await ticketService.getAll();
      setTickets(data);
    } catch (error) {
      console.error('Error cargando los tickets', error);
    } finally {
      setLoadingTickets(false);
    }
  };

  const getMetrics = () => {
    const total = tickets.length;
    let pending = 0;
    let upcoming = 0;
    
    const now = new Date();
    
    tickets.forEach(t => {
      if (t.status === 'Pendiente') pending++;
      const gameDate = new Date(t.gameDate);
      if (gameDate > now) upcoming++;
    });

    return { total, pending, upcoming };
  };

  if (isLoading || !user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Cargando perfil...</div>;

  const metrics = getMetrics();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TicketIcon className="w-6 h-6 text-blue-200" />
            <h1 className="font-bold text-xl tracking-tight">Mi Boleta</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden sm:block">Hola, {user.name}</span>
            <button onClick={logout} className="flex items-center gap-2 px-3 py-2 bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium">
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Resumen y Métricas</h2>
            <p className="text-gray-500 text-sm">Controla tus sorteos desde aquí.</p>
          </div>
          <Link href="/tickets/new" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-sm hover:bg-blue-700 transition">
            + Nuevo Registro
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card Total */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex justify-center items-center shrink-0">
              <TicketIcon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Juegos Registrados</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.total}</p>
            </div>
          </div>
          
          {/* Card Proximos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex justify-center items-center shrink-0">
              <CalendarDays className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Próximos Sorteos</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.upcoming}</p>
            </div>
          </div>

          {/* Card Pendientes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex justify-center items-center shrink-0">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Juegos Pendientes</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.pending}</p>
            </div>
          </div>
        </div>

        {/* Historial Reciente */}
        <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Historial Completo</h3>
        {loadingTickets ? (
          <div className="bg-white p-8 rounded-xl text-center shadow-sm border border-gray-100 text-gray-500">
            Cargando historial...
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white p-12 rounded-xl text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex justify-center items-center mb-4">
              <TicketIcon className="w-8 h-8" />
            </div>
            <p className="text-gray-600 text-lg font-medium mb-1">Aún no tienes registros</p>
            <p className="text-gray-400 text-sm mb-6">Empieza a llevar el control de tus sorteos añadiendo uno nuevo.</p>
            <Link href="/tickets/new" className="text-blue-600 font-semibold hover:underline">
              Ir a registrar juego &rarr;
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Sorteo</th>
                    <th className="px-6 py-4 font-semibold">Tipo</th>
                    <th className="px-6 py-4 font-semibold">Número</th>
                    <th className="px-6 py-4 font-semibold">Fecha Sorteo</th>
                    <th className="px-6 py-4 font-semibold">Estado</th>
                    <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{ticket.title}</td>
                      <td className="px-6 py-4 text-gray-600">{ticket.gameType}</td>
                      <td className="px-6 py-4 font-mono text-gray-700">{ticket.gameNumber || '-'}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(ticket.gameDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${ticket.status === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 
                            ticket.status === 'Ganado' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/tickets/${ticket.id}`} className="text-blue-600 hover:underline font-medium text-sm">
                          Ver / Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
