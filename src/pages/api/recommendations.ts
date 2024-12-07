import { NextApiRequest, NextApiResponse } from 'next';
const { GoogleGenerativeAI } = require('@google/generative-ai');
import axios from 'axios';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;
      console.log('Received prompt:', prompt);

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      console.log('Calling Gemini API');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const result = await model.generateContent([
        { text: 'You are a helpful assistant that recommends movies. Respond with a list of four movie titles, separated by commas.' },
        { text: `Suggest movies based on the following description: ${prompt}; which is available in TMDB database.` },
      ]);

      const response = await result.response;
      const movieTitles = response.text().trim().split(',').map((title: string) => title.trim());
      console.log('Gemini suggested movies:', movieTitles);

      if (!movieTitles.length) {
        return res.status(500).json({ error: 'Failed to generate movie recommendations' });
      }

      const tmdbApiKey = process.env.TMDB_API_KEY;
      if (!tmdbApiKey) {
        return res.status(500).json({ error: 'TMDB API key is not configured' });
      }

      // Fetch details for each movie
      const movieDetails = await Promise.all(
        movieTitles.map(async (title: string | number | boolean) => {
          const tmdbResponse = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(title)}`
          );

          const movie = tmdbResponse.data.results[0];
          if (!movie) return null;

          const videosResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${tmdbApiKey}`
          );

          const trailers = videosResponse.data.results;
          const youtubeTrailer = trailers.find(
            (trailer: { site: string; type: string }) => trailer.site === 'YouTube' && trailer.type === 'Trailer'
          );

          return {
            movies: movieTitles,
            title: movie.title,
            overview: movie.overview,
            poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
            rating: movie.vote_average,
            release: movie.release_date,
            youtube_link: youtubeTrailer ? `https://www.youtube.com/watch?v=${youtubeTrailer.key}` : null,
          };
        })
      );

      const filteredMovies = movieDetails.filter((movie) => movie !== null);
      return res.json(filteredMovies);
    } catch (error) {
      console.error('API route error:', error);
      return res.status(500).json({ error: `API route error: ${(error as Error).message}` });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
