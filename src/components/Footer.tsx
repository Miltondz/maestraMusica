import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { useConvexAuth } from "convex/react";
import { useSiteContent } from '../hooks/useSiteContent';

export function Footer() {
  const { contentMap: content } = useSiteContent();

  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Music className="w-8 h-8 text-amber-400" />
              <span className="text-xl font-bold">{content.footer_logo_text || 'MaestraLauraKarol'}</span>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              {content.footer_description || 'Instrucción musical profesional para estudiantes de todas las edades y niveles de habilidad. Descubre la alegría de la música con lecciones personalizadas de piano, cuatro y teoría musical.'}
            </p>
            <Link to="/reservar">
              <button className="bg-amber-600 text-white px-6 py-3 rounded-md font-medium hover:bg-amber-700 transition-colors">
                Reserva tu Primera Clase
              </button>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/servicios" className="text-slate-300 hover:text-amber-400 transition-colors">Servicios</Link></li>
              <li><Link to="/acerca-de" className="text-slate-300 hover:text-amber-400 transition-colors">Acerca de Mí</Link></li>
              <li><Link to="/reservar" className="text-slate-300 hover:text-amber-400 transition-colors">Reservar Clase</Link></li>
              <li><Link to="/blog" className="text-slate-300 hover:text-amber-400 transition-colors">Blog Musical</Link></li>
              <li><Link to="/galeria" className="text-slate-300 hover:text-amber-400 transition-colors">Galería</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-400" />
                <span className="text-slate-300">{content.contact_info_email || 'MaestraLauraKarol@gmail.com'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-400" />
                <span className="text-slate-300">{content.contact_info_phone || '(555) 000-0000'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span className="text-slate-300">{content.contact_info_location || 'Punto Fijo, Estado Falcon, Venezuela'}</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a href={content.contact_info_facebook_url || '#'} className="text-slate-300 hover:text-amber-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href={content.contact_info_instagram_url || '#'} className="text-slate-300 hover:text-amber-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href={content.contact_info_youtube_url || '#'} className="text-slate-300 hover:text-amber-400 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>{content.footer_copyright || '© 2025 MaestraLauraKarol & DunaTech. Todos los derechos reservados. Inspirando viajes musicales desde 2000.'}</p>
        </div>
      </div>
    </footer>
  );
}