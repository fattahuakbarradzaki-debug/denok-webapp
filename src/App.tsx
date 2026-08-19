import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import LoadingScreen from '@/components/LoadingScreen'
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute'
import AdminLogin from '@/pages/AdminLogin'
import AdminRoom from '@/pages/AdminRoom'
import HomePage from '@/pages/HomePage'

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && (
        <LoadingScreen onDone={() => setLoading(false)} />
      )}

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminRoom />
            </ProtectedAdminRoute>
          }
        />
        
      </Routes>
    </>
  )
}