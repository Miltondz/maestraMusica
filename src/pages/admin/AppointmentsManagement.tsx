import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, CheckCircle, XCircle, AlertCircle, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
import { useAppointments, useServices } from '../../hooks';
import { formatDate, formatTime, formatPrice } from '../../lib/utils';
import type { Appointment, Service } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'cancelled';

export function AppointmentsManagement() {
  const { appointments, loading: appLoading, error, updateStatus, deleteAppointment } = useAppointments();
  const { services, loading: servicesLoading } = useServices();

  const [filter, setFilter] = useState<FilterStatus>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const loading = appLoading || servicesLoading;

  const handleStatusUpdate = async (appointmentId: string, status: 'confirmed' | 'cancelled') => {
    const actionVerb = status === 'confirmed' ? 'aceptar' : 'cancelar';
    if (!confirm(`¿Estás seguro de que quieres ${actionVerb} esta cita?`)) return;

    setUpdatingStatus(appointmentId);
    try {
      await updateStatus({ id: appointmentId as any, status });
    } catch (error) {
      alert('Error al actualizar la cita: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta cita?')) return;

    try {
      await deleteAppointment({ id: appointmentId as any });
    } catch (error) {
      alert('Error al eliminar la cita: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const getServiceName = (serviceId: string | null) => {
    if (!serviceId) return 'Servicio Desconocido';
    const service = services.find(s => s._id === serviceId);
    return service ? service.name : 'Servicio Desconocido';
  };

  const getServicePrice = (serviceId: string | null) => {
    if (!serviceId) return 0;
    const service = services.find(s => s._id === serviceId);
    return service ? service.price : 0;
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-700 bg-green-100';
      case 'cancelled':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-yellow-700 bg-yellow-100';
    }
  };

  const exportToTxt = () => {
    const data = filteredAppointments.map(app => (
      `Nombre: ${app.client_name}\n` +
      `Email: ${app.client_email}\n` +
      `Servicio: ${getServiceName(app.service_id)}\n` +
      `Fecha: ${formatDate(app.appointment_date)}\n` +
      `Hora: ${formatTime(app.appointment_time)}\n` +
      `Estado: ${app.status}\n` +
      `Notas: ${app.notes || 'N/A'}\n` +
      '----------------------------------\n'
    )).join('');

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'citas.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.text('Lista de Citas', 14, 16);

    const tableColumn = ["Nombre", "Email", "Servicio", "Fecha", "Hora", "Estado", "Notas"];
    const tableRows: (string | null)[][] = [];

    filteredAppointments.forEach(app => {
      const appointmentData = [
        app.client_name,
        app.client_email,
        getServiceName(app.service_id),
        formatDate(app.appointment_date),
        formatTime(app.appointment_time),
        app.status,
        app.notes || 'N/A',
      ];
      tableRows.push(appointmentData);
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
    doc.save('citas.pdf');
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
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Error al cargar las citas</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Recargar página</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Citas</h2>
          <p className="text-slate-600 mt-1">Revisa y gestiona las reservas de lecciones</p>
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
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterStatus)}
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Todas las Citas</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Aceptadas</option>
              <option value="cancelled">Rechazadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-800">
              {appointments.length}
            </div>
            <div className="text-sm text-slate-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {appointments.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-slate-600">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'confirmed').length}
            </div>
            <div className="text-sm text-slate-600">Aceptadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {appointments.filter(a => a.status === 'cancelled').length}
            </div>
            <div className="text-sm text-slate-600">Rechazadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <div className="grid gap-4">
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {filter === 'all' ? 'No se encontraron citas' : `No hay citas ${filter}`}
              </h3>
              <p className="text-slate-600">
                {filter === 'all'
                  ? 'Las citas aparecerán aquí cuando los estudiantes reserven lecciones.'
                  : `No se encontraron citas con estado "${filter}".`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {appointment.client_name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        <span className="ml-1 capitalize">{appointment.status}</span>
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-slate-400" />
                          <span>{appointment.client_email}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                          <span>{formatDate(appointment.appointment_date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-slate-400" />
                          <span>{formatTime(appointment.appointment_time)}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-slate-400" />
                          <span>{getServiceName(appointment.service_id)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-600 font-semibold">
                            {formatPrice(getServicePrice(appointment.service_id))}
                          </span>
                        </div>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-md">
                        <p className="text-sm text-slate-600">
                          <strong>Notas:</strong> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-4">
                    {appointment.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                          disabled={updatingStatus === appointment._id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {updatingStatus === appointment._id ? (
                            <Spinner size="sm" />
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Aceptar
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                          disabled={updatingStatus === appointment._id}
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rechazar
                        </Button>
                      </>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      Ver Detalles
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(appointment._id)}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-800">Detalles de la Cita</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Nombre del Estudiante</label>
                <p className="text-slate-800">{selectedAppointment.client_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Correo Electrónico</label>
                <p className="text-slate-800">{selectedAppointment.client_email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Servicio</label>
                <p className="text-slate-800">{getServiceName(selectedAppointment.service_id)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Fecha y Hora</label>
                <p className="text-slate-800">
                  {formatDate(selectedAppointment.appointment_date)} a las {formatTime(selectedAppointment.appointment_time)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Estado</label>
                <p className={`capitalize ${selectedAppointment.status === 'confirmed' ? 'text-green-600' : selectedAppointment.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {selectedAppointment.status}
                </p>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Notas</label>
                  <p className="text-slate-800">{selectedAppointment.notes}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={() => setSelectedAppointment(null)}>
                  Cerrar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}