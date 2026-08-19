import {
  Leaf,
  ChefHat,
  Heart,
  Zap,
} from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-warm-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image collage */}
          <div className="relative h-96 lg:h-auto">
            <div className="grid grid-cols-2 gap-3 h-80 lg:h-96">
              <div className="row-span-2 rounded-2xl overflow-hidden">
                <img
                  src="https://i.ibb.co.com/pBfwD1pS/3.png"
                  alt="Semangkuk mie ayam DENOK dengan topping lengkap"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="https://i.ibb.co.com/5XVfDhhW/1.png"
                  alt="Bakso sapi kenyal khas DENOK"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="https://i.ibb.co.com/k6VKGq0s/2.png"
                  alt="Sajian spesial Mie Ayam DENOK"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="absolute -bottom-4 left-4 lg:-bottom-6 bg-brand-900 text-warm-200 rounded-2xl px-5 py-4 shadow-xl">
              <p className="font-heading font-bold text-brand-300 text-2xl">18+ Tahun</p>
              <p className="font-body text-xs text-warm-200/70">Melayani dengan Sepenuh Hati</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-300/15 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
              <span className="font-body text-brand-900 text-sm font-medium">Tentang Kami</span>
            </div>

            <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-900 mb-4 leading-tight">
              Warung Kecil dengan{' '}
              <span className="text-brand-600">Cita Rasa Besar</span>
            </h2>

            <p className="font-body text-neutral-900/70 text-base leading-relaxed mb-4">
              Mie Ayam & Bakso DENOK berdiri sejak tahun 2008 di Purwakarta, Jawa Barat. Berawal dari
              warung bakso kecil di pinggir jalan, kini DENOK telah menjadi salah satu kuliner favorit
              masyarakat Purwakarta yang terus dicintai dari generasi ke generasi.
            </p>

            <p className="font-body text-neutral-900/70 text-base leading-relaxed mb-6">
              Kami menggunakan bahan-bahan segar pilihan dan resep turun-temurun yang terjaga keasliannya.
              Setiap mangkuk dibuat dengan penuh cinta dan dedikasi untuk memberikan pengalaman makan
              yang tak terlupakan bagi seluruh pelanggan kami.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Leaf, title: 'Bahan Segar', desc: 'Dipilih langsung setiap hari' },
                { icon: ChefHat, title: 'Resep Autentik', desc: 'Turun-temurun sejak 2008' },
                { icon: Heart, title: 'Dibuat Dengan Cinta', desc: 'Setiap sajian penuh perhatian' },
                { icon: Zap, title: 'Pelayanan Cepat', desc: 'Disajikan dalam hitungan menit' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 p-3 bg-warm-200 rounded-xl">
                  <div className="w-11 h-11 rounded-xl bg-brand-300/20 flex items-center justify-center flex-shrink-0">
                    <item.icon
                      className="w-5 h-5 text-brand-900"
                      strokeWidth={2.2}
                    />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-brand-900 text-sm">{item.title}</p>
                    <p className="font-body text-neutral-900/60 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
