import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { Spinner } from '../components/Spinner';
import { formatDate } from '../lib/utils';

export function BlogCarousel() {
  const { blogPosts, loading, error } = useBlogPosts();

  const getExcerpt = (content: string, maxLength: number = 120) => {
    const plainText = content.replace(/\*\*|\*/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  };

  const featuredPosts = blogPosts.slice(0, 3);

  if (loading) {
    return (
      <section className="py-10 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Últimas Publicaciones del Blog</h2>
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (error || featuredPosts.length === 0) {
    return null; // Don't render section if error or no posts
  }

  return (
    <section className="py-10 sm:py-12 bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">Desde Nuestro Blog</h2>
          <p className="text-lg text-slate-600">Consejos, inspiración y noticias del mundo de la música.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <Card key={post._id} className="hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="h-56 overflow-hidden">
                <img
                  src={post.image_url || '/images/placeholders/elegant_music_education_blog_placeholder.jpg'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-sm text-slate-500 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(post.published_date)}
                </div>
                <h3 className="text-xl font-bold text-slate-800 line-clamp-2 mb-3 flex-grow">{post.title}</h3>
                <p className="text-slate-600 line-clamp-3 mb-6">{getExcerpt(post.content)}</p>
                <Link to={`/blog/${post.slug}`} className="mt-auto">
                  <Button variant="outline" className="w-full">Leer Más <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/blog">
            <Button size="lg">Ver Todas las Publicaciones</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}