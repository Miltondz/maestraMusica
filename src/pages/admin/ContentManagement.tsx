import React, { useState, useEffect } from 'react';
import { useSiteContent } from '../../hooks';
import type { SiteContent } from '../../types';
import { Button } from '../../components/Button';
import { Card, CardContent, CardHeader } from '../../components/Card';
import { Spinner } from '../../components/Spinner';
import { getFriendlyError } from '../../lib/errors';
import { AlertCircle } from 'lucide-react';

export function ContentManagement() {
  const { content, loading, error, updateContent } = useSiteContent()
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [localContent, setLocalContent] = useState<SiteContent[]>([]);

  useEffect(() => {
    if (content) {
      setLocalContent(content);
    }
  }, [content]);

  const handleInputChange = (key: string, value: string) => {
    setLocalContent(prev => {
      const existingIndex = prev.findIndex(item => item.key === key);
      if (existingIndex > -1) {
        const newState = [...prev];
        newState[existingIndex] = { ...newState[existingIndex], value };
        return newState;
      } else {
        return [...prev, { key, value } as any];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateContent(localContent as any);
      alert('¡Contenido actualizado correctamente!');
    } catch (err) {
      alert('Error al actualizar el contenido: ' + getFriendlyError(err));
    } finally {
      setSaving(false);
    }
  };

  const renderField = (key: string, label: string, type: 'text' | 'textarea' = 'text') => {
    const item = localContent.find(c => c.key === key);
    const value = item ? item.value : '';

    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={e => handleInputChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={4}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={e => handleInputChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center py-8"><Spinner size="lg" /></div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Error</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Gestión de Contenido</h2>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('home')}
            className={`${activeTab === 'home' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Página de Inicio
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`${activeTab === 'about' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Página Acerca de
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`${activeTab === 'contact' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Contacto y Pie de Página
          </button>
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === 'home' && (
          <Card>
            <CardHeader><h3 className="text-lg font-semibold">Contenido de la Página de Inicio</h3></CardHeader>
            <CardContent className="space-y-4">
              <h4 className="text-md font-semibold">Hero Section</h4>
              {renderField('home_hero_title', 'Título')}
              {renderField('home_hero_subtitle', 'Subtítulo', 'textarea')}
              <h4 className="text-md font-semibold pt-4 border-t">About Preview</h4>
              {renderField('home_about_title', 'Título')}
              {renderField('home_about_p1', 'Párrafo 1', 'textarea')}
              {renderField('home_about_p2', 'Párrafo 2', 'textarea')}
              <h4 className="text-md font-semibold pt-4 border-t">Why Choose Us</h4>
              {renderField('home_why_title', 'Título')}
              {renderField('home_why_subtitle', 'Subtítulo', 'textarea')}
              {renderField('home_why_f1_title', 'Título Característica 1')}
              {renderField('home_why_f1_text', 'Texto Característica 1', 'textarea')}
              {renderField('home_why_f2_title', 'Título Característica 2')}
              {renderField('home_why_f2_text', 'Texto Característica 2', 'textarea')}
              {renderField('home_why_f3_title', 'Título Característica 3')}
              {renderField('home_why_f3_text', 'Texto Característica 3', 'textarea')}
              <h4 className="text-md font-semibold pt-4 border-t">Services</h4>
              {renderField('home_services_title', 'Título')}
              {renderField('home_services_subtitle', 'Subtítulo', 'textarea')}
              <h4 className="text-md font-semibold pt-4 border-t">Testimonials</h4>
              {renderField('home_testimonials_title', 'Título')}
              {renderField('home_testimonials_subtitle', 'Subtítulo', 'textarea')}
              <h4 className="text-md font-semibold pt-4 border-t">Call to Action</h4>
              {renderField('home_cta_title', 'Título')}
              {renderField('home_cta_subtitle', 'Subtítulo', 'textarea')}
            </CardContent>
          </Card>
        )}

        {activeTab === 'about' && (
          <Card>
            <CardHeader><h3 className="text-lg font-semibold">Contenido de la Página 'Acerca de'</h3></CardHeader>
            <CardContent className="space-y-4">
              <h4 className="text-md font-semibold">Hero Section</h4>
              {renderField('about_hero_title', 'Título')}
              {renderField('about_hero_subtitle', 'Subtítulo', 'textarea')}
              <h4 className="text-md font-semibold pt-4 border-t">Biography</h4>
              {renderField('about_bio_title', 'Título')}
              {renderField('about_bio_p1', 'Párrafo 1', 'textarea')}
              {renderField('about_bio_p2', 'Párrafo 2', 'textarea')}
              <h4 className="text-md font-semibold pt-4 border-t">Timeline</h4>
              {renderField('about_timeline_title', 'Título')}
              {renderField('about_timeline_subtitle', 'Subtítulo', 'textarea')}
              {renderField('about_timeline_i1_title', 'Título Elemento 1')}
              {renderField('about_timeline_i1_text', 'Texto Elemento 1', 'textarea')}
              {renderField('about_timeline_i2_title', 'Título Elemento 2')}
              {renderField('about_timeline_i2_text', 'Texto Elemento 2', 'textarea')}
              {renderField('about_timeline_i3_title', 'Título Elemento 3')}
              {renderField('about_timeline_i3_text', 'Texto Elemento 3', 'textarea')}
              {renderField('about_timeline_i4_title', 'Título Elemento 4')}
              {renderField('about_timeline_i4_text', 'Texto Elemento 4', 'textarea')}
              {renderField('about_timeline_i5_title', 'Título Elemento 5')}
              {renderField('about_timeline_i5_text', 'Texto Elemento 5', 'textarea')}
              {renderField('about_timeline_i6_title', 'Título Elemento 6')}
              {renderField('about_timeline_i6_text', 'Texto Elemento 6', 'textarea')}
              <h4 className="text-md font-semibold pt-4 border-t">Call to Action</h4>
              {renderField('about_cta_title', 'Título')}
              {renderField('about_cta_subtitle', 'Subtítulo', 'textarea')}
            </CardContent>
          </Card>
        )}

        {activeTab === 'contact' && (
          <Card>
            <CardHeader><h3 className="text-lg font-semibold">Contenido de Contacto y Pie de Página</h3></CardHeader>
            <CardContent className="space-y-4">
              <h4 className="text-md font-semibold">Página de Contacto</h4>
              {renderField('contact_hero_title', 'Título Principal')}
              {renderField('contact_hero_subtitle', 'Subtítulo Principal', 'textarea')}
              {renderField('contact_form_title', 'Título del Formulario')}
              <h4 className="text-md font-semibold pt-4 border-t">Información de Contacto</h4>
              {renderField('contact_info_email', 'Correo Electrónico')}
              {renderField('contact_info_phone', 'Teléfono')}
              {renderField('contact_info_location', 'Ubicación')}
              {renderField('contact_info_hours', 'Horario')}
              {renderField('contact_info_facebook_url', 'URL de Facebook')}
              {renderField('contact_info_instagram_url', 'URL de Instagram')}
              {renderField('contact_info_youtube_url', 'URL de YouTube')}
              <h4 className="text-md font-semibold pt-4 border-t">Pie de Página</h4>
              {renderField('footer_logo_text', 'Texto del Logo')}
              {renderField('footer_description', 'Descripción', 'textarea')}
              {renderField('footer_copyright', 'Derechos de Autor')}
            </CardContent>
          </Card>
        )}

        <div className="mt-6">
          <Button type="submit" disabled={saving}>
            {saving ? <><Spinner size="sm" className="mr-2" /> Guardando...</> : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
}