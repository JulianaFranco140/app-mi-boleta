import Link from 'next/link';
import { Ticket } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-200">
      {/* HEADER MINIMALISTA */}
      <header className="border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <Ticket className="w-5 h-5" />
            <span>Mi Boleta</span>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/login" className="text-neutral-600 hover:text-black transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="bg-black text-white px-4 py-2 rounded-md hover:bg-neutral-800 transition-colors">
              Registrarse
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION ESTILO NOTION/VERCEL */}
      <main className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-neutral-900 mb-6 leading-tight">
            "¿Y si sí me lo gané... <br className="text-neutral-400" /> y nunca revisé?"
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-10 leading-relaxed max-w-2xl">
            Un espacio centralizado para registrar, organizar y hacer seguimiento a todas tus rifas, loterías y boletas. 
            Sin distracciones. Todo bajo control.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/register" className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-neutral-800 transition-colors text-center">
              Comenzar ahora
            </Link>
            <Link href="/login" className="w-full sm:w-auto bg-white text-black border border-neutral-200 px-6 py-3 rounded-md font-medium hover:bg-neutral-50 transition-colors text-center">
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        {/* COMPARACIÓN MINIMALISTA */}
        <div className="mt-32 grid md:grid-cols-2 gap-8 border-t border-neutral-200 pt-16">
          <div className="border border-neutral-200 rounded-xl p-8 bg-neutral-50/50">
            <h2 className="font-semibold text-lg mb-6">El problema</h2>
            <ul className="space-y-4 text-neutral-600">
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Llega la fecha del sorteo y no sabes dónde dejaste la boleta física.
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Le compraste a un amigo y olvidaste anotar el número.
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Soñaste un número, lo jugaste y olvidaste consultar los resultados.
              </li>
            </ul>
          </div>

          <div className="border border-neutral-200 rounded-xl p-8 bg-white">
            <h2 className="font-semibold text-lg mb-6">Con Mi Boleta</h2>
            <ul className="space-y-4 text-neutral-600">
              <li className="flex gap-3">
                <span className="text-black">✓</span>
                Registro rápido y estructurado en la nube en segundos.
              </li>
              <li className="flex gap-3">
                <span className="text-black">✓</span>
                Historial completo con las fechas exactas y los números jugados a la mano.
              </li>
              <li className="flex gap-3">
                <span className="text-black">✓</span>
                Control total sobre tus resultados (ganado, perdido o pendiente).
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 py-12 mt-16">
        <div className="max-w-5xl mx-auto px-6 text-sm text-neutral-500 flex justify-between">
          <span>&copy; 2026 Mi Boleta. Todos los derechos reservados.</span>
          <span>Minimalismo y control.</span>
        </div>
      </footer>
    </div>
  );
}
