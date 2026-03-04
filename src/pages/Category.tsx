import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Loader2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { apiService } from '../services/apiService';
import { Movie } from '../types';
import { MovieCard } from '../components/MovieCard';

export const Category = () => {
  const { type } = useParams<{ type: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  
  const [loading, setLoading] = React.useState(true);
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [pagination, setPagination] = React.useState<any>(null);

  const titles: Record<string, string> = {
    'phim-bo': 'Phim bộ mới nhất',
    'phim-le': 'Phim lẻ mới nhất',
    'hoat-hinh': 'Phim hoạt hình',
    'phim-moi': 'Phim mới cập nhật',
    'tv-shows': 'TV Shows',
  };

  React.useEffect(() => {
    const fetchList = async () => {
      if (!type) return;
      setLoading(true);
      try {
        let res;
        if (type === 'phim-moi') {
          res = await apiService.getNewUpdates(page);
        } else {
          res = await apiService.getListByType(type, page);
        }
        setMovies(res.items);
        setPagination(res.pagination);
      } catch (error) {
        console.error('Failed to fetch category list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
    window.scrollTo(0, 0);
  }, [type, page]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight border-l-4 border-accent pl-4">
            {titles[type || ''] || 'Danh sách phim'}
          </h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary-bg hover:bg-white/10 text-text-muted hover:text-white rounded-lg transition-all text-sm font-bold border border-white/5">
            <Filter size={18} />
            Bộ lọc
          </button>
        </div>

        {loading ? (
          <div className="h-[50vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={48} />
          </div>
        ) : (
          <>
            <div className="movie-grid">
              {movies.map((movie) => (
                <div key={movie._id}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="p-3 bg-secondary-bg hover:bg-accent text-white rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-accent">{page}</span>
                  <span className="text-text-muted">/</span>
                  <span className="text-lg font-bold text-text-main">{pagination.totalPages}</span>
                </div>
                <button
                  disabled={page === pagination.totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="p-3 bg-secondary-bg hover:bg-accent text-white rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
