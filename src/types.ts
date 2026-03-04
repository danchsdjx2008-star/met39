export interface Movie {
  _id: string;
  name: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  slug: string;
  year: number;
  quality: string;
  lang: string;
  time: string;
  episode_current: string;
  category: { id: string; name: string; slug: string }[];
  country: { id: string; name: string; slug: string }[];
}

export interface MovieDetail extends Movie {
  content: string;
  status: string;
  actor: string[];
  director: string[];
  episodes: {
    server_name: string;
    server_data: {
      name: string;
      slug: string;
      filename: string;
      link_embed: string;
      link_m3u8: string;
    }[];
  }[];
}

export interface APIResponse<T> {
  status: boolean;
  items: T[];
  pathImage: string;
  pagination: {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}
