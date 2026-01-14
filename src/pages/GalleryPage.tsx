import React, { useState, useMemo } from 'react';
import { Image as ImageIcon, Video, Youtube, Instagram, Star, Filter, X } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Spinner } from '../components/Spinner';
import { useMediaGallery } from '../hooks/useMediaGallery';
import { extractYouTubeId } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export { GalleryPage };

type MediaType = 'all' | 'photo' | 'video' | 'youtube' | 'instagram';
type CategoryType = 'all' | 'lecciones' | 'performances' | 'testimonios' | 'eventos' | 'general';

function GalleryPage() {
  const { mediaItems, loading, error, fetchMediaItems } = useMediaGallery();
  const [filterType, setFilterType] = useState<MediaType>('all');
  const [filterCategory, setFilterCategory] = useState<CategoryType>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<typeof mediaItems[0] | null>(null);

  const filteredMedia = useMemo(() => {
    return mediaItems.filter(item => {
      const typeMatch = filterType === 'all' || item.media_type === filterType;
      const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
      return typeMatch && categoryMatch;
    });
  }, [mediaItems, filterType, filterCategory]);

  const openLightbox = (item: any) => {
    setCurrentMedia(item);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentMedia(null);
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'photo': return ImageIcon;
      case 'video': return Video;
      case 'youtube': return Youtube;
      case 'instagram': return Instagram;
      default: return ImageIcon;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Error al Cargar la Galería</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={() => fetchMediaItems()}>Intentar de Nuevo</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="py-20 sm:py-28 bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <ImageIcon className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 text-purple-200" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Galería de Momentos Musicales
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
            Explora fotos y videos de nuestras clases de música, eventos y logros de estudiantes en toda Venezuela.
          </p>
        </motion.div>
      </header>

      {/* Filters */}
      <section className="py-8 sm:py-12 bg-slate-50 border-b border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center items-center">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-500" />
            <span className="font-medium text-slate-700">Filtrar por:</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as MediaType)}
              className="form-input w-full sm:w-auto"
            >
              <option value="all">Todos los Tipos</option>
              <option value="photo">Fotos</option>
              <option value="video">Videos</option>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as CategoryType)}
              className="form-input w-full sm:w-auto"
            >
              <option value="all">Todas las Categorías</option>
              <option value="lecciones">Lecciones</option>
              <option value="performances">Presentaciones</option>
              <option value="testimonios">Testimonios</option>
              <option value="eventos">Eventos</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </section>

      {/* Media Grid */}
      <main className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence>
            <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {filteredMedia.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full text-center py-16"
                >
                  <ImageIcon className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300 mx-auto mb-6" />
                  <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-3">No se Encontraron Resultados</h3>
                  <p className="text-base sm:text-lg text-slate-500">Intenta ajustar los filtros para encontrar lo que buscas.</p>
                </motion.div>
              ) : (
                filteredMedia.map((item, index) => {
                  const IconComponent = getMediaIcon(item.media_type);
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="cursor-pointer group"
                      onClick={() => openLightbox(item)}
                    >
                      <Card className="h-full overflow-hidden">
                        <div className="relative h-48 sm:h-56 bg-slate-100">
                          <img
                            src={item.media_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/50 text-white p-1.5 rounded-full">
                            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          {item.is_featured && (
                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-amber-500 text-white px-2 py-1 text-xs font-bold rounded-full flex items-center shadow-lg">
                              <Star className="w-3 h-3 mr-1" />
                              DESTACADO
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 p-2 sm:p-4">
                            <h3 className="font-bold text-white text-sm sm:text-lg leading-tight line-clamp-2">{item.title}</h3>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && currentMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the content
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={closeLightbox}
                className="absolute top-2 right-2 z-10 text-slate-100 bg-black/40 rounded-full hover:bg-white hover:text-amber-500 w-10 h-10"
              >
                <X className="w-6 h-6" />
              </Button>

              <div className="flex-grow p-2 sm:p-4 flex items-center justify-center">
                {currentMedia.media_type === 'photo' && (
                  <img src={currentMedia.media_url} alt={currentMedia.title} className="w-full h-auto max-h-[75vh] object-contain" />
                )}
                {currentMedia.media_type === 'youtube' && (
                  <div className="w-full aspect-w-16 aspect-h-9">
                    <iframe src={`https://www.youtube.com/embed/${extractYouTubeId(currentMedia.media_url)}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" title={currentMedia.title}></iframe>
                  </div>
                )}
                {currentMedia.media_type === 'video' && (
                  <video controls className="w-full h-auto max-h-[75vh]"><source src={currentMedia.media_url} type="video/mp4" />Tu navegador no soporta videos.</video>
                )}
                {currentMedia.media_type === 'instagram' && (
                  <div className="w-full max-w-md mx-auto my-10">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-pink-200 rounded-lg p-8 text-center">
                      <Instagram className="w-16 h-16 text-pink-500 mx-auto mb-6" />
                      <h4 className="text-xl font-bold text-slate-800 mb-2">{currentMedia.title}</h4>
                      <p className="text-slate-600 text-sm mb-6 uppercase tracking-wider">{currentMedia.category}</p>
                      <a href={currentMedia.media_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary">Ver en Instagram</Button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 mt-auto border-t border-slate-200">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800">{currentMedia.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 mt-1 uppercase tracking-wider">{currentMedia.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}