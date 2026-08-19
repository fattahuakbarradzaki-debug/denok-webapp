import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { auth, db } from '@/firebase'

interface ProtectedAdminRouteProps {
  children: React.ReactNode
}

export default function ProtectedAdminRoute({
  children,
}: ProtectedAdminRouteProps) {
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user: User | null) => {
        if (!user) {
          setIsAdmin(false)
          setChecking(false)
          return
        }

        try {
          const adminRef = doc(
            db,
            'admins',
            user.uid,
          )

          const adminSnap = await getDoc(adminRef)

          if (
            adminSnap.exists() &&
            adminSnap.data()?.role === 'admin' &&
            adminSnap.data()?.active === true
          ) {
            setIsAdmin(true)
          } else {
            await signOut(auth)
            setIsAdmin(false)
          }
        } catch (error) {
          console.error(
            'Gagal memverifikasi admin:',
            error,
          )

          setIsAdmin(false)
        } finally {
          setChecking(false)
        }
      },
    )

    return unsubscribe
  }, [])

  if (checking) {
    return null
  }

  if (!auth.currentUser) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    )
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    )
  }

  return <>{children}</>
}