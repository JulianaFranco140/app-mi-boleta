import React, { useState, useEffect } from 'react';
import apiClient from '../../infrastructure/http/apiClient';

interface TicketFormProps {
  ticketId?: string;
  onSuccess: () => void;
}

export default function TicketForm({ ticketId, onSuccess }: TicketFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('OPEN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ticketId) {
      const fetchTicket = async () => {
        try {
          const res = await apiClient.get(\/tickets/\\);
          setTitle(res.data.title);
          setDescription(res.data.description);
          setStatus(res.data.status);
        } catch (err: any) {
          setError('Error al cargar ticket');
        }
      };
      fetchTicket();
    }
  }, [ticketId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (ticketId) {
        await apiClient.put(\/tickets/\\, { title, description, status });
      } else {
        await apiClient.post('/tickets', { title, description });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md text-center">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
          Asunto
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-colors"
          placeholder="Ej: Problema con módulo de usuario"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-colors"
          placeholder="Describe el problema en detalle..."
        />
      </div>

      {ticketId && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
            Estado
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-colors bg-white"
          >
            <option value="OPEN">Abierto</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="CLOSED">Cerrado</option>
          </select>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white  transition-colors}
        >
          {isLoading ? 'Guardando...' : ticketId ? 'Actualizar Ticket' : 'Crear Ticket'}
        </button>
      </div>
    </form>
  );
}
