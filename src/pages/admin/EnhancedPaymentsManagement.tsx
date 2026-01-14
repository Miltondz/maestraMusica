import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, User, CheckCircle, XCircle, AlertCircle, Filter, Clock, PlusCircle, RefreshCw, Trash2, Download } from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
import { usePayments, useAppointments } from '../../hooks';
import { formatDate, formatPrice, formatTime } from '../../lib/utils';
import type { Payment, Appointment, CreatePaymentData } from '../../types';
import { Id } from '../../../convex/_generated/dataModel';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type FilterStatus = 'all' | 'pending' | 'completed' | 'failed' | 'cancelled';

// Modal para agregar un nuevo pago
function AddPaymentModal({
  isOpen,
  onClose,
  appointments
}: {
  isOpen: boolean
  onClose: () => void
  appointments: Appointment[]
}) {
  const { createPayment } = usePayments();
  const [formData, setFormData] = useState<CreatePaymentData>({
    amount: 0,
    appointment_id: '',
    payment_method: 'Efectivo',
    status: 'completed'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        amount: 0,
        appointment_id: '',
        payment_method: 'Efectivo',
        status: 'completed'
      });
      setError(null);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.appointment_id || formData.amount <= 0) {
      setError('Por favor, selecciona una cita y un monto válido.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createPayment({ ...formData, appointment_id: formData.appointment_id as any });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el pago.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-800">Registrar Nuevo Pago</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="appointment_id" className="block text-sm font-medium text-slate-700 mb-1">
              Cita
            </label>
            <select
              id="appointment_id"
              name="appointment_id"
              value={formData.appointment_id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="" disabled>Selecciona una cita</option>
              {appointments.map(apt => (
                <option key={apt._id} value={apt._id}>
                  {apt.client_name} - {formatDate(apt.appointment_date)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
              Monto
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label htmlFor="payment_method" className="block text-sm font-medium text-slate-700 mb-1">
              Método de Pago
            </label>
            <select
              id="payment_method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="completed">Completado</option>
              <option value="pending">Pendiente</option>
            </select>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : 'Agregar Pago'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

type NotificationType = 'success' | 'error';

// Componente de Notificación
function Notification({ message, type, onClose }: { message: string; type: NotificationType; onClose: () => void }) {
  const baseClasses = 'fixed top-20 right-5 p-4 rounded-lg shadow-lg flex items-center z-[100]';
  const typeClasses = type === 'success'
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <XCircle className="w-5 h-5 mr-3" />}
      <span className="flex-grow">{message}</span>
      <button onClick={onClose} className="ml-4 text-lg font-semibold">&times;</button>
    </div>
  );
}

// Componente de Modal de Confirmación
function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, confirmText, cancelText, isLoading }: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[100]">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md m-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-5" />
          <h3 className="text-2xl font-bold text-slate-800 mb-3">{title}</h3>
          <p className="text-slate-600 mb-8">{message}</p>
        </div>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full py-3"
            disabled={isLoading}
          >
            {cancelText || 'Cancelar'}
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : (confirmText || 'Confirmar')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function EnhancedPaymentsManagement() {
  const { payments, loading: paymentsLoading, error: paymentsError, updateStatus: updatePaymentStatus, deletePayment } = usePayments();
  const { appointments, loading: appointmentsLoading, error: appointmentsError } = useAppointments();

  const [filter, setFilter] = useState<FilterStatus>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
  } | null>(null);

  const loading = paymentsLoading || appointmentsLoading;
  const error = paymentsError || appointmentsError;

  const handleStatusUpdate = async (paymentId: string, status: 'completed' | 'pending' | 'cancelled' | 'failed') => {
    setUpdatingStatus(paymentId);

    try {
      await updatePaymentStatus({ id: paymentId as any, status });
      setNotification({ message: 'Estado del pago actualizado.', type: 'success' });
    } catch (error) {
      setNotification({
        message: 'Error al actualizar el pago: ' + (error instanceof Error ? error.message : 'Error desconocido'),
        type: 'error'
      });
    } finally {
      setUpdatingStatus(null);
      setConfirmation(null);
    }
  };

  const requestStatusUpdate = (paymentId: string, status: 'completed' | 'pending' | 'cancelled' | 'failed') => {
    const actionVerb = status === 'completed' ? 'completar' : status === 'cancelled' ? 'cancelar' : status === 'failed' ? 'marcar como fallido' : 'marcar como pendiente';
    setConfirmation({
      isOpen: true,
      title: `Confirmar Acción`,
      message: `¿Estás seguro de que quieres ${actionVerb} este pago?`,
      onConfirm: () => handleStatusUpdate(paymentId, status)
    });
  };

  const handleDelete = async (paymentId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este pago? Esta acción no se puede deshacer.')) return;
    try {
      await deletePayment({ id: paymentId as Id<"payments"> });
      setNotification({ message: 'Pago eliminado correctamente.', type: 'success' });
    } catch (error) {
      setNotification({
        message: 'Error al eliminar el pago: ' + (error instanceof Error ? error.message : 'Error desconocido'),
        type: 'error'
      });
    } finally {
      setConfirmation(null);
    }
  };

  const requestDelete = (paymentId: string) => {
    setConfirmation({
      isOpen: true,
      title: 'Confirmar Eliminación',
      message: '¿Estás seguro de que quieres eliminar este pago? Esta acción no se puede deshacer.',
      onConfirm: () => handleDelete(paymentId),
      confirmText: 'Eliminar',
    });
  };

  const getAppointmentDetails = (appointmentId: string | null) => {
    if (!appointmentId) return { clientName: 'N/D', appointmentDate: 'N/D', appointmentTime: 'N/D' };
    const appointment = appointments.find(apt => apt._id === appointmentId);
    return {
      clientName: appointment?.client_name || 'Cliente Desconocido',
      appointmentDate: appointment?.appointment_date ? formatDate(appointment.appointment_date) : 'N/A',
      appointmentTime: appointment?.appointment_time ? formatTime(appointment.appointment_time) : 'N/A'
    };
  };

  const sortedPayments = [...(payments || [])].sort((a, b) => {
    const dateA = a.payment_date ? new Date(a.payment_date).getTime() : a._creationTime;
    const dateB = b.payment_date ? new Date(b.payment_date).getTime() : b._creationTime;
    return dateB - dateA;
  });

  const filteredPayments = sortedPayments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-100';
      case 'failed':
      case 'cancelled':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-yellow-700 bg-yellow-100';
    }
  };

  const exportToTxt = () => {
    const data = filteredPayments.map(p => {
      const appointmentDetails = getAppointmentDetails(p.appointment_id);
      return (
        `Cliente: ${appointmentDetails.clientName}\n` +
        `Monto: ${formatPrice(p.amount)}\n` +
        `Fecha de Pago: ${formatDate(p.payment_date)}\n` +
        `Método: ${p.payment_method || 'N/A'}\n` +
        `Estado: ${p.status}\n` +
        `Cita: ${appointmentDetails.appointmentDate} a las ${appointmentDetails.appointmentTime}\n` +
        '----------------------------------\n'
      );
    }).join('');

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pagos.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.text('Lista de Pagos', 14, 16);

    const tableColumn = ["Cliente", "Monto", "Fecha de Pago", "Método", "Estado", "Cita"];
    const tableRows: (string | null)[][] = [];

    filteredPayments.forEach(p => {
      const appointmentDetails = getAppointmentDetails(p.appointment_id);
      const paymentData = [
        appointmentDetails.clientName,
        formatPrice(p.amount),
        formatDate(p.payment_date),
        p.payment_method || 'N/A',
        p.status,
        `${appointmentDetails.appointmentDate} a las ${appointmentDetails.appointmentTime}`,
      ];
      tableRows.push(paymentData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        cellPadding: 2,
        fontSize: 8,
        valign: 'middle',
        overflow: 'linebreak',
        halign: 'left',
      },
      headStyles: {
        fillColor: [22, 160, 133], // Theme color
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });
    doc.save('pagos.pdf');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Error al cargar los pagos</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Recargar página</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notification &&
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      }
      {confirmation && confirmation.isOpen &&
        <ConfirmationModal
          isOpen={confirmation.isOpen}
          title={confirmation.title}
          message={confirmation.message}
          onConfirm={confirmation.onConfirm}
          onCancel={() => setConfirmation(null)}
          isLoading={!!updatingStatus}
          confirmText={confirmation.confirmText}
          cancelText={confirmation.cancelText}
        />
      }

      <AddPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointments={appointments}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Pagos</h2>
          <p className="text-slate-600 mt-1">Revisa y gestiona el historial de pagos de las lecciones</p>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={exportToPdf} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar a PDF
          </Button>
          <Button onClick={exportToTxt} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar a TXT
          </Button>

          {/* Add Payment Button */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Agregar Pago
          </Button>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterStatus)}
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Todos los Pagos</option>
              <option value="pending">Pendientes</option>
              <option value="completed">Completados</option>
              <option value="failed">Fallidos</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-800">
              {formatPrice(payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0))}
            </div>
            <div className="text-sm text-slate-600">Total Completado</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {payments.filter(p => p.status === 'pending').length}
            </div>
            <div className="text-sm text-slate-600">Pagos Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {payments.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-slate-600">Pagos Completados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {payments.filter(p => p.status === 'failed' || p.status === 'cancelled').length}
            </div>
            <div className="text-sm text-slate-600">Fallidos/Cancelados</div>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      <div className="grid gap-4">
        {filteredPayments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {filter === 'all' ? 'No se encontraron pagos' : `No hay pagos ${filter}`}
              </h3>
              <p className="text-slate-600">
                {filter === 'all'
                  ? 'El historial de pagos aparecerá aquí. Intenta agregar un nuevo pago.'
                  : `No se encontraron pagos con estado "${filter}".`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPayments.map((payment) => {
            const appointmentDetails = getAppointmentDetails(payment.appointment_id as any);
            return (
              <Card key={payment._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {appointmentDetails.clientName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">{payment.status}</span>
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                            <span>Monto: <span className="font-semibold text-green-600">{formatPrice(payment.amount)}</span></span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            <span>Fecha de Pago: {formatDate(payment.payment_date)}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-slate-400" />
                            <span>Cita: {appointmentDetails.appointmentDate} a las {appointmentDetails.appointmentTime}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-slate-400" />
                            <span>Método: {payment.payment_method || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                      {payment.status === 'pending' && updatingStatus !== payment._id && (
                        <Button
                          size="sm"
                          onClick={() => requestStatusUpdate(payment._id, 'completed')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Completar
                        </Button>
                      )}
                      {payment.status === 'pending' && updatingStatus === payment._id && (
                        <Button
                          size="sm"
                          disabled
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Spinner size="sm" />
                        </Button>
                      )}
                      {payment.status !== 'cancelled' && payment.status !== 'failed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => requestStatusUpdate(payment._id, 'cancelled')}
                          disabled={updatingStatus === payment._id}
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancelar
                        </Button>
                      )}
                      {payment.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => requestStatusUpdate(payment._id, 'pending')}
                          disabled={updatingStatus === payment._id}
                          className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Marcar Pendiente
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => requestDelete(payment._id)}
                        disabled={updatingStatus === payment._id}
                        className="border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
