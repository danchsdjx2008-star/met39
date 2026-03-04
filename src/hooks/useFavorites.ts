import { useState, useEffect } from 'react';
import { Movie } from '../types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
  }, []);

  const addFavorite = (movie: Movie) => {
    const newFavorites = [...favorites, movie];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const removeFavorite = (slug: string) => {
    const newFavorites = favorites.filter((m) => m.slug !== slug);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (slug: string) => {
    return favorites.some((m) => m.slug === slug);
  };

  const toggleFavorite = (movie: Movie) => {
    if (isFavorite(movie.slug)) {
      removeFavorite(movie.slug);
    } else {
      addFavorite(movie);
    }
  };

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
};
