import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Loader2, ChevronRight, List, Info, History, ArrowLeft, ArrowRight, Settings } from 'lucide-react';
import { apiService } from '../services/apiService';
import { MovieDetail as IMovieDetail, Movie } from '../types';
import { MovieSection } from '../components/MovieSection';
import { cn } from '../utils/cn';

export const Watch = () => {
  const { slug, episodeSlug } = useParams<{ slug: string; episodeSlug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [movie, setMovie] = React.useState<IMovieDetail | null>(null);
  const [currentEpisode, setCurrentEpisode] = React.useState<any>(null);
  const [related, setRelated] = React.useState<Movie[]>([]);
  const [autoNext, setAutoNext] = React.useState(true);

  React.useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const { movie: detail } = await apiService.getMovieDetail(slug);
        setMovie(detail);
        
        // Find current episode
        const ep = detail.episodes?.[0]?.server_data?.find(e => e.slug === episodeSlug) 
                || detail.episodes?.[0]?.server_data?.[0];
        setCurrentEpisode(ep);

        // Save to history
        const history = JSON.parse(localStorage.getItem('met39_history') || '[]');
        const newHistory = [
          { 
            id: detail._id, 
            name: detail.name, 
            slug: detail.slug, 
            thumb: detail.thumb_url, 
            episode: ep?.name,
            episodeSlug: ep?.slug,
            time: new Date().getTime() 
          },
          ...history.filter((h: any) => h.id !== detail._id)
        ].slice(0, 20);
        localStorage.setItem('met39_history', JSON.stringify(newHistory));

        // Fetch related
        const relatedRes = await apiService.getListByType('phim-moi', 1, 12);
        setRelated(relatedRes.items);
      } catch (error) {
        console.error('Failed to fetch watch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug, episodeSlug]);

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
        <div className="w-20 h-20 rounded-full bg-secondary-bg flex items-center justify-center text-accent animate-pulse">
           <Info size={40} />
        </div>
        <h2 className="text-2xl font-bold">Không tìm thấy phim</h2>
        <p className="text-text-muted">ID phim không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <Link to="/" className="text-accent font-bold hover:underline">Quay lại trang chủ</Link>
      </div>
    );
  }

  if (!currentEpisode) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-full bg-secondary-bg flex items-center justify-center text-accent">
           <Play size={40} />
        </div>
        <h2 className="text-2xl font-bold">Không tìm thấy tập phim</h2>
        <p className="text-text-muted text-center max-w-md">
          Phim này hiện chưa có tập nào được cập nhật hoặc link video đã bị lỗi. 
          Vui lòng quay lại sau hoặc báo lỗi cho admin.
        </p>
        <div className="flex gap-4">
          <Link to={`/movie/${movie.slug}`} className="px-6 py-2 bg-secondary-bg text-white rounded-full font-bold">
            Chi tiết phim
          </Link>
          <Link to="/" className="px-6 py-2 bg-accent text-white rounded-full font-bold">
            Trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const episodes = movie.episodes?.[0]?.server_data || [];
  const currentIndex = episodes.findIndex(e => e.slug === currentEpisode.slug);
  const prevEp = episodes[currentIndex - 1];
  const nextEp = episodes[currentIndex + 1];

  return (
    <div className="pb-20">
      {/* Player Area */}
      <div className="bg-black w-full aspect-video md:max-h-[80vh] relative group">
        <iframe
          src={currentEpisode.link_embed}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          title={movie.name}
        />
      </div>

      {/* Info & Controls */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Info & Episodes */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl md:text-3xl font-black text-white">
                    {movie.name} - Tập {currentEpisode.name}
                  </h1>
                  <p className="text-text-muted font-medium italic">
                    {movie.origin_name}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setAutoNext(!autoNext)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border",
                      autoNext ? "bg-accent/10 border-accent text-accent" : "bg-secondary-bg border-white/5 text-text-muted"
                    )}
                  >
                    <Settings size={14} />
                    Auto Next: {autoNext ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {prevEp && (
                  <Link
                    to={`/watch/${movie.slug}/${prevEp.slug}`}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary-bg hover:bg-white/10 text-white text-sm font-bold rounded-lg transition-all border border-white/5"
                  >
                    <ArrowLeft size={16} />
                    Tập trước
                  </Link>
                )}
                {nextEp && (
                  <Link
                    to={`/watch/${movie.slug}/${nextEp.slug}`}
                    className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-accent/20"
                  >
                    Tập tiếp theo
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>

            {/* Episode Selection */}
            <div className="bg-secondary-bg/30 p-6 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <List size={20} className="text-accent" />
                  Danh sách tập
                </h3>
                <span className="text-xs text-text-muted font-medium">
                  {episodes.length} tập
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {episodes.map((ep) => (
                  <Link
                    key={ep.slug}
                    to={`/watch/${movie.slug}/${ep.slug}`}
                    className={cn(
                      "aspect-square flex items-center justify-center font-bold rounded-lg transition-all text-sm border",
                      ep.slug === currentEpisode.slug 
                        ? "bg-accent border-accent text-white shadow-lg shadow-accent/20" 
                        : "bg-secondary-bg border-white/5 text-text-muted hover:text-white hover:bg-white/10"
                    )}
                  >
                    {ep.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Movie Info Snippet */}
            <div className="flex flex-col gap-4">
               <h3 className="text-lg font-bold flex items-center gap-2">
                  <Info size={20} className="text-accent" />
                  Thông tin phim
                </h3>
                <div 
                  className="text-text-muted text-sm leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: movie.content }}
                />
                <Link to={`/movie/${movie.slug}`} className="text-accent text-sm font-bold hover:underline flex items-center gap-1">
                  Xem chi tiết nội dung <ChevronRight size={14} />
                </Link>
            </div>
          </div>

          {/* Right: Sidebar / Related */}
          <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold flex items-center gap-2 uppercase tracking-wider">
                <History size={20} className="text-accent" />
                Phim liên quan
              </h3>
              <div className="flex flex-col gap-4">
                {related.slice(0, 6).map((m) => (
                  <Link 
                    key={m._id} 
                    to={`/movie/${m.slug}`}
                    className="flex gap-3 group"
                  >
                    <div className="w-20 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                      <img 
                        src={apiService.getImageUrl(m.thumb_url)} 
                        alt={m.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                      <h4 className="text-sm font-bold text-text-main line-clamp-2 group-hover:text-accent transition-colors">
                        {m.name}
                      </h4>
                      <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                        {m.year} • {m.quality}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
