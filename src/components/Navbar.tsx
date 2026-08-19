import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from 'react'
import logoImg from '@/imports/Denok__Mie_Ayam___Bakso.png'

interface NavbarProps {
  cartCount: number
  onCartClick: () => void
}

const navLinks = [
  { label: 'Beranda', href: '#hero' },
  { label: 'Tentang', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Cara Pesan', href: '#cara-pesan' },
  { label: 'Galeri', href: '#gallery' },
  { label: 'Testimoni', href: '#testimoni' },
  { label: 'Lokasi', href: '#location' },
]

export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-brand-900 shadow-lg py-2' : 'bg-brand-900/95 py-3'
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/admin" className="flex items-center gap-2 flex-shrink-0">
          <img src={logoImg} alt="Mie Ayam & Bakso DENOK" className="h-10 w-auto object-contain" />
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-heading text-sm font-medium text-warm-200/80 hover:text-brand-300 px-3 py-2 rounded-lg transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Cart + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCartClick}
            className="relative flex items-center gap-2 bg-brand-300 hover:bg-warm-400 text-brand-900 font-heading font-semibold text-sm px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            <ShoppingCart
              className="w-4 h-4 text-brand-900"
              strokeWidth={2.5}
            />
            <span className="hidden sm:inline">Keranjang</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-warm-200 p-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-brand-800 border-t border-brand-300/20 px-4 py-3">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block font-heading text-sm font-medium text-warm-200/80 hover:text-brand-300 px-3 py-2 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
