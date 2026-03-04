import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Plus, Share2, Star, Calendar, Clock, Globe, Tag, Loader2, ChevronRight, Heart } from 'lucide-react';
import { apiService } from '../services/apiService';
import { MovieDetail as IMovieDetail, Movie } from '../types';
import { MovieSection } from '../components/MovieSection';
import { cn } from '../utils/cn';
import { useFavorites } from '../hooks/useFavorites';

export const MovieDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [movie, setMovie] = React.useState<IMovieDetail | null>(null);
  const [related, setRelated] = React.useState<Movie[]>([]);
  const { toggleFavorite, isFavorite } = useFavorites();

  React.useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const { movie: detail } = await apiService.getMovieDetail(slug);
        setMovie(detail);
        
        // Fetch related movies (using first category)
        if (detail.category?.[0]) {
          const relatedRes = await apiService.getListByType('phim-moi', 1, 12);
          setRelated(relatedRes.items);
        }
      } catch (error) {
        console.error('Failed to fetch movie detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Không tìm thấy phim</h2>
        <Link to="/" className="text-accent hover:underline">Quay lại trang chủ</Link>
      </div>
    );
  }

  const isFav = isFavorite(movie.slug);

  return (
    <div className="pb-20">
      {/* Backdrop */}
      <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
        <img
          src={apiService.getImageUrl(movie.poster_url)}
          alt={movie.name}
          className="w-full h-full object-cover opacity-30 blur-sm"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-main-bg via-main-bg/60 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 -mt-64 md:-mt-96 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={apiService.getImageUrl(movie.thumb_url)}
                alt={movie.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="mt-6 flex flex-col gap-3">
              {movie.episodes?.[0]?.server_data?.length ? (
                <Link
                  to={`/watch/${movie.slug}/${movie.episodes[0].server_data[0].slug}`}
                  className="w-full py-4 bg-accent hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/20"
                >
                  <Play fill="currentColor" size={20} />
                  XEM PHIM NGAY
                </Link>
              ) : (
                <Link
                  to={`/watch/${movie.slug}/tap-1`}
                  className="w-full py-4 bg-accent hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/20"
                >
                  <Play fill="currentColor" size={20} />
                  XEM PHIM
                </Link>
              )}
              <div className="flex gap-3">
                <button 
                  onClick={() => toggleFavorite(movie)}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                    isFav 
                      ? "bg-accent text-white hover:bg-red-700" 
                      : "bg-secondary-bg hover:bg-white/10 text-white"
                  )}
                >
                  {isFav ? <Heart size={18} fill="currentColor" /> : <Plus size={18} />}
                  {isFav ? 'Đã thích' : 'Yêu thích'}
                </button>
                <button className="p-3 bg-secondary-bg hover:bg-white/10 text-white rounded-xl transition-all">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                {movie.name}
              </h1>
              <p className="text-xl md:text-2xl text-text-muted font-medium italic">
                {movie.origin_name} ({movie.year})
              </p>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-1 text-yellow-500 font-bold">
                <Star size={18} fill="currentColor" />
                <span>8.5</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-text-muted opacity-50" />
              <div className="flex items-center gap-1.5 text-text-muted text-sm font-medium">
                <Calendar size={16} className="text-accent" />
                {movie.year}
              </div>
              <span className="w-1 h-1 rounded-full bg-text-muted opacity-50" />
              <div className="flex items-center gap-1.5 text-text-muted text-sm font-medium">
                <Clock size={16} className="text-accent" />
                {movie.time || 'N/A'}
              </div>
              <span className="w-1 h-1 rounded-full bg-text-muted opacity-50" />
              <div className="flex items-center gap-1.5 text-text-muted text-sm font-medium">
                <Globe size={16} className="text-accent" />
                {movie.country?.[0]?.name || 'N/A'}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.category?.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="px-3 py-1 bg-secondary-bg hover:bg-accent hover:text-white text-text-muted text-xs font-bold rounded-full transition-all border border-white/5"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="bg-secondary-bg/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Tag size={18} className="text-accent" />
                Nội dung phim
              </h3>
              <div 
                className="text-text-muted leading-relaxed text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: movie.content }}
              />
            </div>

            {/* Episode List (Quick View) */}
            {movie.episodes?.[0]?.server_data?.length > 1 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold uppercase tracking-wider border-l-4 border-accent pl-4">
                  Danh sách tập
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {movie.episodes[0].server_data.map((ep) => (
                    <Link
                      key={ep.slug}
                      to={`/watch/${movie.slug}/${ep.slug}`}
                      className="aspect-square flex items-center justify-center bg-secondary-bg hover:bg-accent text-white font-bold rounded-lg transition-all text-sm border border-white/5"
                    >
                      {ep.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Movies */}
      <div className="mt-12">
        <MovieSection title="Có thể bạn thích" movies={related} />
      </div>
    </div>
  );
};
