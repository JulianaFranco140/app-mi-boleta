"use client";

import React, { useEffect } from 'react';
import { useAuth } from '../../../application/context/AuthContext';
import { useRouter } from 'next/navigation';
import TicketForm from '../../../presentation/components/TicketForm';

export default function NewTicketPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <TicketForm isEditMode={false} />
    </div>
  );
}