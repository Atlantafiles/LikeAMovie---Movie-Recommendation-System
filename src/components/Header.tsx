import { useRef, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Navbar, TextInput } from 'flowbite-react';
import { BsCameraReelsFill, BsSearch } from 'react-icons/bs';

const navLinks = [
  { path: '/', description: 'Home' },
  { path: '/movie/get-recommendation', description: 'Get Recommendation' },
  { path: '/movie/upcoming', description: 'Upcoming' },
  { path: '/movie/top-rated', description: 'Top Rated' }
];

export function Header() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const searchMovie = (e: FormEvent) => {
    e.preventDefault();

    if (!inputRef.current?.value.trim()) return;

    router.push(`/search?query=${inputRef.current?.value.split(' ').join('-')}`);
  };

  return (
    <header className="bg-orange-500">
  <Navbar fluid rounded ={false} >
    <Navbar.Brand
      href="/"
      onClick={(e) => {
        e.preventDefault();
        router.push('/');
      }}
    >
      <span className="self-center pl-5 whitespace-nowrap text-xl font-semibold text-white dark:text-white">
      <Image
        className=""
        src={`/images/likeamovie99.png`}
        width={265/2.5}
        height={79/2.5}
        alt={`poster`}
      />
      </span>
    </Navbar.Brand>
    <form className="w-1/2 md:w-1/3 flex items-center" onSubmit={searchMovie}>
      <TextInput
        ref={inputRef}
        className="w-full"
        type="text"
        addon={<BsSearch />}
        placeholder="Search for a movie..."
        required={true}
      />
    </form>
    <Navbar.Toggle />
    <Navbar.Collapse className='pr-4'>
      {navLinks.map((link) => (
        <Navbar.Link
          key={link.description}
          href={link.path}
          active={router.pathname === link.path ? true : false}
          onClick={(e) => {
            e.preventDefault();
            router.push(link.path);
          }}
        >
          {link.description}
        </Navbar.Link>
      ))}
    </Navbar.Collapse>
  </Navbar>
</header>

  );
}
