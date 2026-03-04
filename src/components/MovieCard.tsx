import { Link } from 'react-router-dom';
import { Play, Star, Heart } from 'lucide-react';
import { Movie } from '../types';
import { apiService } from '../services/apiService';
import { cn } from '../utils/cn';
import { useFavorites } from '../hooks/useFavorites';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export const MovieCard = ({ movie, className }: MovieCardProps) => {
  const isVietsub = movie.lang?.toLowerCase().includes('vietsub');
  const isThuyetMinh = movie.lang?.toLowerCase().includes('thuyết minh');
  const { isFavorite } = useFavorites();
  const isFav = isFavorite(movie.slug);
  
  return (
    <Link 
      to={`/movie/${movie.slug}`}
      className={cn("group relative flex flex-col gap-2", className)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-secondary-bg shadow-lg">
        <img
          src={apiService.getImageUrl(movie.poster_url || movie.thumb_url)}
          alt={movie.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
            <Play fill="currentColor" size={24} className="ml-1" />
          </div>
        </div>

        {/* Favorite Badge */}
        {isFav && (
          <div className="absolute top-2 right-2 z-10">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white shadow-lg">
              <Heart fill="currentColor" size={16} />
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {movie.quality && (
            <span className="px-2 py-0.5 bg-white text-black text-[10px] font-bold rounded uppercase">
              {movie.quality}
            </span>
          )}
          {movie.lang && (
            <span className={cn(
              "px-2 py-0.5 text-[10px] font-bold rounded uppercase",
              isVietsub ? "bg-accent text-white" : "bg-blue-600 text-white"
            )}>
              {movie.lang}
            </span>
          )}
        </div>

        {/* Episode/Year Label */}
        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium rounded-md border border-white/10">
            {movie.episode_current || movie.year}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 px-1">
        <h3 className="text-sm font-bold text-text-main line-clamp-1 group-hover:text-accent transition-colors">
          {movie.name}
        </h3>
        <p className="text-xs text-text-muted line-clamp-1 font-medium">
          {movie.origin_name}
        </p>
      </div>
    </Link>
  );
};
