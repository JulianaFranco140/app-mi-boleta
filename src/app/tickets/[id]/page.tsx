"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../application/context/AuthContext';
import { ticketService, CreateTicketInput } from '../../../infrastructure/services/ticketService';
import { Ticket as TicketType } from '../../../domain/entities/ticket';
import Navbar from '../../../presentation/components/Navbar';
import ConfirmModal from '../../../presentation/components/ConfirmModal';
import Link from 'next/link';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Save,
  X,
  Ticket,
  Calendar,
  Hash,
  MapPin,
  Banknote,
  FileText,
  Tag,
  Clock,
} from 'lucide-react';

const GAME_TYPES = ['Lotería', 'Rifa', 'Sorteo', 'Boleta', 'Juego ocasional'];
const STATUSES = ['Pendiente', 'Ganado', 'Perdido'];

export default function TicketDetailPage() {
  const { id } = useParams() as { id: string };
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Partial<CreateTicketInput>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getById(id);
      setTicket(data);
      setForm({
        title: data.title,
        gameType: data.gameType,
        gameNumber: data.gameNumber,
        gameDate: data.gameDate,
        amount: data.amount,
        place: data.place,
        status: data.status,
        notes: data.notes,
      });
    } catch (error) {
      console.error('Error fetching ticket', error);
      setApiError('No se pudo cargar la boleta.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) {
      fetchTicket();
    }
  }, [user, id]);

  const toLocalDateTime = (isoString: string): string => {
    const d = new Date(isoString);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const toISOString = (localDateTime: string): string => {
    return new Date(localDateTime).toISOString();
  };

  const getStatusStyle = (status: string) => {
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

  const formatDateFull = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (form.title !== undefined && (!form.title || form.title.trim().length < 2)) {
      newErrors.title = 'El nombre del sorteo es obligatorio (mín. 2 caracteres).';
    }
    if (form.amount !== undefined && form.amount !== null) {
      if (isNaN(form.amount) || form.amount < 0) {
        newErrors.amount = 'El valor debe ser un número positivo.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setApiError('');
    if (!validate()) return;
    try {
      setSaving(true);
      const payload: Partial<CreateTicketInput> = { ...form };
      if (payload.gameDate) {
        payload.gameDate = toISOString(payload.gameDate);
      }
      await ticketService.update(id, payload);
      setIsEditing(false);
      fetchTicket();
    } catch (err: any) {
      setApiError(err.response?.data?.error || 'Error al actualizar la boleta.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await ticketService.delete(id);
      setDeleteModalOpen(false);
      router.push('/dashboard');
    } catch (err: any) {
      setApiError(err.response?.data?.error || 'Error al eliminar la boleta.');
      setDeleting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-6 h-6 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-950 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!ticket && !loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <div className="max-w-2xl mx-auto py-20 px-6 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Ticket className="w-7 h-7 text-neutral-400" />
          </div>
          <h1 className="text-xl font-bold text-neutral-950 mb-2">Boleta no encontrada</h1>
          <p className="text-sm text-neutral-500">La boleta que buscas no existe o no tienes acceso.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al dashboard
          </Link>
        </div>
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
          {/* Header */}
          <div className="px-8 py-6 border-b border-neutral-100 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Ticket className="w-5 h-5 text-neutral-700" />
              </div>
              <div className="min-w-0">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={form.title || ''}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className={`w-full text-lg font-bold text-neutral-950 border rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 ${
                        errors.title ? 'border-red-300' : 'border-neutral-200'
                      }`}
                    />
                    {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                  </>
                ) : (
                  <h1 className="text-lg font-bold text-neutral-950 tracking-tight truncate">{ticket?.title}</h1>
                )}
                <p className="text-xs text-neutral-400 mt-0.5">
                  {ticket?.gameType} · Creado el {ticket ? new Date(ticket.createdAt).toLocaleDateString('es-CO') : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setApiError('');
                      setErrors({});
                      if (ticket) {
                        setForm({
                          title: ticket.title,
                          gameType: ticket.gameType,
                          gameNumber: ticket.gameNumber,
                          gameDate: ticket.gameDate,
                          amount: ticket.amount,
                          place: ticket.place,
                          status: ticket.status,
                          notes: ticket.notes,
                        });
                      }
                    }}
                    className="p-2.5 text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl transition-all"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-neutral-950 rounded-xl hover:bg-neutral-800 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2.5 text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl transition-all"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="p-2.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {apiError && (
            <div className="mx-8 mt-6 text-sm text-red-700 bg-red-50 p-3.5 rounded-xl border border-red-100">
              {apiError}
            </div>
          )}

          {/* Content */}
          <div className="px-8 py-6">
            {/* Status badge */}
            <div className="mb-6">
              {isEditing ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-neutral-700">Estado:</span>
                  <select
                    value={form.status || ''}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="px-3 py-1.5 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className={`px-3 py-1.5 inline-flex text-sm font-semibold rounded-full border ${getStatusStyle(ticket?.status || '')}`}>
                  {ticket?.status}
                </span>
              )}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              <InfoField
                icon={Tag}
                label="Tipo de juego"
                value={ticket?.gameType}
                isEditing={isEditing}
                editElement={
                  <select
                    value={form.gameType || ''}
                    onChange={(e) => handleChange('gameType', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950"
                  >
                    <option value="">Seleccionar...</option>
                    {GAME_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                }
              />

              <InfoField
                icon={Hash}
                label="Número jugado"
                value={ticket?.gameNumber}
                emptyText="Sin número"
                isEditing={isEditing}
                editElement={
                  <input
                    type="text"
                    value={form.gameNumber || ''}
                    onChange={(e) => handleChange('gameNumber', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950"
                    placeholder="Ej: 1234"
                  />
                }
              />

              <InfoField
                icon={Calendar}
                label="Fecha del sorteo"
                value={ticket ? formatDateFull(ticket.gameDate) : undefined}
                isEditing={isEditing}
                editElement={
                  <input
                    type="datetime-local"
                    value={form.gameDate ? toLocalDateTime(form.gameDate) : ''}
                    onChange={(e) => handleChange('gameDate', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950"
                  />
                }
              />

              <InfoField
                icon={Banknote}
                label="Valor apostado"
                value={ticket?.amount ? `$${ticket.amount.toLocaleString('es-CO')}` : undefined}
                emptyText="Sin valor"
                isEditing={isEditing}
                editElement={
                  <>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.amount ?? ''}
                      onChange={(e) =>
                        handleChange('amount', e.target.value ? Number(e.target.value) : undefined)
                      }
                      className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-950/10 ${
                        errors.amount ? 'border-red-300' : 'border-neutral-200'
                      }`}
                      placeholder="Ej: 5000"
                    />
                    {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
                  </>
                }
              />

              <InfoField
                icon={MapPin}
                label="Lugar de compra"
                value={ticket?.place}
                emptyText="Sin lugar"
                isEditing={isEditing}
                editElement={
                  <input
                    type="text"
                    value={form.place || ''}
                    onChange={(e) => handleChange('place', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950"
                    placeholder="Ej: Tienda La Esquina"
                  />
                }
              />

              <InfoField
                icon={Clock}
                label="Última actualización"
                value={ticket ? new Date(ticket.updatedAt).toLocaleDateString('es-CO', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }) : undefined}
              />
            </div>

            {/* Notes */}
            <div className="mt-6 pt-6 border-t border-neutral-100">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Notas</span>
              </div>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={form.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 resize-none"
                  placeholder="Notas adicionales..."
                />
              ) : (
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                  <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
                    {ticket?.notes || 'Sin notas adicionales.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Eliminar boleta"
        message={`¿Estás seguro de que quieres eliminar "${ticket?.title}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isLoading={deleting}
      />
    </div>
  );
}

function InfoField({
  icon: Icon,
  label,
  value,
  emptyText = '—',
  isEditing = false,
  editElement,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  emptyText?: string;
  isEditing?: boolean;
  editElement?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{label}</span>
      </div>
      {isEditing && editElement ? (
        <div className="mt-1">{editElement}</div>
      ) : (
        <p className="text-sm text-neutral-950 font-medium">{value || emptyText}</p>
      )}
    </div>
  );
}
