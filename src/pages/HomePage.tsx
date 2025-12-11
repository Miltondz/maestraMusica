import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, BookOpen, GraduationCap, ClipboardEdit, HeartHandshake, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { useServices } from '../hooks/useServices';
import { useTestimonials } from '../hooks/useTestimonials';
import { useFeaturedMedia } from '../hooks/useMediaGallery';
import { useSiteContent } from '../hooks/useSiteContent';
import { formatPrice } from '../lib/utils';
import { BlogCarousel } from '../components/BlogCarousel';
import { Spinner } from '../components/Spinner';
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

export function HomePage() {
  const { services, loading: servicesLoading } = useServices();
  const { testimonials, loading: testimonialsLoading } = useTestimonials();
  const { featuredItems, loading: mediaLoading } = useFeaturedMedia();
  const { content, loading: contentLoading } = useSiteContent();

  const featuredServices = services.slice(0, 3);
  const featuredTestimonials = testimonials.slice(0, 3);
  const featuredPhotos = featuredItems.filter(item => item.is_featured && item.media_type === 'photo').slice(0, 2);

  if (contentLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  const siteSchema = {
    "@context": "https://schema.org",
    "@type": "MusicSchool",
    "name": "Maestra de Música - Laura Karol",
    "description": content.home_hero_subtitle || 'Clases de música online y presenciales en Venezuela.',
    "url": window.location.origin,
    "founder": {
      "@type": "Person",
      "name": "Laura Karol",
      "jobTitle": "Maestra de Música"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Punto Fijo",
      "addressRegion": "Falcón",
      "addressCountry": "VE"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Clases de Música",
      "itemListElement": services.map(service => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.name,
          "description": service.description
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO 
        title="Clases de Música Online y Presenciales | Laura Karol"
        description="Aprende piano, guitarra, canto y teoría musical con Laura Karol. Clases personalizadas en Falcón, Venezuela y online para todo el mundo."
        keywords={['clases de musica', 'piano', 'guitarra', 'canto', 'venezuela', 'online', 'punto fijo']}
        schema={siteSchema}
        image="/images/main_hero.jpeg"
      />

      {/* Hero Section */}
      <section
        className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden"
        style={{
          backgroundImage: 'url(/images/main_header.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        <div className="relative max-w-5xl mx-auto text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight"
          >
            {content.home_hero_title || 'Descubre Tu Verdadera Pasión Musical'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-lg sm:text-xl md:text-2xl mb-10 text-slate-200 max-w-3xl mx-auto"
          >
            {content.home_hero_subtitle || 'Clases de música online y presenciales en Venezuela. Aprende piano, guitarra, canto y más con una metodología adaptada a ti.'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/reservar">
              <Button size="lg" className="w-full sm:w-auto">                <Calendar className="w-5 h-5 mr-2" />
                Reserva tu Primera Clase
              </Button>
            </Link>
            <Link to="/servicios">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white hover:text-slate-800">
                Explorar Servicios
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Preview Section */}
      <Section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true, amount: 0.5 }}
               transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
                {content.home_about_title || 'Una Trayectoria Dedicada a la Música'}
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                {content.home_about_p1 || 'Con más de 25 años de experiencia, mi misión es guiarte en tu viaje musical. Ofrezco clases en Falcón, Punto Fijo, y para toda Venezuela vía remota.'}
              </p>
              <p className="text-lg text-slate-600 mb-8">
                {content.home_about_p2 || 'Mi filosofía combina excelencia académica con un enfoque creativo y personalizado, creando un ambiente de aprendizaje donde cada estudiante puede brillar.'}
              </p>
              <Link to="/acerca-de">
                <Button variant="secondary">
                  Conoce más sobre mí
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="relative mt-10 lg:mt-0"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <img
                src="/images/main_hero.jpeg"
                alt="Laura Diaz, maestra de música, en su estudio con un piano"
                className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -right-6 bg-amber-600 text-white p-5 rounded-full shadow-lg flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32">
                  <div className="text-3xl sm:text-4xl font-bold">25+</div>
                  <div className="text-xs sm:text-sm text-center leading-tight">Años de Exp.</div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Why Choose Us Section */}
      <Section className="py-16 sm:py-24 bg-gradient-to-b from-amber-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
            {content.home_why_title || '¿Por Qué Elegir Mis Clases?'}
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 mb-12 sm:mb-16 max-w-3xl mx-auto">
            {content.home_why_subtitle || 'Mi compromiso es con tu éxito. Ofrezco una experiencia de aprendizaje única, ya sea en Maracaibo, Caracas, Mérida o desde casa.'}
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center p-6">
              <div className="p-4 bg-amber-100 rounded-full mb-4">
                <GraduationCap className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{content.home_why_f1_title || 'Instrucción de Calidad'}</h3>
              <p className="text-slate-600">{content.home_why_f1_text || 'Guía experta y personalizada de una profesional con una sólida trayectoria en docencia y dirección musical.'}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="p-4 bg-amber-100 rounded-full mb-4">
                <ClipboardEdit className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{content.home_why_f2_title || 'Planes Personalizados'}</h3>
              <p className="text-slate-600">{content.home_why_f2_text || 'Planes de estudio adaptados a tu ritmo, estilo de aprendizaje e intereses musicales. Tu progreso es mi prioridad.'}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="p-4 bg-amber-100 rounded-full mb-4">
                <HeartHandshake className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{content.home_why_f3_title || 'Comunidad y Apoyo'}</h3>
              <p className="text-slate-600">{content.home_why_f3_text || 'Únete a una red de estudiantes, participa en talleres y eventos, y enriquece tu experiencia de aprendizaje.'}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Featured Services */}
      <Section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">{content.home_services_title || 'Servicios Musicales'}</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">{content.home_services_subtitle || 'Clases de música para todas las edades y niveles. Explora nuestros servicios y encuentra el ideal para ti.'}</p>
          </div>

          {servicesLoading ? (
            <div className="flex justify-center"><Spinner size="lg" /></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredServices.map((service) => (
                <Card key={service.id}>
                  <div className="h-56 overflow-hidden">
                    <img src={service.image_url || '/images/placeholders/elegant_music_education_blog_placeholder.jpg'} alt={`Clases de ${service.name}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold text-slate-800 mb-3">{service.name}</h3>
                    <p className="text-slate-600 mb-5 line-clamp-3">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-amber-600">{formatPrice(service.price)}</div>
                      <div className="text-sm text-slate-500">{service.duration_minutes} min / clase</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/servicios"><Button size="lg">Ver Todos los Servicios<ArrowRight className="w-5 h-5 ml-2" /></Button></Link>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="py-16 sm:py-24 bg-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">{content.home_testimonials_title || 'Lo Que Dicen Mis Estudiantes'}</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">{content.home_testimonials_subtitle || 'Testimonios de estudiantes que han iniciado su viaje musical conmigo.'}</p>
          </div>

          {testimonialsLoading ? (
            <div className="flex justify-center"><Spinner size="lg" /></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTestimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />)}
                    </div>
                    <blockquote className="text-slate-600 mb-5 flex-grow"><p className="italic">"{testimonial.content}"</p></blockquote>
                    <div className="text-right"><div className="font-semibold text-slate-800">- {testimonial.author_name}</div></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Blog Carousel */}
      <BlogCarousel />

      {/* Call to Action - Combined with Featured Gallery */}
      <section className="py-16 sm:py-24 bg-amber-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center text-white">
          {mediaLoading ? (
            <div className="flex justify-center lg:col-span-2"><Spinner size="lg" /></div>
          ) : featuredPhotos.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="grid grid-cols-2 gap-4"
            >
              {featuredPhotos.map((item) => (
                <div key={item.id} className="relative overflow-hidden rounded-lg shadow-lg aspect-video">
                  <img
                    src={item.thumbnail_url || item.media_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-lg font-bold">Ver</span>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="lg:col-span-2 text-center">
              <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 text-amber-200" />
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {content.home_cta_title || 'Únete a Nuestra Comunidad Musical'}
            </h2>
            <p className="text-lg sm:text-xl mb-10 text-amber-100 max-w-2xl lg:max-w-none mx-auto lg:mx-0">
              {content.home_cta_subtitle || 'Da el primer paso hacia tu futuro musical. Reserva tu clase hoy y descubre el poder de la música.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/reservar"><Button variant="secondary" size="lg">Reserva tu Clase<Calendar className="w-5 h-5 ml-2" /></Button></Link>
              <Link to="/contacto"><Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-amber-600">Contáctanos</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}