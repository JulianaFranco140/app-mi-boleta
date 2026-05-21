"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket, ticketService } from '../../infrastructure/services/ticketService';
import { ArrowLeft, Save, Trash2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface TicketFormProps {
  initialData?: Ticket;
  isEditMode?: boolean;
}

export default function TicketForm({ initialData, isEditMode = false }: TicketFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<Partial<Ticket>>({
    title: '',
    gameType: 'Lotería',
    gameNumber: '',
    gameDate: new Date().toISOString().split('T')[0],
    amount: '' as any,
    place: '',
    status: 'Pendiente',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        gameDate: new Date(initialData.gameDate).toISOString().split('T')[0]
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' && value !== '' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.gameType || !formData.gameDate || !formData.status) {
      setError('Por favor llena los campos obligatorios (Título, Tipo, Fecha, Estado).');
      return;
    }

    try {
      setIsLoading(true);
      // Ensure date is ISO
      const payload = {
        ...formData,
        gameDate: new Date(formData.gameDate!).toISOString(),
        amount: formData.amount ? Number(formData.amount) : undefined
      } as Ticket;

      if (isEditMode && initialData?.id) {
        await ticketService.update(initialData.id, payload);
      } else {
        await ticketService.create(payload);
      }
      
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al guardar el sorteo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm('¿Estás seguro de que deseas eliminar este sorteo?')) return;

    try {
      setIsLoading(true);
      await ticketService.delete(initialData.id);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Error al eliminar el sorteo');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-2xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </Link>
        {isEditMode && (
          <button 
            type="button" 
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        )}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Editar Sorteo' : 'Registrar Nuevo Sorteo'}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 text-sm mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Sorteo <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="Ej: Lotería de Medellín, Sorteo del carro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Juego <span className="text-red-500">*</span></label>
            <select
              name="gameType"
              value={formData.gameType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            >
              <option value="Lotería">Lotería</option>
              <option value="Rifa">Rifa</option>
              <option value="Sorteo">Sorteo</option>
              <option value="Boleta">Boleta</option>
              <option value="Juego ocasional">Juego ocasional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado <span className="text-red-500">*</span></label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Ganado">Ganado</option>
              <option value="Perdido">Perdido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del Sorteo <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="gameDate"
              value={formData.gameDate || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número Jugado <span className="text-gray-400 text-xs font-normal">(Opcional)</span></label>
            <input
              type="text"
              name="gameNumber"
              value={formData.gameNumber || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-mono"
              placeholder="1234"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lugar de Compra <span className="text-gray-400 text-xs font-normal">(Opcional)</span></label>
            <input
              type="text"
              name="place"
              value={formData.place || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="Centro comercial, Amigo, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor Apostado ($) <span className="text-gray-400 text-xs font-normal">(Opcional)</span></label>
            <input
              type="number"
              name="amount"
              min="0"
              step="any"
              value={formData.amount || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="0.00"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales <span className="text-gray-400 text-xs font-normal">(Opcional)</span></label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
              placeholder="Premio a ganar, detalles del vendedor..."
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold text-sm ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5'
            } transition-all`}
          >
            <Save className="w-5 h-5" />
            {isLoading ? 'Guardando...' : 'Guardar Sorteo'}
          </button>
        </div>
      </form>
    </div>
  );
}