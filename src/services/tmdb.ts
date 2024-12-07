import axios from 'axios';

const tmdb = axios.create({ baseURL: 'https://api.themoviedb.org/3' });
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function getMovieDetails(movieId: number) {
  const response = await tmdb.get(`/movie/${movieId}?api_key=${TMDB_API_KEY}`);

  return response.data;
}

export async function getPopularMovies(page: number = 1) {
  const response = await tmdb.get(`movie/popular?page=${page}&api_key=${TMDB_API_KEY}`);

  return response.data;
}

export async function getNowPlayingMovies(page: number = 1) {
  const response = await tmdb.get(`movie/now_playing?page=${page}&api_key=${TMDB_API_KEY}`);

  return response.data;
}

export async function getUpcomingMovies(page: number = 1) {
  const response = await tmdb.get(`movie/upcoming?page=${page}&api_key=${TMDB_API_KEY}`);

  return response.data;
}
export async function getGenres() {
  const response = await tmdb.get(`/genre/movie/list?api_key=${TMDB_API_KEY}`);
  return response.data.genres; 
}

export async function getTopRatedMovies(page: number = 1) {
  const response = await tmdb.get(`movie/top_rated?page=${page}&api_key=${TMDB_API_KEY}`);

  return response.data;
}

export async function searchMovie(query: string, page: number = 1) {
  const response = await tmdb.get(
    `/search/movie?query=${query}&page=${page}&api_key=${TMDB_API_KEY}`
  );

  return response.data;
}
