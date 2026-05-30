import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar as CalendarIcon, Clock, User, Mail, MessageSquare, CheckCircle, AlertCircle, Music } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader } from '../components/Card';
import { useServices, useAppointments } from '../hooks';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { formatTime, formatDate } from '../lib/utils';
import { getFriendlyError } from '../lib/errors';
import { Spinner } from '../components/Spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const bookingSchema = z.object({
  client_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  client_email: z.string().email('Por favor ingresa una dirección de correo válida'),
  service_id: z.string().min(1, 'Por favor selecciona un servicio'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const { services, loading: servicesLoading } = useServices();
  const { createAppointment } = useAppointments();

  const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : null;
  const availableSlots = useQuery(api.appointments.getAvailableSlots, dateStr ? { date: dateStr } : "skip");
  const loadingSlots = selectedDate && availableSlots === undefined;

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (serviceId && services.length > 0) {
      setValue('service_id', serviceId);
    }
  }, [searchParams, services, setValue]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedDate || !selectedTime) {
      setBookingError('Por favor selecciona una fecha y hora para tu clase.');
      return;
    }

    setSubmitting(true);
    setBookingError(null);

    try {
      await createAppointment({
        client_name: data.client_name,
        client_email: data.client_email,
        service_id: data.service_id as Id<"services">,
        notes: data.notes,
        appointment_date: selectedDate.toISOString().split('T')[0],
        appointment_time: selectedTime,
      });
      setBookingSuccess(true);
      reset();
      setSelectedDate(undefined);
      setSelectedTime('');
    } catch (error) {
      setBookingError(getFriendlyError(error, 'No se pudo enviar la solicitud. Intenta de nuevo.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
          <Card className="max-w-lg w-full text-center">
            <CardContent className="p-8 sm:p-10">
              <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">¡Solicitud Enviada!</h2>
              <p className="text-base sm:text-lg text-slate-600 mb-8">
                Gracias por tu interés. He recibido tu solicitud y me pondré en contacto contigo dentro de 24 horas para confirmar los detalles de tu clase de música.
              </p>
              <Button onClick={() => setBookingSuccess(false)} size="lg">Reservar Otra Clase</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="py-20 sm:py-28 bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-center px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <CalendarIcon className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 text-teal-200" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">Agenda tu Clase de Música</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto">
            Reserva tu clase de música en Falcón, Punto Fijo, o en línea para toda Venezuela. ¡Comienza tu viaje musical hoy!
          </p>
        </motion.div>
      </header>

      <main className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 sm:space-y-12">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="grid lg:grid-cols-2 gap-8 lg:gap-10">
              <Card>
                <CardHeader><h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center"><CalendarIcon className="w-6 h-6 mr-3 text-amber-600" />1. Selecciona la Fecha</h2></CardHeader>
                <CardContent className="p-2 sm:p-4">
                  <DayPicker mode="single" selected={selectedDate} onSelect={handleDateSelect} disabled={{ before: new Date() }} className="mx-auto scale-90 sm:scale-100" classNames={{ day_selected: 'bg-amber-600 text-white', day_today: 'text-amber-600 font-bold' }} />
                </CardContent>
              </Card>
              <div className="space-y-6 sm:space-y-8">
                <Card>
                  <CardHeader><h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center"><Clock className="w-6 h-6 mr-3 text-amber-600" />2. Elige la Hora</h2></CardHeader>
                  <CardContent>
                    {!selectedDate ? <p className="text-slate-500 text-center py-8">Selecciona una fecha para ver horarios.</p> : loadingSlots ? <div className="flex justify-center py-8"><Spinner /></div> : (!availableSlots || availableSlots.length === 0) ? <p className="text-slate-500 text-center py-8">No hay horarios para esta fecha.</p> : <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                      {availableSlots.map(slot => <Button key={slot} type="button" variant={selectedTime === slot ? 'primary' : 'outline'} onClick={() => setSelectedTime(slot)}>{formatTime(slot)}</Button>)}
                    </div>}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center"><Music className="w-6 h-6 mr-3 text-amber-600" />3. Escoge el Servicio</h2></CardHeader>
                  <CardContent>
                    {servicesLoading ? <div className="flex justify-center py-4"><Spinner /></div> : <div className="space-y-3">
                      {services.map(service => <label key={service._id} className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${errors.service_id ? 'border-red-500' : ''} ${watch('service_id') === service._id ? 'bg-amber-50 border-amber-500' : 'hover:bg-slate-100'}`}>
                        <input type="radio" value={service._id} {...register('service_id')} className="mr-3 sm:mr-4 text-amber-600 focus:ring-amber-500" />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">{service.name}</div>
                          <div className="text-sm text-slate-600">{service.price}$ &bull; {service.duration_minutes} min</div>
                        </div>
                      </label>)}
                      {errors.service_id && <p className="text-red-600 text-sm mt-2">{errors.service_id.message}</p>}
                    </div>}
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}>
              <Card>
                <CardHeader><h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center"><User className="w-6 h-6 mr-3 text-amber-600" />4. Tu Información</h2></CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Nombre Completo *</label>
                      <input type="text" {...register('client_name')} className={`form-input ${errors.client_name ? 'border-red-500' : ''}`} placeholder="Tu nombre y apellido" />
                      {errors.client_name && <p className="text-red-600 text-sm mt-1">{errors.client_name.message}</p>}
                    </div>
                    <div>
                      <label className="form-label">Correo Electrónico *</label>
                      <input type="email" {...register('client_email')} className={`form-input ${errors.client_email ? 'border-red-500' : ''}`} placeholder="tu@email.com" />
                      {errors.client_email && <p className="text-red-600 text-sm mt-1">{errors.client_email.message}</p>}
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="form-label flex items-center"><MessageSquare className="w-4 h-4 inline mr-2" />Notas Adicionales (Opcional)</label>
                    <textarea {...register('notes')} rows={4} className="form-input" placeholder="Metas específicas, nivel de experiencia, o cualquier detalle que deba saber."></textarea>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <AnimatePresence>
              {bookingError && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="p-4 bg-red-100 border border-red-300 rounded-lg flex items-center text-red-800"><AlertCircle className="w-5 h-5 mr-3" />{bookingError}</motion.div>}
            </AnimatePresence>

            <div className="text-center pt-4 sm:pt-6">
              <Button type="submit" disabled={submitting || !selectedDate || !selectedTime} size="lg" className="w-full max-w-md mx-auto">
                {submitting ? <><Spinner size="sm" className="mr-2" />Enviando Solicitud...</> : 'Confirmar y Enviar Solicitud'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}