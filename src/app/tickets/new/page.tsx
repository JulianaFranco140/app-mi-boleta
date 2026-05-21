"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../application/context/AuthContext';
import { ticketService, CreateTicketInput } from '../../../infrastructure/services/ticketService';
import Navbar from '../../../presentation/components/Navbar';
import Link from 'next/link';
import { ArrowLeft, Ticket, ArrowRight } from 'lucide-react';

const GAME_TYPES = ['Lotería', 'Rifa', 'Sorteo', 'Boleta', 'Juego ocasional'];
const STATUSES = ['Pendiente', 'Ganado', 'Perdido'];

export default function NewTicketPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<CreateTicketInput>({
    title: '',
    gameType: '',
    gameNumber: '',
    gameDate: '',
    amount: undefined,
    place: '',
    status: 'Pendiente',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.title || form.title.trim().length < 2) {
      newErrors.title = 'El nombre del sorteo es obligatorio (mín. 2 caracteres).';
    }
    if (!form.gameType) {
      newErrors.gameType = 'Selecciona un tipo de juego.';
    }
    if (!form.gameDate) {
      newErrors.gameDate = 'La fecha del sorteo es obligatoria.';
    }
    if (form.amount !== undefined && form.amount !== null) {
      if (isNaN(form.amount) || form.amount < 0) {
        newErrors.amount = 'El valor debe ser un número positivo.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CreateTicketInput, value: string | number | undefined) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toISOString = (localDateTime: string): string => {
    return new Date(localDateTime).toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload: CreateTicketInput = {
        ...form,
        gameDate: toISOString(form.gameDate),
        amount: form.amount ? Number(form.amount) : undefined,
      };
      await ticketService.create(payload);
      router.push('/dashboard');
    } catch (err: any) {
      setApiError(err.response?.data?.error || 'Error al crear la boleta.');
    } finally {
      setSubmitting(false);
    }
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

      <main className="max-w-2xl mx-auto py-8 px-6">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Volver al dashboard
          </Link>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center">
                <Ticket className="w-5 h-5 text-neutral-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-950 tracking-tight">Nueva Boleta</h1>
                <p className="text-sm text-neutral-500">Registra los datos de tu sorteo.</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6">
            {apiError && (
              <div className="mb-6 text-sm text-red-700 bg-red-50 p-3.5 rounded-xl border border-red-100">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section: Información básica */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                  Información del sorteo
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Nombre del sorteo <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={form.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className={`w-full px-4 py-2.5 bg-neutral-50 border rounded-xl text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-all ${
                        errors.title ? 'border-red-300 focus:ring-red-100' : 'border-neutral-200'
                      }`}
                      placeholder="Ej: Lotería de Medellín"
                    />
                    {errors.title && <p className="mt-1.5 text-xs text-red-600">{errors.title}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gameType" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Tipo de juego <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="gameType"
                        value={form.gameType}
                        onChange={(e) => handleChange('gameType', e.target.value)}
                        className={`w-full px-4 py-2.5 bg-neutral-50 border rounded-xl text-sm text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-all appearance-none ${
                          errors.gameType ? 'border-red-300 focus:ring-red-100' : 'border-neutral-200'
                        }`}
                      >
                        <option value="">Seleccionar...</option>
                        {GAME_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {errors.gameType && <p className="mt-1.5 text-xs text-red-600">{errors.gameType}</p>}
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Estado <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="status"
                        value={form.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-all appearance-none"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Detalles */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                  Detalles de la jugada
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gameNumber" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Número jugado
                      </label>
                      <input
                        id="gameNumber"
                        type="text"
                        value={form.gameNumber || ''}
                        onChange={(e) => handleChange('gameNumber', e.target.value)}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-all"
                        placeholder="Ej: 1234"
                      />
                    </div>

                    <div>
                      <label htmlFor="gameDate" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Fecha del sorteo <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="gameDate"
                        type="datetime-local"
                        value={form.gameDate}
                        onChange={(e) => handleChange('gameDate', e.target.value)}
                        className={`w-full px-4 py-2.5 bg-neutral-50 border rounded-xl text-sm text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-all ${
                          errors.gameDate ? 'border-red-300 focus:ring-red-100' : 'border-neutral-200'
                        }`}
                      />
                      {errors.gameDate && <p className="mt-1.5 text-xs text-red-600">{errors.gameDate}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Valor apostado
                      </label>
                      <input
                        id="amount"
                        type="number"
                        min="0"
                        step="any"
                        value={form.amount ?? ''}
                        onChange={(e) => handleChange('amount', e.target.value ? Number(e.target.value) : undefined)}
                        className={`w-full px-4 py-2.5 bg-neutral-50 border rounded-xl text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-all ${
                          errors.amount ? 'border-red-300 focus:ring-red-100' : 'border-neutral-200'
                        }`}
                        placeholder="Ej: 5000"
                      />
                      {errors.amount && <p className="mt-1.5 text-xs text-red-600">{errors.amount}</p>}
                    </div>

                    <div>
                      <label htmlFor="place" className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Lugar de compra
                      </label>
                      <input
                        id="place"
                        type="text"
                        value={form.place || ''}
                        onChange={(e) => handleChange('place', e.target.value)}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-all"
                        placeholder="Ej: Tienda La Esquina"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Notas */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                  Notas adicionales
                </h3>
                <textarea
                  id="notes"
                  rows={3}
                  value={form.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-all resize-none"
                  placeholder="Ej: Soñé con el número la semana pasada..."
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium rounded-xl text-white bg-neutral-950 hover:bg-neutral-800 transition-all disabled:bg-neutral-400 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span>Guardando...</span>
                  ) : (
                    <>
                      <span>Guardar Boleta</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
                <Link
                  href="/dashboard"
                  className="flex-1 text-center py-2.5 px-4 border border-neutral-200 text-sm font-medium rounded-xl text-neutral-700 bg-white hover:bg-neutral-50 transition-all"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
