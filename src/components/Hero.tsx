import { ThumbsUp } from "lucide-react";
import { useState, useEffect, useRef } from 'react'
import logoImg from '@/imports/Denok__Mie_Ayam___Bakso.png'

interface HeroProps {
  onOrderClick: () => void
  storeOpen: boolean
  closeReason: string
}

const slogans = [
  [
    'Aroma sedap mengundang selera,',
    'Rasa kaldu yang sangat terasa.',
    'Membuat hati ingin kembali,',
    'Kenangan lezat tak terganti.',
  ],
  [
    'Dari dapur hingga ke meja,',
    'Kami sajikan dengan penuh rasa.',
    'Sederhana namun istimewa,',
    'Nikmatnya di setiap suasana.',
  ],
  [
    'Bukan sekadar pengisi lapar,',
    'Dibuat dari hati dan sabar.',
    'Ada kehangatan di setiap sajian,',
    'Untuk menciptakan kenyamanan.',
  ],
  [
    'Semangkuk rasa penuh cerita,',
    'Hangat kuahnya, nikmat terasa.',
    'Diracik tulus dengan hati,',
    'Temani langkah setiap hari.',
  ],
]

export default function Hero({
  onOrderClick,
  storeOpen,
  closeReason,
}: HeroProps) {
  const [activeSlogan, setActiveSlogan] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [visible, setVisible] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function goTo(index: number) {
    if (animating || index === activeSlogan) return
    setAnimating(true)
    setVisible(false)
    setTimeout(() => {
      setActiveSlogan(index)
      setVisible(true)
      setAnimating(false)
    }, 700)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setAnimating(true)
      setVisible(false)
      setTimeout(() => {
        setActiveSlogan((prev) => (prev + 1) % slogans.length)
        setVisible(true)
        setAnimating(false)
      }, 450)
    }, 12000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-20 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #621905 0%, #7A2205 50%, #E75304 100%)' }}
    >
      {/* Latar belakang */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #FFBF15 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Delorasi lingkaran */}
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #FFBF15 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #FB8806 0%, transparent 70%)' }} />

      <div className="relative max-w-6xl mx-auto px-4 py-12 flex flex-col lg:flex-row items-center gap-12 min-h-[calc(100vh-80px)]">
        <div className="flex-[1.6] text-center lg:text-left">
          {/* Tampilan logo pada mobile */}
          <div className="flex justify-center lg:hidden mb-6">
            <img src={logoImg} alt="DENOK" className="h-36 object-contain" />
          </div>

          {!storeOpen && (
            <div className="mb-6 rounded-2xl border border-brand-300/40 bg-brand-900/40 backdrop-blur-sm p-4">
              <p className="font-heading font-bold text-brand-300 text-lg">
                KEDAI SEDANG TUTUP
              </p>

              {closeReason && (
                <p className="font-body text-warm-200/80 text-sm mt-1">
                  {closeReason}
                </p>
              )}
            </div>
          )}

          <div className="inline-flex items-center gap-2 bg-brand-300/20 border border-brand-300/40 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-300 animate-pulse" />
            <span className="font-body text-brand-300 text-sm font-medium">Mie Ayam & Bakso DENOK</span>
          </div>

          {/* Slogan */}
          <div
            className={`mb-8 transition-all duration-700 ${visible ? 'slogan-enter' : 'slogan-exit'}`}
            style={{ minHeight: '10rem' }}
          >
            {slogans[activeSlogan].map((line, i) => (
              <p
                key={`${activeSlogan}-${i}`}
                className={`font-heading font-bold leading-tight ${i === 0 || i === 1
                  ? 'text-2xl md:text-3xl lg:text-4xl text-warm-200'
                  : i === 2
                    ? 'text-2xl md:text-3xl lg:text-4xl text-brand-300'
                    : 'text-xl md:text-2xl lg:text-3xl text-warm-200/70'
                  }`
                }
              >
                {line}
              </p>
            ))}
          </div>

          {/* Indikator slogan */}
          <div className="flex justify-center lg:justify-start gap-2 mb-8">
            {slogans.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${i === activeSlogan
                  ? 'w-8 h-2.5 bg-brand-300'
                  : 'w-2.5 h-2.5 bg-warm-200/30 hover:bg-warm-200/50'
                  }`}
              />
            ))}
          </div>

          {/* Pilihan */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <a
              href="#menu"
              className="font-heading font-semibold text-sm px-6 py-3 rounded-full bg-warm-100 text-brand-900 hover:bg-warm-200 transition-all duration-200 hover:scale-105 text-center"
            >
              Lihat Menu
            </a>
            <button
              onClick={onOrderClick}
              className="font-heading font-semibold text-sm px-6 py-3 rounded-full bg-brand-300 text-brand-900 hover:bg-warm-400 transition-all duration-200 hover:scale-105"
            >
              Pesan Sekarang
            </button>
          </div>

          {/* Statistik */}
          <div className="mt-10 flex justify-center lg:justify-start gap-8">
            {[
              { value: '500+', label: 'Pelanggan Puas' },
              { value: '20+', label: 'Menu Pilihan' },
              { value: '4,5★', label: 'Rating Pelanggan' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading font-bold text-xl text-brand-300">{stat.value}</p>
                <p className="font-body text-xs text-warm-200/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gambar hero */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full opacity-30"
              style={{ background: 'radial-gradient(circle, #FFBF15 0%, transparent 70%)', transform: 'scale(1.15)' }} />

            <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-brand-300/50 shadow-2xl float-anim">
              <img
                src="https://i.ibb.co.com/5XVfDhhW/1.png"
                alt="Semangkuk mie ayam bakso DENOK yang lezat"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle at 70% 30%, transparent 50%, rgba(98,25,5,0.3) 100%)' }} />
            </div>

            <div className="absolute -bottom-4 -right-4 bg-brand-300 text-brand-900 font-heading font-bold text-sm px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
              <ThumbsUp
                className="w-4 h-4"
                strokeWidth={2.2}
              />
              <span>Terbaik Purwakarta</span>
            </div>

            <div className="absolute -top-2 -left-2 bg-warm-100 text-brand-900 font-heading font-semibold text-xs px-3 py-1.5 rounded-xl shadow-md">
              • Sejak 2008
            </div>
          </div>
        </div>
      </div>

      {/* Pembagi gelombang */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 60L48 50C96 40 192 20 288 15C384 10 480 20 576 28C672 36 768 42 864 40C960 38 1056 28 1152 22C1248 16 1344 14 1392 13L1440 12V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="#FFFCF7" />
        </svg>
      </div>
    </section>
  )
}
