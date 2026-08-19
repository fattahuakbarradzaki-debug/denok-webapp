import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, ArrowLeft } from 'lucide-react'

import { auth } from '@/firebase'

export default function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      )

      navigate('/admin')
    } catch (error) {
      console.error('Admin login gagal:', error)

      setError(
        'Email atau password yang kamu masukkan salah.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Logo / Header */}
        <div className="text-center mb-8">

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-brand-900/60 hover:text-brand-900 text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={15} />
            Kembali ke Beranda
          </Link>

          <h1 className="font-heading font-bold text-2xl text-brand-900">
            Admin DENOK
          </h1>

          <p className="font-body text-sm text-neutral-900/50 mt-2">
            Silakan masuk untuk mengakses Admin Room
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-warm-200 p-6 sm:p-8">

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label
                htmlFor="admin-email"
                className="font-heading font-semibold text-brand-900 text-sm block mb-2"
              >
                Email Admin
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Email admin"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-warm-200 bg-warm-100 text-sm text-brand-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-900/10"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label
                htmlFor="admin-password"
                className="font-heading font-semibold text-brand-900 text-sm block mb-2"
              >
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Password admin"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-warm-200 bg-warm-100 text-sm text-brand-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-900/10"
                />

              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-900 hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed text-warm-200 font-heading font-semibold py-3 rounded-xl transition-colors"
            >
              {loading
                ? 'Memproses...'
                : 'Masuk ke Admin Room'}
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}