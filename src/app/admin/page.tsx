"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../application/context/AuthContext';
import { ticketService, Ticket } from '../../infrastructure/services/ticketService';
import { ShieldAlert, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAllSystemTickets();
    }
  }, [user]);

  const loadAllSystemTickets = async () => {
    try {
      setLoadingTickets(true);
      // Aqui usamos un endpoint admin simulado o el getAll según tu backend.
      // Puedes adaptar adminService.ts si hay un endpoint específico, 
      // por ahora reutilizaremos la interface, ajusta si es necesario `/admin/tickets`.
      const data = await ticketService.getAll(); 
      setTickets(data);
    } catch (error) {
      console.error('Error cargando gestión admin', error);
    } finally {
      setLoadingTickets(false);
    }
  };

  if (isLoading || !user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Verificando accesos...</div>;

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
        <p className="text-gray-600 mb-6 font-medium text-center">No tienes los privilegios necesarios para ver esta página.</p>
        <Link href="/dashboard" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">Volver al Dashboard</Link>
      </div>
    );
  }

  // Filtrado local
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (ticket.gameNumber && ticket.gameNumber.includes(searchTerm));
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    const matchesType = typeFilter === 'All' || ticket.gameType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            <h1 className="font-bold text-xl tracking-tight">Admin - Mi Boleta</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden sm:block">Admin: {user.name}</span>
            <button onClick={logout} className="px-3 py-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Panel de Control General</h2>
          <p className="text-gray-500 text-sm">Gestiona todos los sorteos registrados en la plataforma.</p>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por título o número..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                title="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm text-gray-700"
              >
                <option value="All">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Ganado">Ganado</option>
                <option value="Perdido">Perdido</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
               <select 
                title="Game Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="py-2 px-3 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm text-gray-700"
              >
                <option value="All">Todos los tipos</option>
                <option value="Lotería">Lotería</option>
                <option value="Rifa">Rifa</option>
                <option value="Sorteo">Sorteo</option>
                <option value="Boleta">Boleta</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla Admin */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Sorteo</th>
                  <th className="px-6 py-4 font-semibold">Tipo</th>
                  <th className="px-6 py-4 font-semibold">Número</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loadingTickets ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Cargando registros...</td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No se encontraron tickets con estos filtros.</td>
                  </tr>
                ) : (
                  filteredTickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">{ticket.id?.substring(0, 8)}...</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{ticket.title}</td>
                      <td className="px-6 py-4 text-gray-600">{ticket.gameType}</td>
                      <td className="px-6 py-4 font-mono text-gray-700">{ticket.gameNumber || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${ticket.status === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 
                            ticket.status === 'Ganado' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}