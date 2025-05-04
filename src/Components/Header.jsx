import { FaSearch, FaHome, FaInfoCircle, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.search]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white shadow-sm'}`}>
      <div className='flex justify-between items-center max-w-7xl mx-auto p-4'>
        <Link to='/' className='flex items-center'>
          <h1 className='font-bold text-2xl'>
            <span className='text-blue-600'>Block</span>
            <span className='text-gray-800'>Estate</span>
          </h1>
        </Link>
        
        <form
          onSubmit={handleSubmit}
          className='hidden md:flex bg-gray-100 p-2 rounded-full items-center w-1/3 max-w-md'
        >
          <input
            type='text'
            placeholder='Search properties...'
            className='bg-transparent focus:outline-none w-full px-4 py-1 text-gray-700'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className='bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors'>
            <FaSearch />
          </button>
        </form>

        <nav className='flex items-center gap-4'>
          <Link to='/' className='hidden md:flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors'>
            <FaHome className='text-lg' />
            <span className='font-medium'>Home</span>
          </Link>
          <Link to='/about' className='hidden md:flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors'>
            <FaInfoCircle className='text-lg' />
            <span className='font-medium'>About</span>
          </Link>
          
          {currentUser ? (
            <Link to='/profile' className='flex items-center gap-1'>
              {currentUser.avatar ? (
                <img
                  className='rounded-full h-8 w-8 object-cover border-2 border-blue-600'
                  src={currentUser.avatar}
                  alt='profile'
                />
              ) : (
                <div className='rounded-full h-8 w-8 bg-blue-600 text-white flex items-center justify-center'>
                  <FaUser />
                </div>
              )}
              <span className='hidden md:inline ml-1 font-medium text-gray-700'>{currentUser.username}</span>
            </Link>
          ) : (
            <Link to='/sign-in' className='bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-1'>
              <FaUser />
              <span className='font-medium'>Sign In</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}