"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../application/context/AuthContext';
import { Ticket } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Campos incompletos.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email inválido.');
      return;
    }

    if (password.length < 8) {
      setError('Mínimo 8 caracteres para contraseña.');
      return;
    }

    try {
      setIsLoading(true);
      await register({ name, email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-sm w-full">
        <div className="flex flex-col items-center mb-8">
          <Ticket className="w-8 h-8 mb-4 text-black" />
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Crear tu cuenta
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium text-black hover:underline transition-all">
              Inicia sesión
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100 text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-all"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-all"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              isLoading ? 'bg-neutral-400 cursor-not-allowed' : 'bg-black hover:bg-neutral-800'
            } transition-all mt-4`}
          >
            {isLoading ? 'Registrando...' : 'Continuar con Email'}
          </button>
        </form>
      </div>
    </div>
  );
}
