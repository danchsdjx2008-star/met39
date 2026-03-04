import React from 'react';
import { apiService } from '../services/apiService';
import { Movie } from '../types';
import { HeroBanner } from '../components/HeroBanner';
import { MovieSection } from '../components/MovieSection';
import { Loader2, History, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  const [loading, setLoading] = React.useState(true);
  const [history, setHistory] = React.useState<any[]>([]);
  const [data, setData] = React.useState<{
    newUpdates: Movie[];
    series: Movie[];
    movies: Movie[];
    animation: Movie[];
  }>({
    newUpdates: [],
    series: [],
    movies: [],
    animation: [],
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [newRes, seriesRes, moviesRes, animationRes] = await Promise.all([
          apiService.getNewUpdates(1),
          apiService.getListByType('phim-bo', 1, 12),
          apiService.getListByType('phim-le', 1, 12),
          apiService.getListByType('hoat-hinh', 1, 12),
        ]);

        setData({
          newUpdates: newRes.items,
          series: seriesRes.items,
          movies: moviesRes.items,
          animation: animationRes.items,
        });

        const savedHistory = JSON.parse(localStorage.getItem('met39_history') || '[]');
        setHistory(savedHistory);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('met39_history');
    setHistory([]);
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="pb-12">
      <HeroBanner movies={data.newUpdates.slice(0, 5)} />
      
      <div className="flex flex-col gap-4 -mt-12 md:-mt-24 relative z-10">
        {/* History Section */}
        {history.length > 0 && (
          <section className="py-8 px-4 md:px-8 max-w-[1400px] mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight border-l-4 border-accent pl-4 flex items-center gap-2">
                <History size={24} className="text-accent" />
                Phim đã xem
              </h2>
              <button 
                onClick={clearHistory}
                className="text-xs font-bold text-text-muted hover:text-accent transition-colors flex items-center gap-1"
              >
                <X size={14} />
                Xóa lịch sử
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {history.map((item) => (
                <Link 
                  key={item.id} 
                  to={`/watch/${item.slug}/${item.episodeSlug}`}
                  className="flex-shrink-0 w-40 md:w-48 group"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-2 border border-white/5">
                    <img 
                      src={apiService.getImageUrl(item.thumb)} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white">
                          <History size={20} />
                       </div>
                    </div>
                    <div className="absolute bottom-1 right-1 px-2 py-0.5 bg-accent text-white text-[10px] font-bold rounded">
                      Tập {item.episode}
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-text-main line-clamp-1 group-hover:text-accent transition-colors">
                    {item.name}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        <MovieSection 
          title="Mới cập nhật" 
          movies={data.newUpdates} 
          viewAllPath="/type/phim-moi" 
        />
        <MovieSection 
          title="Phim bộ hot" 
          movies={data.series} 
          viewAllPath="/type/phim-bo" 
        />
        <MovieSection 
          title="Phim lẻ mới" 
          movies={data.movies} 
          viewAllPath="/type/phim-le" 
        />
        <MovieSection 
          title="Phim hoạt hình" 
          movies={data.animation} 
          viewAllPath="/type/hoat-hinh" 
        />
      </div>
    </div>
  );
};
