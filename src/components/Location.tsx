import {
  MapPin,
  Clock3,
  Phone,
} from 'lucide-react'

export default function Location() {
  return (
    <section id="location" className="py-20 bg-warm-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-900/10 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            <span className="font-body text-brand-900 text-sm font-medium">Lokasi</span>
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-900 leading-tight">
            Temukan Kami di <span className="text-brand-600">Purwakarta</span>
          </h2>
          <p className="font-body text-neutral-900/60 text-base mt-3">
            Kunjungi langsung atau pesan melalui WhatsApp untuk layanan delivery.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 items-start">
          {/* Info cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {[
              {
                icon: MapPin,
                title: 'Alamat',
                content: 'Jl.Citalang, Kp.Karangsari, RT.007/002, Desa Citalang, Kec.Purwakarta, Kab.Purwakarta, Jawa Barat',
              },
              {
                icon: Clock3,
                title: 'Jam Buka',
                content: 'Setiap Hari: 09.30 – 21.30 WIB',
              },
              {
                icon: Phone,
                title: 'Hubungi Kami',
                content: '+62 822-4631-8620',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-5 shadow-sm border border-warm-100"
              >
                <div className="flex gap-3 items-start">
                  <div className="w-11 h-11 rounded-xl bg-brand-300/20 flex items-center justify-center flex-shrink-0">
                    <item.icon
                      className="w-5 h-5 text-brand-900"
                      strokeWidth={2.2}
                    />
                  </div>

                  <div>
                    <p className="font-heading font-semibold text-brand-900 text-sm mb-1">
                      {item.title}
                    </p>
                    <p className="font-body text-neutral-900/70 text-sm leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Action buttons */}
            <a
              href="https://maps.app.goo.gl/2rAcdnLHiZEoFMG19"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-brand-900 text-warm-200 font-heading font-semibold text-sm px-5 py-3 rounded-xl hover:bg-brand-800 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Buka di Google Maps
            </a>
          </div>

          {/* Map embed */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-md h-80 lg:h-96">
            <iframe
              title="Lokasi Mie Ayam & Bakso DENOK Purwakarta"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d990.9770825313033!2d107.46604606954624!3d-6.533260899591219!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e690e101948c1f9%3A0xccb84da3554dd0f6!2sMie%20Ayam%20Plus%20Bakso%20%22denok%22!5e0!3m2!1sid!2sid!4v1783692616191!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
