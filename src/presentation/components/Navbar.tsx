"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../application/context/AuthContext';
import { Ticket, LogOut, Settings, Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-neutral-950 rounded-lg flex items-center justify-center">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-neutral-950 tracking-tight text-lg">Mi Boleta</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {user?.role?.toLowerCase() === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            )}
            <div className="h-5 w-px bg-neutral-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-neutral-950 leading-tight">{user?.name}</span>
                <span className="text-[11px] text-neutral-400 capitalize leading-tight">{user?.role}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-6 py-4 space-y-1">
          <div className="flex items-center gap-3 pb-3 mb-2 border-b border-neutral-100">
            <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-neutral-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-950">{user?.name}</p>
              <p className="text-xs text-neutral-400 capitalize">{user?.role}</p>
            </div>
          </div>
          {user?.role?.toLowerCase() === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Administración
            </Link>
          )}
          <button
            onClick={() => { setMobileOpen(false); logout(); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}
