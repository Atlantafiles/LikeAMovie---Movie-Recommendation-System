import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { Button, Spinner } from 'flowbite-react';

import { searchMovie } from '@/services/tmdb';
import { ResponseData } from '@/interfaces';
import { useEffect } from 'react';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const query = String(ctx.query.query);

  await queryClient.prefetchQuery(['search-movie'], () => searchMovie(query));

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
}

export default function Search() {
  const router = useRouter();
  const query = String(router.query.query);
  const {
    data,
    refetch,
    isRefetching,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery<ResponseData>({
    queryKey: ['search-movie'],
    queryFn: ({ pageParam = 1 }) => searchMovie(query, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined
  });

  useEffect(() => {
    refetch();
  }, [refetch, router.query]);

  return (
    <>
      <Head>
        <title>Search</title>
      </Head>
      <div className="text-white flex flex-col items-center min-h-screen bg-gray-900 px-4 py-12">
      <h2 className="text-white pt-8 text-3xl text-center font-semibold mb-8">
        You searched for: <span className="italic">{query.split('-').join(' ')}</span>
      </h2>
      {data?.pages[0].results.length! > 0 ? (
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
      ) : (
        <p className="text-lg text-center">Your search returned no results</p>
      )}
      <div className="flex items-center justify-center">
        {isRefetching || isFetching || isFetchingNextPage ? (
          <Spinner color="info" aria-label="Info spinner example" size="xl" />
        ) : (
          data?.pages[0].results.length! > 0 && (
            <Button className="font-medium" onClick={() => fetchNextPage()} disabled={!hasNextPage}>
              Load more
            </Button>
          )
        )}
      </div>
      </div>
    </>
  );
}
