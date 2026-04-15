// src/pages/AdminPage.jsx
import { useAdminStore } from '../store'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'

export default function AdminPage() {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated)
  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />
}
