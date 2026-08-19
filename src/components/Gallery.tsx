import {
  Camera,
} from 'lucide-react'

const photos = [
  {
    src: 'https://i.ibb.co.com/pBfwD1pS/3.png',
    alt: 'Mie Ayam Bakso DENOK dalam mangkuk cantik',
    span: 'row-span-2',
  },
  {
    src: 'https://i.ibb.co.com/5XVfDhhW/1.png',
    alt: 'Bakso sapi kenyal khas DENOK',
    span: '',
  },
  {
    src: 'https://i.ibb.co.com/k6VKGq0s/2.png',
    alt: 'Semangkuk ramen lezat sajian DENOK',
    span: '',
  },
  {
    src: 'https://i.ibb.co.com/rR3ykZW6/5.png',
    alt: 'Mie dengan topping skewer dan minuman es',
    span: '',
  },
  {
    src: 'https://i.ibb.co.com/LzxdHsWv/4.png',
    alt: 'Bakso dalam kuah kaldu bening DENOK',
    span: '',
  },

]

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 bg-warm-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-900/10 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
            <span className="font-body text-brand-900 text-sm font-medium">Galeri</span>
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-900 leading-tight">
            Lihat Kelezatan <span className="text-brand-600">DENOK</span>
          </h2>
          <p className="font-body text-neutral-900/60 text-base mt-3">
            Setiap sajian dibuat dengan penuh cinta dan perhatian terhadap detail.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {photos.map((photo, i) => (
            <div
              key={i}
              className={`${photo.span} rounded-2xl overflow-hidden group cursor-pointer`}
              style={{ minHeight: i === 0 ? '320px' : '150px' }}
            >
              <div className="relative w-full h-full min-h-[150px]">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ minHeight: 'inherit' }}
                />
                <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/30 transition-colors duration-300 rounded-2xl" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full bg-brand-300 flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center font-body text-neutral-900/50 text-sm mt-6">
          <Camera
            className="inline-block w-5 h-5 text-brand-600 mr-1 align-text-bottom"
            strokeWidth={2}
          />
          <span>
            Follow kami di Instagram{' '}
            <span className="text-brand-600 font-semibold">
              @denokpurwakarta
            </span>{' '}
            untuk update foto terbaru
          </span>
        </p>
      </div>
    </section>
  )
}
