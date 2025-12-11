import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, BookOpen, ArrowLeft, User, Tag } from 'lucide-react';
import { Button } from '../components/Button';
import { Spinner } from '../components/Spinner';
import { formatDate } from '../lib/utils';
import { blogApi } from '../api/blog';
import type { BlogPost as BlogPostType } from '../types';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError('No se encontró el slug de la publicación.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const fetchedPost = await blogApi.getBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError('Publicación no encontrada.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la publicación.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h3 key={index} className="text-2xl lg:text-3xl font-bold text-slate-800 my-6">
            {paragraph.replace(/\*\*/g, '')}
          </h3>
        );
      }
      return (
        <p key={index} className="text-lg text-slate-700 mb-6 leading-relaxed">
          {paragraph.split(/(\**.*\**)/g).map((part, i) => 
            part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part
          )}
        </p>
      );
    });
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
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Error al Cargar</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link to="/blog"><Button>Volver al Blog</Button></Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Publicación No Encontrada</h2>
          <p className="text-slate-600 mb-6">La publicación que buscas no existe o fue eliminada.</p>
          <Link to="/blog"><Button>Volver al Blog</Button></Link>
        </div>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.image_url,
    "datePublished": post.published_date,
    "dateModified": post.updated_at || post.published_date,
    "author": {
      "@type": "Person",
      "name": "Laura Díaz"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Maestra de Música - Laura Karol",
      "logo": {
        "@type": "ImageObject",
        "url": window.location.origin + "/logo.png"
      }
    },
    "description": post.excerpt || post.content.substring(0, 160)
  };

  return (
    <div className="bg-white">
      <SEO 
        title={post.title}
        description={post.excerpt || post.content.substring(0, 155)}
        image={post.image_url || undefined}
        type="article"
        schema={articleSchema}
      />

      {/* Header Section */}
      <header className="relative py-28 lg:py-40 px-4 bg-slate-800 text-white">
        <img 
          src={post.image_url || 'https://placehold.co/1200x600/d1d5db/374151?text=Blog+Post'} 
          alt={`Imagen principal para el artículo sobre ${post.title}`}
          className="absolute inset-0 w-full h-full object-cover opacity-20" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-300 text-lg">
            <div className="flex items-center"><User className="w-5 h-5 mr-2" /><span>Laura Díaz</span></div>
            <div className="flex items-center"><Calendar className="w-5 h-5 mr-2" /><span>{formatDate(post.published_date)}</span></div>
            <div className="flex items-center"><Tag className="w-5 h-5 mr-2" /><span>Consejos</span></div>
          </div>
        </motion.div>
      </header>

      {/* Blog Post Content */}
      <article className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="prose max-w-none"
          >
            {formatContent(post.content)}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="mt-16 pt-8 border-t border-slate-200 text-center"
          >
            <Link to="/blog">
              <Button variant="secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Blog
              </Button>
            </Link>
          </motion.div>
        </div>
      </article>
    </div>
  );
}