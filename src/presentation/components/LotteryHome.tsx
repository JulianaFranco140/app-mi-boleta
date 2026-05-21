"use client";

import React, { useState } from "react";
import { Ticket, Search, User, Menu, Bell, ChevronRight, Award } from "lucide-react";
import styles from "./LotteryHome.module.css";

export default function LotteryHome() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else if (selectedNumbers.length < 5) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <Award size={28} strokeWidth={2.5} />
            <span>MiBoleta</span>
          </div>
          <nav className={styles.nav}>
            <a href="#" className={styles.active}>Sorteos</a>
            <a href="#">Resultados</a>
            <a href="#">Cómo jugar</a>
          </nav>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconButton}>
            <Search size={20} />
          </button>
          <button className={styles.iconButton}>
            <Bell size={20} />
          </button>
          <button className={styles.profileButton}>
            <User size={20} />
            <span className={styles.avatarText}>Iniciar Sesión</span>
          </button>
          <button className={styles.mobileMenu}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>Jackpot Acumulado</div>
          <h1 className={styles.title}>$250.000.000</h1>
          <p className={styles.subtitle}>
            El gran sorteo de fin de semana est&aacute; por comenzar.
            Selecciona tus n&uacute;meros de la suerte.
          </p>
          <div className={styles.heroTimer}>
            Sorteo en: <strong>2d 14h 30m</strong>
          </div>
        </section>

        {/* Board Section */}
        <section className={styles.boardSection}>
          <div className={styles.boardHeader}>
            <h2>Elige 5 n&uacute;meros</h2>
            <button
              className={styles.randomBtn}
              onClick={() => {
                const randoms = new Set<number>();
                while (randoms.size < 5) {
                  randoms.add(Math.floor(Math.random() * 50) + 1);
                }
                setSelectedNumbers(Array.from(randoms));
              }}
            >
              Selección Aleatoria
            </button>
          </div>
          
          <div className={styles.grid}>
            {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => {
              const isSelected = selectedNumbers.includes(num);
              return (
                <button
                  key={num}
                  className={`${styles.numberBtn} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() => toggleNumber(num)}
                  disabled={selectedNumbers.length >= 5 && !isSelected}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className={styles.boardFooter}>
            <div className={styles.selectionInfo}>
              Seleccionados: {selectedNumbers.length}/5
            </div>
            <button
              className={styles.playButton}
              disabled={selectedNumbers.length < 5}
            >
              <Ticket size={18} />
              Jugar ahora
              <ChevronRight size={18} />
            </button>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className={styles.features}>
          <div className={styles.featureCard}>
            <h3>Resultados Instantáneos</h3>
            <p>Recibe notificaciones inmediatas si eres uno de los ganadores.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Pagos Seguros</h3>
            <p>Múltiples métodos de pago con cifrado de extremo a extremo.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Premios Garantizados</h3>
            <p>Distribución transparente validada por notaría pública.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; 2026 MiBoleta. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
