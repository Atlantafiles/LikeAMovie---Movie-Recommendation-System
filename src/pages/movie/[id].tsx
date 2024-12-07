import Head from 'next/head';
import Image from 'next/image';
import { GetServerSidePropsContext } from 'next';
import axios from 'axios';

import { getMovieDetails } from '@/services/tmdb';
import { MovieData } from '@/interfaces';


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const movieId = Number(ctx.query.id);
  const data = await getMovieDetails(movieId);

  const tmdbApiKey = process.env.TMDB_API_KEY;
  const videosResponse = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${tmdbApiKey}`
  );

  const trailers = videosResponse.data.results;
  const youtubeTrailer = trailers.find(
    (trailer: { site: string; type: string }) => trailer.site === 'YouTube' && trailer.type === 'Trailer'
  );

  return {
    props: { data, youtube_link: youtubeTrailer ? `https://www.youtube.com/watch?v=${youtubeTrailer.key}` : null },
    
  };
}

interface MovieProps {
  data: MovieData;
  youtube_link: string | null;
}



export default function Movie({ data, youtube_link}: MovieProps) {
  return (

    <>
  <Head>
    <title>{data.title}</title>
  </Head>
  <div className="p-6 h-[1080px] bg-gray-900 text-white">
    <h2 className="text-4xl text-center font-bold mb-4">{`${data.title} (${new Date(
      data.release_date!
    ).getFullYear()})`}</h2>
    <h4 className="text-lg text-center text-gray-300 font-medium mb-6">
      {`${data.production_companies[0]?.name || 'Unknown'} | ${data.genres[0]?.name || 'Unknown'} | ${Math.floor(
        data.runtime! / 60
      )}h ${data.runtime! % 60}m`}
    </h4>
    <section className="flex flex-col md:flex-row bg-gray-800 p-6 rounded-lg shadow-lg">
      <Image
        className="w-full md:w-[300px] mx-auto md:mx-0 rounded-xl md:mr-8 shadow-md"
        src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
        width={300}
        height={700}
        priority
        alt={`${data.title} poster`}
      />
      <section className="mt-6 md:mt-0 flex-grow">
        <div className="mb-6 text-center md:text-left">
          <p className="text-xl font-semibold italic text-gray-300">{data.tagline}</p>
        </div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Overview</h3>
          <p className="text-gray-400 leading-relaxed">{data.overview}</p>
        </div>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xl font-semibold">User Score</h4>
            <p className="text-2xl font-bold text-green-400">{Math.round(data.vote_average * 10)}%</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold">Status</h4>
            <p className="text-gray-300">{data.status}</p>
          </div>
        </div>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xl font-semibold">Budget</h4>
            <p className="text-gray-300">
              {data.budget
                ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.budget)
                : 'Not Informed'}
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold">Revenue</h4>
            <p className="text-gray-300">
              {data.revenue
                ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.revenue)
                : 'Not Informed'}
            </p>
          </div>
        </div>
        {data.homepage && (
          <div className="mb-6">
            <a
              className="underline text-blue-400 hover:text-blue-300"
              href={data.homepage}
              target="_blank"
              rel="noreferrer"
            >
              Visit the movie homepage
            </a>
          </div>
        )}
        {youtube_link && (
          <div className="mt-8 text-center">
            <a
              href={youtube_link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:from-blue-400 hover:to-indigo-500 transition"
            >
              Watch Trailer on YouTube
            </a>
          </div>
        )}
      </section>
    </section>
  </div>
</>

  );
}
