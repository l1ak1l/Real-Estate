import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListingItem from '../Components/Listingitem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  // Single premium Unsplash image for hero section
  const heroImage = 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [offerRes, rentRes, saleRes] = await Promise.all([
          fetch('/api/listing/get?offer=true&limit=4'),
          fetch('/api/listing/get?type=rent&limit=4'),
          fetch('/api/listing/get?type=sale&limit=4')
        ]);
        
        const [offerData, rentData, saleData] = await Promise.all([
          offerRes.json(),
          rentRes.json(),
          saleRes.json()
        ]);

        setOfferListings(offerData);
        setRentListings(rentData);
        setSaleListings(saleData);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };
    
    fetchListings();
  }, []);

  return (
    <div className='bg-gray-50 min-h-screen'>
      {/* Hero Section with Single Static Image */}
      <section className='relative h-screen max-h-[800px]'>
        <div
          style={{
            background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${heroImage}) center/cover no-repeat`,
          }}
          className='w-full h-full absolute inset-0'
        />
        
        <div className='relative z-10 h-full flex items-center justify-center'>
          <div className='max-w-6xl mx-auto px-6 text-center text-white'>
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight'>
              Discover Your Dream Property
            </h1>
            <p className='text-xl sm:text-2xl mb-8 max-w-2xl mx-auto font-light opacity-90'>
              Premium real estate solutions for modern living
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                to={'/search'}
                className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              >
                Browse Properties
              </Link>
              <Link
                to={'/search?offer=true'}
                className='bg-white hover:bg-gray-100 text-blue-600 font-medium py-3 px-8 rounded-full transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              >
                Special Offers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {offerListings.length > 0 && (
          <div className='mb-16'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
              <div>
                <h2 className='text-3xl font-bold text-gray-900'>Featured Listings</h2>
                <p className='text-gray-500 mt-2'>Exclusive properties with special offers</p>
              </div>
              <Link 
                to={'/search?offer=true'} 
                className='text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 group transition-all'
              >
                View all
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings.length > 0 && (
          <div className='mb-16'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
              <div>
                <h2 className='text-3xl font-bold text-gray-900'>Rental Properties</h2>
                <p className='text-gray-500 mt-2'>Find your perfect temporary home</p>
              </div>
              <Link 
                to={'/search?type=rent'} 
                className='text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 group transition-all'
              >
                View all
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings.length > 0 && (
          <div className='mb-16'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
              <div>
                <h2 className='text-3xl font-bold text-gray-900'>Properties for Sale</h2>
                <p className='text-gray-500 mt-2'>Your future home awaits</p>
              </div>
              <Link 
                to={'/search?type=sale'} 
                className='text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 group transition-all'
              >
                View all
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className='bg-gradient-to-r from-blue-800 to-blue-900 py-20'>
        <div className='max-w-4xl mx-auto text-center px-6'>
          <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>Need Help Finding Your Perfect Home?</h2>
          <p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto opacity-90'>
            Our dedicated team is ready to assist you in your property search.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to={'/search'}
              className='bg-white text-blue-700 hover:bg-gray-100 font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            >
              Start Your Search
            </Link>
            <Link
              to={'/contact'}
              className='bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            >
              Contact Agent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}