import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  Mail,
  ImageIcon,
  Music,
  MessageSquare,
  AlertCircle,
  FileText
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/Card'
import { Button } from '../../components/Button'
import { Spinner } from '../../components/Spinner'
import { useServices, useTestimonials, useBlogPosts, useAppointments, usePayments, useMediaGallery } from '../../hooks'
import { useContactMessages, useUnreadMessages } from '../../hooks/useContactMessages'

export { AdminDashboard }

function AdminDashboard() {
  const { services, loading: servicesLoading, error: servicesError } = useServices()
  const { testimonials, loading: testimonialsLoading, error: testimonialsError } = useTestimonials()
  const { blogPosts, loading: blogLoading, error: blogError } = useBlogPosts()
  const { unreadMessages, loading: messagesLoading, error: messagesError } = useUnreadMessages()
  const { appointments, loading: appointmentsLoading } = useAppointments()
  const { mediaItems, loading: mediaLoading } = useMediaGallery()
  const { stats: paymentsStatsData, loading: paymentsLoading } = usePayments()

  const mediaCount = mediaItems ? mediaItems.length : 0

  const appointmentsStats = {
    total: appointments.length,
    pending: appointments.filter((a: any) => a.status === 'pending').length,
    confirmed: appointments.filter((a: any) => a.status === 'confirmed').length,
    cancelled: appointments.filter((a: any) => a.status === 'cancelled').length
  }

  const paymentsStats = paymentsStatsData || {
    totalRevenue: 0,
    pendingAmount: 0,
    paidCount: 0,
    pendingCount: 0
  }

  // Only show loading if core data is loading
  const coreLoading = servicesLoading || testimonialsLoading || blogLoading
  const coreError = servicesError || testimonialsError || blogError

  if (coreLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (coreError) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Error al cargar el panel de control</h3>
        <p className="text-slate-600 mb-4">{coreError}</p>
        <Button onClick={() => window.location.reload()}>Intentar de nuevo</Button>
      </div>
    )
  }

  const adminNavItems = [
    { name: 'Servicios', path: '/admin/services', icon: Music, count: services.length },
    { name: 'Citas', path: '/admin/appointments', icon: Calendar, count: appointmentsStats.total, badge: appointmentsStats.pending > 0 ? appointmentsStats.pending : undefined },
    { name: 'Blog', path: '/admin/blog', icon: BookOpen, count: blogPosts.length },
    { name: 'Testimonios', path: '/admin/testimonials', icon: Users, count: testimonials.length },
    { name: 'Pagos', path: '/admin/payments', icon: DollarSign, count: paymentsStats.paidCount },
    { name: 'Galería', path: '/admin/media', icon: ImageIcon, count: mediaCount },
    { name: 'Mensajes', path: '/admin/messages', icon: MessageSquare, count: unreadMessages.length, badge: unreadMessages.length > 0 ? unreadMessages.length : undefined },
    { name: 'Gestión de Contenido', path: '/admin/content', icon: FileText, count: 0 },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Panel de Administración</h1>
      <p className="text-slate-600">Bienvenido al panel de control. Aquí puedes gestionar todo el contenido de tu sitio web.</p>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Citas Pendientes</p>
                <h2 className="text-3xl font-bold text-yellow-600">{appointmentsStats.pending}</h2>
              </div>
              <Calendar className="w-10 h-10 text-yellow-500" />
            </div>
            <Link to="/admin/appointments" className="text-sm text-amber-600 hover:underline mt-4 block">
              Ver todas las citas
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Mensajes No Leídos</p>
                <h2 className="text-3xl font-bold text-blue-600">{unreadMessages.length}</h2>
              </div>
              <Mail className="w-10 h-10 text-blue-500" />
            </div>
            <Link to="/admin/messages" className="text-sm text-amber-600 hover:underline mt-4 block">
              Ver todos los mensajes
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Ingresos Totales (Estimado)</p>
                <h2 className="text-3xl font-bold text-green-600">${paymentsStats.totalRevenue.toFixed(2)}</h2>
              </div>
              <DollarSign className="w-10 h-10 text-green-500" />
            </div>
            <Link to="/admin/payments" className="text-sm text-amber-600 hover:underline mt-4 block">
              Ver historial de pagos
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {adminNavItems.map((item) => (
          <Link key={item.name} to={item.path}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-slate-800">{item.name}</h3>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {item.name === 'Gestión de Contenido'
                      ? 'Configuración'
                      : item.name === 'Citas'
                        ? `${item.count} total`
                        : `${item.count} elementos`}
                  </p>
                </div>
                <item.icon className="w-8 h-8 text-amber-600" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}