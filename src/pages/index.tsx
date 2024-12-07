import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
// import { dehydrate, QueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { Button} from 'flowbite-react';

// import { getPopularMovies } from '@/services/tmdb';
// import { ResponseData } from '@/interfaces';
import React from "react";


const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>LikeaMovie - Movie Recommendations</title>
        <meta name="description" content="Discover movies based on your mood and preferences." />
      </Head>
      <section className="relative bg-hero-pattern bg-cover bg-center h-[1080px] text-white flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-60"></div> {/* Overlay */}
      <div className="relative text-center grid h-full w-full">
        <div className="flex flex-col items-center justify-center h-full w-full">
          <h2 className="text-4xl font-bold mb-4 text-white">Discover Movies You'll Love</h2>
          <p className="mb-6 font-semibold text-base text-white">Your next favorite movie is just a click away!</p>
          <Link href="/movie/get-recommendation">
          <Button
            style={{
              padding: '14px 26px',
              backgroundColor: '#b91c1c',
              borderRadius: '0.5rem',
              color: 'white',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#e11d48';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#b91c1c';
            }}
          >
            Find Movies
          </Button>
          </Link>
        </div>
      </div>
    </section>
    </>
  );
};

export default Home;



// export async function getStaticProps() {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery(['popular-movies'], () => getPopularMovies());

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient)
//     }
//   };
// }



//<section className="bg-hero-pattern bg-cover bg-center h-[50vh] text-white flex items-center justify-center"></section>

// export default function Home() {
//   const { data, isFetching, isFetchingNextPage, fetchNextPage } = useInfiniteQuery<ResponseData>({
//     queryKey: ['popular-movies'],
//     queryFn: ({ pageParam = 1 }) => getPopularMovies(pageParam),
//     getNextPageParam: (lastPage) =>
//       lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined
//   });

//   return (
//     <div>
//       <Head>
//         <title>LikeaMovie</title>
//       </Head>
//       <div className="p-6 h-[1080px] bg-gray-900 text-white">
           
//         <div className="flex items-center justify-center">
//           {isFetching || isFetchingNextPage ? (
//             <Spinner color="info" aria-label="Info spinner example" size="xl" />
//           ) : (
//             <Button className="font-medium" onClick={() => fetchNextPage()}>
//               Load more
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>  
//   );
// }
