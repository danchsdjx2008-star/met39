import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, Play, Heart } from 'lucide-react';
import { cn } from '../utils/cn';

export const Header = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Phim lẻ', path: '/type/phim-le' },
    { name: 'Phim bộ', path: '/type/phim-bo' },
    { name: 'Hoạt hình', path: '/type/hoat-hinh' },
    { name: 'Yêu thích', path: '/favorites' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 h-16 md:h-20 flex items-center justify-between',
        isScrolled ? 'bg-main-bg/95 backdrop-blur-md shadow-lg border-b border-white/5' : 'bg-gradient-to-b from-black/60 to-transparent'
      )}
    >
      <div className="flex items-center gap-8 max-w-[1400px] mx-auto w-full">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start group">
          <span className="text-2xl md:text-3xl font-black text-accent tracking-tighter group-hover:scale-105 transition-transform">
            MET39
          </span>
          <span className="text-[10px] text-text-muted uppercase tracking-widest font-medium -mt-1 hidden md:block">
            Điện ảnh : nơi phản chiếu những ước mơ
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-semibold text-text-muted hover:text-accent transition-colors uppercase tracking-wide"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Search & Actions */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex relative w-full max-w-xs group">
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary-bg/50 border border-white/10 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-accent/50 focus:bg-secondary-bg transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent">
              <Search size={18} />
            </button>
          </form>

          <Link to="/favorites" className="p-2 text-text-muted hover:text-accent transition-colors hidden md:block">
            <Heart size={22} />
          </Link>

          <button className="p-2 text-text-muted hover:text-accent transition-colors hidden md:block">
            <User size={22} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-text-main"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 md:top-20 bg-main-bg z-40 lg:hidden flex flex-col p-6 gap-8 animate-in slide-in-from-right duration-300">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary-bg border border-white/10 rounded-xl py-4 pl-4 pr-12 text-lg focus:outline-none focus:border-accent"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
              <Search size={24} />
            </button>
          </form>

          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-bold text-text-main hover:text-accent transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-white/5 pt-6 flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-secondary-bg flex items-center justify-center text-accent">
                <User size={24} />
             </div>
             <div>
                <p className="font-bold">Khách</p>
                <p className="text-sm text-text-muted">Đăng nhập để lưu lịch sử</p>
             </div>
          </div>
        </div>
      )}
    </header>
  );
};
