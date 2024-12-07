import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { dehydrate, QueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { Button, Spinner } from 'flowbite-react';

import { getUpcomingMovies } from '@/services/tmdb';
import { ResponseData } from '@/interfaces';

import { getGenres } from '@/services/tmdb';
import { useState } from 'react';

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['upcoming-movies'], () => getUpcomingMovies());
  const genres = await getGenres();

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      genres
    }
  };
}

export default function Upcoming({ genres }: { genres: { id: number; name: string }[] }) {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const { data, isFetching, isFetchingNextPage, fetchNextPage } = useInfiniteQuery<ResponseData>({
    queryKey: ['upcoming-movies', selectedGenre],
    queryFn: ({ pageParam = 1 }) =>
      getUpcomingMovies(pageParam).then((movies) =>
        selectedGenre
          ? {
              ...movies,
              results: movies.results.filter((movie: { genre_ids: number[]; }) => movie.genre_ids.includes(selectedGenre))
            }
          : movies
      ),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined
  });

  return (
    <>
      <Head>
        <title>Upcoming Movies</title>
      </Head>
      <div className="p-6 h-[1080px] bg-gray-900 text-white">
        <h2 className="text-3xl text-center font-semibold m-4 md:m-8 mb-8">Upcoming Movies</h2>

        {/* Genre Filter Dropdown */}
        <div className="flex justify-center mb-6">
          <select
            className="block w-1/2 md:w-1/4 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedGenre || ''}
            onChange={(e) => setSelectedGenre(Number(e.target.value) || null)}
          >
            <option value="" className="text-gray-400">
              All Genres
            </option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id} className="text-gray-900">
                {genre.name}
              </option>
            ))}
          </select>
        </div>


        <section className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8 mb-8">
          {data?.pages.map((page) =>
            page.results.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <Image
                  className="rounded-xl"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  width={500}
                  height={700}
                  priority
                  alt={`${movie.title} poster`}
                />
              </Link>
            ))
          )}
        </section>

        <div className="flex items-center justify-center">
          {isFetching || isFetchingNextPage ? (
            <Spinner color="info" aria-label="Info spinner example" size="xl" />
          ) : (
            <Button className="font-medium" onClick={() => fetchNextPage()}>
              Load more
            </Button>
          )}
        </div>
        </div>
    </>
  );
}