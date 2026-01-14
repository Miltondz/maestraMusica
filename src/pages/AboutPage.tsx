import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Briefcase, Users, Music, BarChart, Heart, Calendar } from 'lucide-react';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { useSiteContent } from '../hooks/useSiteContent';
import { Spinner } from '../components/Spinner';

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

const TimelineItem = ({ icon, title, children, isLast = false }: { icon: React.ReactNode, title: string, children: React.ReactNode, isLast?: boolean }) => (
  <div className="flex">
    <div className="flex flex-col items-center mr-4 sm:mr-6">
      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
        {icon}
      </div>
      {!isLast && <div className="w-px h-full bg-slate-300 my-2"></div>}
    </div>
    <div className="pb-10">
      <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-base text-slate-600">{children}</p>
    </div>
  </div>
);

export function AboutPage() {
  const { contentMap: content, loading } = useSiteContent();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-800">
        <img src="/images/acerca_de_mi.jpeg" alt="Banner abstracto con notas musicales y colores cálidos" className="absolute inset-0 w-full h-full object-cover object-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            {content.about_hero_title || 'Mi Pasión, Tu Inspiración'}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }} className="text-lg sm:text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto">
            {content.about_hero_subtitle || 'Conoce la trayectoria y la filosofía que me convierten en tu mejor aliada para el aprendizaje musical en Venezuela.'}
          </motion.p>
        </div>
      </section>

      {/* Teacher Biography */}
      <Section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div className="relative order-last lg:order-first mt-10 lg:mt-0" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <img src="/images/acerca_de_mi.jpeg" alt="Retrato profesional de Laura Diaz, maestra de música" className="rounded-xl shadow-2xl w-full object-cover aspect-square mx-auto" />
          </motion.div>
          <div className="order-first lg:order-last">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">{content.about_bio_title || 'Mi Viaje Musical y Filosofía'}</h2>
            <p className="text-lg text-slate-600 mb-6">
              {content.about_bio_p1 || 'Desde joven, la música ha sido mi vocación. Mi camino comenzó en coros y con el cuatro venezolano, llevándome a una formación profesional en piano, canto y dirección. Como Licenciada en Educación Musical, mi compromiso es compartir el poder transformador de la música, ofreciendo clases en Falcón, Punto Fijo y remotamente a toda Venezuela.'}
            </p>
            <p className="text-lg text-slate-600 mb-8">
              {content.about_bio_p2 || 'Mi filosofía se centra en un aprendizaje inspirador y personalizado. Adapto mis métodos para potenciar las fortalezas de cada estudiante, buscando nutrir no solo la técnica, sino la creatividad y el amor por la música. Mi meta es guiarte a descubrir tu potencial y cultivar una pasión que te acompañe siempre.'}
            </p>
            <Link to="/contacto"><Button variant="primary" size="lg">Contáctame<ArrowRight className="w-5 h-5 ml-2" /></Button></Link>
          </div>
        </div>
      </Section>

      {/* Credentials and Experience Timeline */}
      <Section className="py-16 sm:py-24 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">{content.about_timeline_title || 'Mi Trayectoria Profesional'}</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">{content.about_timeline_subtitle || 'Un resumen de mi experiencia y formación, dedicada a la excelencia en la educación musical en ciudades como Maracaibo, Caracas y Mérida.'}</p>
          </div>
          <div className="relative">
            <TimelineItem icon={<GraduationCap />} title={content.about_timeline_i1_title || 'Educación Formal'}>{content.about_timeline_i1_text || 'Licenciatura en Educación, Mención Música (UNEFM). Estudios avanzados de Cuatro, Guitarra y Piano en prestigiosas escuelas de música de Venezuela.'}</TimelineItem>
            <TimelineItem icon={<Briefcase />} title={content.about_timeline_i2_title || 'Experiencia Docente'}>{content.about_timeline_i2_text || 'He tenido el honor de ser docente en el Conservatorio Musical del Estado Falcón (COMESFAL) y en la Universidad Nacional Experimental Francisco de Miranda (UNEFM).'}</TimelineItem>
            <TimelineItem icon={<Users />} title={content.about_timeline_i3_title || 'Dirección y Liderazgo'}>{content.about_timeline_i3_text || 'Fundadora de la agrupación infantil "Cantores del 23" y Directora Musical de la Coral UNEFM, fomentando el talento joven.'}</TimelineItem>
            <TimelineItem icon={<Music />} title={content.about_timeline_i4_title || 'Agrupaciones Corales'}>{content.about_timeline_i4_text || 'Miembro activo y coralista en agrupaciones de renombre como la Coral del Centro de Refinación Paraguaná y la Coral Cotraedup.'}</TimelineItem>
            <TimelineItem icon={<BarChart />} title={content.about_timeline_i5_title || 'Desarrollo Profesional'}>{content.about_timeline_i5_text || 'Locutora Profesional Certificada y participante activa en talleres de pedagogía musical para mantenerme a la vanguardia de la enseñanza.'}</TimelineItem>
            <TimelineItem icon={<Heart />} title={content.about_timeline_i6_title || 'Impacto Comunitario'} isLast>{content.about_timeline_i6_text || 'Colaboradora del Proyecto de Acción Social por la Música Simón Bolívar y fundadora de proyectos para niños de bajos recursos.'}</TimelineItem>
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <section className="py-24 bg-amber-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{content.about_cta_title || '¿Listo para Empezar tu Viaje Musical?'}</h2>
            <p className="text-lg sm:text-xl mb-10 text-amber-100 max-w-2xl mx-auto">{content.about_cta_subtitle || 'Ya sea que estés en Punto Fijo, Falcón o cualquier parte de Venezuela, estoy aquí para ayudarte. ¡Reserva tu clase personalizada hoy!'}</p>
            <Link to="/reservar"><Button variant="secondary" size="lg">Agenda tu Primera Clase<Calendar className="w-5 h-5 ml-2" /></Button></Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}