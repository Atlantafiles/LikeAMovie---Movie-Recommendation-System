'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { BsFillStarFill } from 'react-icons/bs';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

interface Movie {
  moviesName: string;
  title: string;
  overview: string;
  poster_path: string | null;
  rating: number;
  release: string;
  youtube_link: string | null;
}

export default function NowPlaying() {
  const [prompt, setPrompt] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFallbackMessage, setShowFallbackMessage] = useState(false); // State to toggle fallback message

  const movieList = React.useRef("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMovies([]);
    setExpandedStates([]);
    setShowFallbackMessage(false); // Reset fallback message visibility

    try {
      const response = await axios.post('/api/recommendations/', { prompt });
      const responseData = response.data;
      

      if (responseData.length === 0) {
        setShowFallbackMessage(true);
        setMovies([{ moviesName: "Fallback Recommendation", title: "", overview: "", poster_path: null, rating: 0, release: "", youtube_link: null }]);
      } else {
        setMovies(responseData);
        setExpandedStates(new Array(responseData.length).fill(false));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'An error occurred with the API request');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (index: number) => {
    setExpandedStates((prev) =>
      prev.map((state, i) => (i === index ? !state : state))
    );
  };

  return (
    <>
      <Head>
        <title>Recommendation</title>
      </Head>

      <div className="flex flex-col items-center min-h-screen bg-gray-100 bg-gradient-to-r from-gray-800 via-gray-900 to-black px-4 py-12">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
            Want us to recommend you a movie?
          </h1>
          <p className="text-center text-gray-600 mb-4">
            Describe the type of movie you're in the mood for, and we'll find the perfect recommendations for you!
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., A sci-fi thriller with a futuristic setting"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black"
            />
            <button
              type="submit"
              className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white font-bold hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500 ${
                loading && "opacity-70 cursor-not-allowed"
              }`}
              disabled={loading}
            >
              {loading ? "Finding Movies for you..." : "Submit"}
            </button>
          </form>
          {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        </div>

        {/* Fallback Message */}
        {showFallbackMessage && (
          <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 mb-6">
            
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Sorry, we couldn't find any movies on TMDb.
            </h2>
          </div>
        )}

        {movies.length > 0 && !showFallbackMessage && (
          <div className="w-full max-w-screen-xl">
            <Swiper
              spaceBetween={16}
              slidesPerView={1}
              navigation
              modules={[Navigation]}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="py-6 overflow-visible"
            >
              {movies.map((movie, index) => (
                <SwiperSlide key={index}>
                  <div className="py-10">
                    <div
                      className="w-full p-6 bg-white hover:shadow-lg hover:shadow-cyan-600 rounded-lg shadow-md transition-transform transform hover:-translate-y-5 flex flex-col h-auto"
                    >
                      <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                        {movie.title}
                      </h2>
                      {movie.poster_path && (
                        <img
                          src={movie.poster_path}
                          alt={movie.title}
                          className="w-full h-52 object-cover rounded-lg mb-3"
                        />
                      )}
                      <p className="text-gray-600 text-sm h-28 overflow-y-auto mb-3">
                        {expandedStates[index]
                          ? movie.overview
                          : `${movie.overview.slice(0, 250)}${
                              movie.overview.length > 250 ? '...' : ''
                            }`}
                        {movie.overview.length > 250 && (
                          <button
                            className="text-gray-800 text-sm font-bold focus:outline-none hover:text-cyan-800"
                            onClick={() => toggleExpanded(index)}
                          >
                            {expandedStates[index] ? 'Show Less' : 'Read More'}
                          </button>
                        )}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-lg font-medium text-gray-800 flex items-center space-x-2">
                          <BsFillStarFill className="text-amber-400" />
                          <span>{movie.rating.toFixed(1)}</span>
                        </p>
                        <p className="text-sm text-gray-500">{movie.release}</p>
                      </div>
                      {movie.youtube_link && (
                        <div className="mt-6 mb-3">
                          <a
                            href={movie.youtube_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-800 hover:bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white font-bold py-3 px-5 rounded-full"
                          >
                            Watch Trailer on YouTube
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </>
  );
}
