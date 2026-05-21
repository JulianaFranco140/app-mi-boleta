"use client";

import React, { useEffect, useState, use } from 'react';
import { useAuth } from '../../../application/context/AuthContext';
import { useRouter } from 'next/navigation';
import TicketForm from '../../../presentation/components/TicketForm';
import { ticketService, Ticket } from '../../../infrastructure/services/ticketService';

export default function EditTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loadingTicket, setLoadingTicket] = useState(true);

  const resolvedParams = use(params);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && resolvedParams.id) {
      fetchTicket(resolvedParams.id);
    }
  }, [user, isLoading, router, resolvedParams.id]);

  const fetchTicket = async (id: string) => {
    try {
      const data = await ticketService.getById(id);
      setTicket(data);
    } catch (error) {
      console.error(error);
      router.push('/dashboard');
    } finally {
      setLoadingTicket(false);
    }
  };

  if (isLoading || loadingTicket) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Cargando sorteo...</div>;
  }

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <TicketForm isEditMode={true} initialData={ticket} />
    </div>
  );
}