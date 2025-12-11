import React from 'react';
import { Clock, DollarSign, Calendar, Music, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader } from '../components/Card';
import { useServices } from '../hooks/useServices';
import { Spinner } from '../components/Spinner';
import { formatPrice } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { SEO } from '../components/SEO';

const Section = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.section>
);

export function ServicesPage() {
  const { services, loading, error } = useServices();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Error al Cargar Servicios</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Intentar de Nuevo
          </Button>
        </div>
      </div>
    );
  }

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": services.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": service.name,
        "description": service.description,
        "offers": {
          "@type": "Offer",
          "price": service.price,
          "priceCurrency": "USD"
        }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Clases de Piano, Guitarra y Canto | Servicios de Música"
        description="Explora nuestra oferta de clases de música online y presenciales. Piano, guitarra, canto, teoría musical y más. Precios competitivos y horarios flexibles."
        keywords={['precios clases musica', 'costo clases piano', 'clases guitarra online', 'clases canto venezuela']}
        schema={servicesSchema}
      />

      {/* Header Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-amber-500 to-amber-600 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight"
          >
            Clases y Servicios Musicales
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-lg sm:text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto"
          >
            Ofrezco clases de música en Falcón, Punto Fijo, y online para toda Venezuela. Encuentra el programa perfecto para ti.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <Section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="flex flex-col h-full group">
                  <div className="h-56 sm:h-64 overflow-hidden">
                    <img
                      src={service.image_url || 'https://placehold.co/600x400/d1d5db/374151?text=Servicio+Musical'}
                      alt={`Clases de ${service.name} en Venezuela`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <h2 className="text-2xl font-bold text-slate-800">
                      {service.name}
                    </h2>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                      {service.description}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-slate-600 gap-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-amber-600" />
                        <span>{service.duration_minutes} minutos</span>
                      </div>
                      <div className="text-2xl font-bold text-amber-600">
                        {formatPrice(service.price)}
                      </div>
                    </div>
                    <div className="border-t pt-6">
                      <Link to={`/reservar?service=${service.id}`}>
                        <Button className="w-full" size="lg">
                          Reservar Clase
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Additional Info Section */}
      <Section className="py-16 sm:py-24 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Todo lo que Necesitas para Triunfar
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              Mis clases, disponibles en Maracaibo, Caracas, Mérida y online, incluyen todo para tu progreso.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Music className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Instrucción Personalizada
              </h3>
              <p className="text-slate-600">
                Lecciones adaptadas a tu estilo de aprendizaje, ritmo e intereses musicales para un máximo aprovechamiento.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Horarios Flexibles
              </h3>
              <p className="text-slate-600">
                Coordina tus clases en horarios que se ajusten a tu rutina, incluyendo tardes y fines de semana.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Materiales Incluidos
              </h3>
              <p className="text-slate-600">
                Todas las partituras, ejercicios y recursos de aprendizaje digital están incluidos en tus lecciones.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <section className="py-24 bg-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              ¿Listo para Empezar tu Viaje Musical?
            </h2>
            <p className="text-lg sm:text-xl mb-10 text-slate-300 max-w-2xl mx-auto">
              No esperes más para alcanzar tus sueños musicales. Reserva tu primera clase y descubre tu potencial.
            </p>
            <Link to="/reservar">
              <Button variant="primary" size="lg">
                Agendar mi Lección Ahora
                <Calendar className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}