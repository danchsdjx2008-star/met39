import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '../services/apiService';
import { Movie } from '../types';
import { MovieCard } from '../components/MovieCard';

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  
  const [loading, setLoading] = React.useState(false);
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [pagination, setPagination] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await apiService.searchMovies(query, page);
        setMovies(res.items);
        setPagination(res.pagination);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    window.scrollTo(0, 0);
  }, [query, page]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: query, page: newPage.toString() });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-4xl font-black text-white flex items-center gap-3">
            <SearchIcon className="text-accent" size={32} />
            Kết quả tìm kiếm: <span className="text-accent">"{query}"</span>
          </h1>
          {pagination && (
            <p className="text-text-muted font-medium">
              Tìm thấy {pagination.totalItems} kết quả
            </p>
          )}
        </div>

        {loading ? (
          <div className="h-[50vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={48} />
          </div>
        ) : movies.length > 0 ? (
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
        ) : (
          <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary-bg flex items-center justify-center text-text-muted">
              <SearchIcon size={40} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Không tìm thấy phim nào</h3>
              <p className="text-text-muted">Hãy thử tìm kiếm với từ khóa khác</p>
            </div>
            <Link to="/" className="px-6 py-2 bg-accent text-white rounded-full font-bold mt-4">
              Quay lại trang chủ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
