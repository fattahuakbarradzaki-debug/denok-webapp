import {
  Beef,
  Soup,
  CookingPot,
  Sparkles,
  Bike,
  Wallet,
} from "lucide-react";

const features = [
  {
    icon: Beef,
    title: 'Daging Sapi Pilihan',
    desc: 'Setiap bakso dibuat dari daging sapi segar berkualitas tinggi, dijamin kenyal dan gurih serta bikin nagih.',
    color: 'bg-brand-900',
    textColor: 'text-warm-400',
  },
  {
    icon: Soup,
    title: 'Mie Lembut Sempurna',
    desc: 'Mie dibuat segar setiap hari dengan tekstur kenyal dan lembut yang pas, bukan sekedar mie biasa.',
    color: 'bg-brand-800',
    textColor: 'text-warm-400',
  },
  {
    icon: CookingPot,
    title: 'Kuah Kaldu Spesial',
    desc: 'Kuah dimasak selama berjam-jam dari tulang sapi pilihan menghasilkan rasa gurih yang mendalam.',
    color: 'bg-brand-600',
    textColor: 'text-warm-400',
  },
  {
    icon: Sparkles,
    title: 'Bumbu Rahasia',
    desc: 'Perpaduan rempah-rempah pilihan dalam resep rahasia keluarga yang membuat cita rasa DENOK tak tertandingi.',
    color: 'bg-brand-500',
    textColor: 'text-brand-900',
  },
  {
    icon: Bike,
    title: 'Layanan Delivery',
    desc: 'Pesan dari rumah dan nikmati kelezatan DENOK diantar langsung ke pintu Anda, masih hangat dan fresh.',
    color: 'bg-brand-300',
    textColor: 'text-brand-900',
  },
  {
    icon: Wallet,
    title: 'Harga Bersahabat',
    desc: 'Kenikmatan kuliner premium dengan harga yang terjangkau untuk semua kalangan masyarakat Purwakarta.',
    color: 'bg-warm-400',
    textColor: 'text-brand-900',
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-warm-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-900/10 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            <span className="font-body text-brand-900 text-sm font-medium">Keunggulan Kami</span>
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-900 leading-tight">
            Kenapa Pilih <span className="text-brand-600">DENOK?</span>
          </h2>
          <p className="font-body text-neutral-900/60 text-base mt-3 max-w-xl mx-auto">
            Kami bukan sekadar warung mie. Kami adalah pengalaman kuliner yang menyentuh hati
            dan memuaskan selera.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`${feature.color} ${feature.textColor} rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-200`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mb-4">
                <feature.icon
                  className={`
                    w-10 h-10
                    ${feature.textColor}
                  `}
                  strokeWidth={2.2}
                />
              </div>
              <h3 className={`font-heading font-bold text-lg mb-2 ${feature.textColor}`}>
                {feature.title}
              </h3>
              <p className={`font-body text-sm leading-relaxed opacity-80 ${feature.textColor}`}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
