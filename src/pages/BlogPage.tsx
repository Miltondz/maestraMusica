import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { Spinner } from '../components/Spinner';
import { formatDate } from '../lib/utils';
import type { BlogPost } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

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

export function BlogPage() {
  const { blogPosts, loading, error } = useBlogPosts();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = useMemo(() => {
    if (!blogPosts) return [];
    return blogPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogPosts, searchTerm]);

  const getExcerpt = (content: string, maxLength: number = 150) => {
    const plainText = content.replace(/\*\*|\*/g, ''); // Remove markdown for excerpt
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
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
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Error al Cargar el Blog</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Intentar de Nuevo</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="py-20 sm:py-28 bg-gradient-to-br from-amber-500 to-amber-600 text-white text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 text-amber-200" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Blog de Educación Musical
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto">
            Consejos, inspiración y recursos para tu viaje musical en Venezuela. Clases de música en Falcón, online y más.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="max-w-lg mx-auto relative mt-10"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar artículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 sm:py-4 border-none rounded-full shadow-lg text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all"
          />
        </motion.div>
      </header>

      {/* Blog Posts */}
      <Section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence>
            {filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                  {searchTerm ? 'Sin Resultados' : 'No Hay Publicaciones'}
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  {searchTerm
                    ? `No se encontraron artículos para "${searchTerm}". Intenta una búsqueda diferente.`
                    : 'Vuelve pronto para leer nuevos artículos sobre educación musical y consejos de práctica.'}
                </p>
              </motion.div>
            ) : (
              <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="flex flex-col h-full group">
                      <div className="h-56 overflow-hidden">
                        <img
                          src={post.image_url || 'https://placehold.co/400x200/d1d5db/374151?text=Blog+Post'}
                          alt={`Imagen del artículo de blog: ${post.title}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center text-sm text-slate-500 mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(post.published_date)}
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 line-clamp-2 h-14">
                          {post.title}
                        </h2>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col">
                        <p className="text-slate-600 line-clamp-4 flex-grow mb-6">
                          {getExcerpt(post.content)}
                        </p>
                        <Link to={`/blog/${post.slug}`}>
                          <Button variant="outline" className="w-full">
                            Leer Más
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>

      {/* Newsletter Signup */}
      <Section className="py-16 sm:py-24 bg-amber-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Únete a la Comunidad Musical
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 mb-8">
            Recibe los últimos artículos, consejos y ofertas especiales directamente en tu correo.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="form-input flex-1"
              aria-label="Correo electrónico para newsletter"
            />
            <Button type="submit">
              Suscribirse
            </Button>
          </form>
        </div>
      </Section>
    </div>
  );
}