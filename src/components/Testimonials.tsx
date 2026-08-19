import {
  CircleUser,
  Star,
  StarHalf,
} from "lucide-react";

const testimonials = [
  {
    name: 'Anita Trisnawati',
    avatar: CircleUser,
    rating: 5,
    text: 'Mie ayam dan basonya bikin ketagihan.. pokoknya uenak...',
  },
  {
    name: 'Rini Gusniwati',
    avatar: CircleUser,
    rating: 5,
    text: 'Kebetulan deket rumah. Enak dan murah jadi sering makan mie ayam disini',
  },
  {
    name: 'Setjadipradja Blood',
    avatar: CircleUser,
    rating: 5,
    text: 'Overall lumayan enak baksonya. Terbilang murah jg..',
  },
  {
    name: 'Epul Saepulloh',
    avatar: CircleUser,
    rating: 5,
    text: 'Mantap ,enak ,terjangkau langganan udah lama ini',
  },
  {
    name: 'Indra Kurniawan',
    avatar: CircleUser,
    rating: 5,
    text: 'Murah tapi ga murahan rasanya, enak buanget',
  },
  {
    name: 'Muna Yasmin',
    avatar: CircleUser,
    rating: 5,
    text: 'Enak...makanya laris. Penjualnya juga ramah',
  },
]

export default function Testimonials() {
  return (
    <section id="testimoni" className="py-20 bg-warm-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-300/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <span className="font-body text-brand-900 text-sm font-medium">Testimoni</span>
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-900 leading-tight">
            Kata Mereka tentang <span className="text-brand-600">DENOK</span>
          </h2>
          <p className="font-body text-neutral-900/60 text-base mt-3">
            Ribuan pelanggan sudah merasakan kelezatan DENOK. Giliran Anda!
          </p>
        </div>

        {/* Ringkasan rating */}
        <div
          className="rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-center gap-8"
          style={{ background: 'linear-gradient(135deg, #621905 0%, #7A2205 100%)' }}
        >
          <div className="text-center">
            <p className="font-heading font-bold text-6xl text-brand-300">4,5</p>
            <div className="flex gap-1 justify-center mt-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-brand-300 fill-brand-300"
                  strokeWidth={1.8}
                />
              ))}
              {Array.from({ length: 1 }).map((_, i) => (
                <StarHalf
                  key={i}
                  className="w-5 h-5 text-brand-300 fill-brand-300"
                  strokeWidth={1.8}
                />
              ))}
            </div>
            <p className="font-body text-warm-200/70 text-sm mt-1">Rating Keseluruhan</p>
          </div>
          <div className="hidden md:block w-px h-16 bg-warm-200/20" />
          <div className="flex flex-col gap-2 w-full max-w-xs">
            {[5, 4, 3].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="font-body text-warm-200/70 text-sm w-4">{star}</span>
                <span className="text-brand-300 text-xs">
                  <Star
                    className="w-6 h-4 text-brand-300 fill-brand-300"
                    strokeWidth={1.8}
                  />
                </span>
                <div className="flex-1 h-1.5 bg-warm-200/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-300 rounded-full"
                    style={{ width: star === 5 ? '90%' : star === 4 ? '8%' : '2%' }}
                  />
                </div>
                <span className="font-body text-warm-200/50 text-xs w-8">
                  {star === 5 ? '90%' : star === 4 ? '8%' : '2%'}
                </span>
              </div>
            ))}
          </div>
          <div className="hidden md:block w-px h-16 bg-warm-200/20" />
          <div className="text-center">
            <p className="font-heading font-bold text-3xl text-warm-200">100+</p>
            <p className="font-body text-warm-200/70 text-sm">Total Ulasan</p>
          </div>
        </div>

        {/* Testimoni */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-5 shadow-sm border border-warm-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-brand-300 fill-brand-300"
                    strokeWidth={1.8}
                  />
                ))}
              </div>
              <p className="font-body text-neutral-900/70 text-sm leading-relaxed mb-4">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-warm-200">
                <div className="w-9 h-9 rounded-full bg-warm-200 flex items-center justify-center text-lg">
                  <t.avatar
                    className="w-9 h-9 text-brand-900"
                    strokeWidth={1.8}
                  />
                </div>
                <div>
                  <p className="font-heading font-semibold text-brand-900 text-sm">{t.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol ulasan Google Maps */}
        <div className="flex justify-center mt-10">
          <a
            href="https://www.google.com/maps/place/Mie+Ayam+Plus+Bakso+%22denok%22/@-6.5332609,107.4666898,19z/data=!4m8!3m7!1s0x2e690e101948c1f9:0xccb84da3554dd0f6!8m2!3d-6.5332609!4d107.4666898!9m1!1b1!16s%2Fg%2F1hm45cwp4?entry=ttu&g_ep=EgoyMDI2MDcwNy4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-brand-900 hover:bg-brand-800 text-warm-200 px-6 py-3 rounded-full font-heading font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
            </svg>

            Buat Ulasan di Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}
