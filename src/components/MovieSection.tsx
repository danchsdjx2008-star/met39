import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  viewAllPath?: string;
}

export const MovieSection = ({ title, movies, viewAllPath }: MovieSectionProps) => {
  return (
    <section className="py-8 px-4 md:px-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight border-l-4 border-accent pl-4">
          {title}
        </h2>
        {viewAllPath && (
          <Link 
            to={viewAllPath} 
            className="flex items-center gap-1 text-sm font-bold text-text-muted hover:text-accent transition-colors group"
          >
            Xem tất cả
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      <Swiper
        modules={[Navigation, FreeMode]}
        navigation
        freeMode
        spaceBetween={16}
        slidesPerView={2.2}
        breakpoints={{
          640: { slidesPerView: 3.2, spaceBetween: 20 },
          768: { slidesPerView: 4.2, spaceBetween: 20 },
          1024: { slidesPerView: 5.2, spaceBetween: 24 },
          1280: { slidesPerView: 6.2, spaceBetween: 24 },
        }}
        className="movie-slider !overflow-visible"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie._id}>
            <MovieCard movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
