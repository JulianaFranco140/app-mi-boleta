"use client";

import React from 'react';
import { Ticket, Clock, Trophy, AlertCircle } from 'lucide-react';

interface Stats {
  total: number;
  pending: number;
  won: number;
  upcoming: number;
}

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total',
      value: stats.total,
      icon: Ticket,
      bg: 'bg-neutral-100',
      iconColor: 'text-neutral-700',
    },
    {
      label: 'Pendientes',
      value: stats.pending,
      icon: AlertCircle,
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Ganados',
      value: stats.won,
      icon: Trophy,
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Próximos',
      value: stats.upcoming,
      icon: Clock,
      bg: 'bg-sky-50',
      iconColor: 'text-sky-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white border border-neutral-200 rounded-xl p-5 flex items-center gap-4 hover:border-neutral-300 transition-colors"
        >
          <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-950 tabular-nums">{card.value}</p>
            <p className="text-xs text-neutral-500 font-medium">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
