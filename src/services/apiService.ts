import { APIResponse, Movie, MovieDetail } from "../types";

const BASE_URL = "https://phimapi.com";

export const apiService = {
  getNewUpdates: async (page: number = 1): Promise<APIResponse<Movie>> => {
    const res = await fetch(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`);
    return res.json();
  },

  getMovieDetail: async (slug: string): Promise<{ movie: MovieDetail }> => {
    const res = await fetch(`/api/movie/${slug}`);
    return res.json();
  },

  getListByType: async (type: string, page: number = 1, limit: number = 20): Promise<APIResponse<Movie>> => {
    const res = await fetch(`${BASE_URL}/v1/api/danh-sach/${type}?page=${page}&limit=${limit}`);
    const data = await res.json();
    return {
      ...data.data,
      pathImage: data.data.params.pagination.pathImage || "https://phimimg.com"
    };
  },

  searchMovies: async (keyword: string, page: number = 1, limit: number = 20): Promise<APIResponse<Movie>> => {
    const res = await fetch(`${BASE_URL}/v1/api/tim-kiem?keyword=${keyword}&page=${page}&limit=${limit}`);
    const data = await res.json();
    return {
      ...data.data,
      pathImage: data.data.params.pagination.pathImage || "https://phimimg.com"
    };
  },

  getGenres: async () => {
    const res = await fetch(`${BASE_URL}/the-loai`);
    return res.json();
  },

  getCountries: async () => {
    const res = await fetch(`${BASE_URL}/quoc-gia`);
    return res.json();
  },

  getImageUrl: (path: string) => {
    if (path.startsWith('http')) return path;
    return `https://phimimg.com/${path}`;
  }
};
