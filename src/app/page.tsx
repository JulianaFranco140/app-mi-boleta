import Link from "next/link";
import {
  Ticket,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Bell,
  Shield,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-neutral-950 rounded-lg flex items-center justify-center">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-neutral-950 text-lg tracking-tight">
              Mi Boleta
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-950 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="ml-2 px-4 py-2 text-sm font-medium text-white bg-neutral-950 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Registrarse
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-600 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Gestiona todos tus sorteos en un solo lugar
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-neutral-950 leading-[1.1] mb-6">
              ¿Y si sí me lo gané y nunca revisé?
            </h1>
            <p className="text-lg text-neutral-500 leading-relaxed mb-10 max-w-lg">
              Registra tus boletas, rifas y loterías. Mantén el control de
              fechas, números y resultados en un solo lugar.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-neutral-950 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-all"
              >
                Comenzar gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 border-t border-neutral-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: LayoutDashboard,
                title: "Todo organizado",
                desc: "Registra el nombre, número, fecha y lugar de cada boleta de forma estructurada.",
              },
              {
                icon: CheckCircle2,
                title: "Seguimiento claro",
                desc: "Marca el estado de cada jugada: Pendiente, Ganado o Perdido. Visualiza tu historial completo.",
              },
              {
                icon: Bell,
                title: "Nunca olvides",
                desc: "Consulta tus próximos sorteos y mantén todas tus fechas importantes a la mano.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 bg-white rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-colors"
              >
                <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-neutral-200 transition-colors">
                  <feature.icon className="w-5 h-5 text-neutral-700" />
                </div>
                <h3 className="font-semibold text-neutral-950 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-6 border-t border-neutral-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 bg-white rounded-2xl border border-neutral-200">
              <h2 className="font-semibold text-lg text-neutral-950 mb-6">
                Sin organización
              </h2>
              <ul className="space-y-4">
                {[
                  "Pierdes la boleta física cuando más la necesitas",
                  "Olvidas el número que jugaste y con quién lo compraste",
                  "No recuerdas cuándo es el próximo sorteo",
                  "Terminas con papeles y notas sin sentido por todas partes",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm text-neutral-500"
                  >
                    <span className="text-neutral-300 mt-0.5">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-neutral-950 rounded-2xl text-white">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5" />
                <h2 className="font-semibold text-lg">Con Mi Boleta</h2>
              </div>
              <ul className="space-y-4">
                {[
                  "Todas tus boletas guardadas en la nube, accesibles desde cualquier dispositivo",
                  "Números, fechas y lugares siempre organizados y fáciles de encontrar",
                  "Dashboard con próximos sorteos y estados de todas tus jugadas",
                  "Interfaz limpia y minimalista, sin distracciones innecesarias",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm text-neutral-400"
                  >
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-white flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-neutral-200/60">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <div className="w-6 h-6 bg-neutral-950 rounded-md flex items-center justify-center">
              <Ticket className="w-3 h-3 text-white" />
            </div>
            <span>Mi Boleta</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
