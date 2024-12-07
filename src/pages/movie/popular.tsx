import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { dehydrate, QueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { Button, Spinner } from 'flowbite-react';

import { getPopularMovies } from '@/services/tmdb';
import { ResponseData } from '@/interfaces';

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['popular-movies'], () => getPopularMovies());

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
}

export default function Home() {
  const { data, isFetching, isFetchingNextPage, fetchNextPage } = useInfiniteQuery<ResponseData>({
    queryKey: ['popular-movies'],
    queryFn: ({ pageParam = 1 }) => getPopularMovies(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined
  });

  return (
    <div>
      <Head>
        <title>LikeaMovie</title>
      </Head>
      <div className="p-6 h-[1080px] bg-gray-900 text-white">
        <h2 className="text-3xl text-center font-semibold m-4 md:m-8 mb-8">Popular Movies</h2>
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
    </div>  
  );
}