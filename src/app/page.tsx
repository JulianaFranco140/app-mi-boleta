import Link from 'next/link';
import { Ticket, ShieldCheck, Clock, SearchX, Frown, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* HEADER */}
      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2 text-blue-700">
            <Ticket className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">Mi Boleta</span>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6 mt-8">
            "¿Y si sí me lo gané... <br className="hidden md:block"/> 
            <span className="text-blue-600">y nunca revisé?</span>"
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Dile adiós a olvidar qué número jugaste, la fecha del sorteo o a perder esa boleta física. Centraliza todas tus rifas, loterías y sorteos en un solo lugar.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              Empieza ahora, es gratis
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-blue-700 border border-blue-200 font-bold rounded-lg shadow-sm hover:bg-blue-50 transition-all"
            >
              Ya tengo una cuenta
            </Link>
          </div>
        </div>

        {/* EL PROBLEMA VS LA SOLUCION */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* El problema */}
              <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
                <div className="flex items-center gap-3 text-red-600 mb-6">
                  <Frown className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">La forma antigua</h2>
                </div>
                <ul className="space-y-4 text-red-900">
                  <li className="flex items-start gap-3">
                    <SearchX className="w-6 h-6 shrink-0 opacity-70" />
                    <span>Llega la fecha y no sabes dónde dejaste la boleta que compraste en el centro comercial.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <SearchX className="w-6 h-6 shrink-0 opacity-70" />
                    <span>Le compraste a un amigo y olvidaste anotar el número.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <SearchX className="w-6 h-6 shrink-0 opacity-70" />
                    <span>Soñaste un número, lo jugaste y olvidaste revisar el sorteo.</span>
                  </li>
                </ul>
              </div>

              {/* La solucion */}
              <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3 text-blue-600 mb-6">
                  <CheckCircle className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Con Mi Boleta</h2>
                </div>
                <ul className="space-y-4 text-blue-900">
                  <li className="flex items-start gap-3">
                    <Ticket className="w-6 h-6 shrink-0 opacity-70" />
                    <span>Registras la boleta en 10 segundos desde tu celular.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-6 h-6 shrink-0 opacity-70" />
                    <span>Tienes siempre a la mano la fecha exacta del sorteo y el número jugado.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 shrink-0 opacity-70" />
                    <span>Revisas el historial y actualizas si ganaste o perdiste. Todo bajo control.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2026 Mi Boleta. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
