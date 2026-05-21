"use client";

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface TicketFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  gameType: string;
  onGameTypeChange: (value: string) => void;
}

export default function TicketFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  gameType,
  onGameTypeChange,
}: TicketFiltersProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-6 flex flex-col lg:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Buscar por título o número..."
          className="pl-10 w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-all"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <select
            className="pl-8 pr-6 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-all appearance-none cursor-pointer"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Ganado">Ganado</option>
            <option value="Perdido">Perdido</option>
          </select>
        </div>

        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <select
            className="pl-8 pr-6 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-all appearance-none cursor-pointer"
            value={gameType}
            onChange={(e) => onGameTypeChange(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="Lotería">Lotería</option>
            <option value="Rifa">Rifa</option>
            <option value="Sorteo">Sorteo</option>
            <option value="Boleta">Boleta</option>
            <option value="Juego ocasional">Juego ocasional</option>
          </select>
        </div>
      </div>
    </div>
  );
}
