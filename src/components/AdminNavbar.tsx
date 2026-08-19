import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Home, Menu, X } from 'lucide-react'
import logoImg from '@/imports/Denok__Mie_Ayam___Bakso.png'

export default function AdminNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)

    window.addEventListener('scroll', handler)

    return () =>
      window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-900 shadow-lg py-2'
          : 'bg-brand-900/95 py-3'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/admin"
          className="flex items-center gap-2 flex-shrink-0"
        >
          <img
            src={logoImg}
            alt="Mie Ayam & Bakso DENOK"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Beranda */}
        <div className="flex items-center gap-2">

          <Link
            to="/"
            className="flex items-center gap-1.5 bg-brand-300 hover:bg-warm-400 text-brand-900 font-heading font-semibold text-sm px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            <Home size={14} />
            <span className="hidden sm:inline">
              Beranda
            </span>
          </Link>

          {/* Peralihan Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-warm-200 p-1"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-brand-800 border-t border-brand-300/20 px-4 py-3">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 w-full font-heading text-sm font-medium text-warm-200/80 hover:text-brand-300 px-3 py-2 rounded-lg transition-colors"
          >
            <Home size={14} />
            Beranda
          </Link>

        </div>
      )}
    </nav>
  )
}