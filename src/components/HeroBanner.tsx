import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Play, Info, Calendar, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';
import { apiService } from '../services/apiService';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HeroBannerProps {
  movies: Movie[];
}

export const HeroBanner = ({ movies }: HeroBannerProps) => {
  return (
    <section className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-full w-full"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie._id}>
            <div className="relative h-full w-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={apiService.getImageUrl(movie.poster_url || movie.thumb_url)}
                  alt={movie.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-main-bg via-main-bg/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-main-bg via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col justify-center gap-4 md:gap-6">
                <div className="flex flex-col gap-2 animate-in slide-in-from-left duration-700">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-accent text-white text-[10px] md:text-xs font-bold rounded uppercase tracking-wider">
                      {movie.quality}
                    </span>
                    <span className="flex items-center gap-1 text-xs md:text-sm text-text-muted font-medium">
                      <Calendar size={14} className="text-accent" />
                      {movie.year}
                    </span>
                    <span className="flex items-center gap-1 text-xs md:text-sm text-text-muted font-medium">
                      <Clock size={14} className="text-accent" />
                      {movie.time || 'N/A'}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl md:text-6xl font-black text-white max-w-2xl leading-[1.1] tracking-tight">
                    {movie.name}
                  </h1>
                  <p className="text-lg md:text-xl text-text-muted font-medium italic opacity-80">
                    {movie.origin_name}
                  </p>
                </div>

                <div className="flex items-center gap-4 animate-in slide-in-from-left duration-1000 delay-200">
                  <Link
                    to={`/movie/${movie.slug}`}
                    className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-accent hover:bg-red-700 text-white rounded-full font-bold transition-all hover:scale-105 shadow-xl shadow-accent/20"
                  >
                    <Play fill="currentColor" size={20} />
                    Xem ngay
                  </Link>
                  <Link
                    to={`/movie/${movie.slug}`}
                    className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full font-bold transition-all"
                  >
                    <Info size={20} />
                    Chi tiết
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
