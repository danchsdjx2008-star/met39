import React from 'react';
import { Heart, Film, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { MovieCard } from '../components/MovieCard';

export const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto min-h-[80vh]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
            <Heart fill="currentColor" size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              Phim yêu thích
            </h1>
            <p className="text-text-muted text-sm">
              Danh sách phim bạn đã lưu để xem sau
            </p>
          </div>
        </div>
        <Link 
          to="/" 
          className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors font-semibold"
        >
          <ArrowLeft size={20} />
          Quay lại
        </Link>
      </div>

      {favorites.length > 0 ? (
        <div className="movie-grid">
          {favorites.map((movie) => (
            <div key={movie.slug}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-secondary-bg/30 rounded-3xl border border-white/5">
          <div className="w-20 h-20 bg-secondary-bg rounded-full flex items-center justify-center text-text-muted mb-6">
            <Film size={40} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Chưa có phim yêu thích</h2>
          <p className="text-text-muted mb-8 text-center max-w-md">
            Hãy khám phá những bộ phim hấp dẫn và nhấn vào nút "Yêu thích" để lưu lại đây nhé!
          </p>
          <Link 
            to="/" 
            className="px-8 py-3 bg-accent hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-accent/20"
          >
            Khám phá ngay
          </Link>
        </div>
      )}
    </div>
  );
};
