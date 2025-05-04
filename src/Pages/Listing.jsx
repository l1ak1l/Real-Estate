import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { useSelector } from 'react-redux';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare
} from 'react-icons/fa';
import Contact from '../Components/Contact';

SwiperCore.use([Navigation, Pagination]);

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) throw new Error(data.message);
        setListing(data);
        setError(false);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className="min-h-screen bg-gray-50">
      {loading && (
        <p className="text-center my-7 text-2xl text-gray-600">Loading...</p>
      )}
      {error && (
        <p className="text-center my-7 text-2xl text-red-600">
          Something went wrong!
        </p>
      )}
      
      {listing && !loading && !error && (
        <div>
          {/* Image Slider */}
          <Swiper
            navigation
            pagination={{ clickable: true }}
            className="h-[400px] md:h-[550px]"
          >
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${url})` }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Share Button */}
          <div className="fixed top-4 right-4 z-10">
            <button
              className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              <FaShare className="text-gray-700 text-xl" />
            </button>
            {copied && (
              <p className="absolute top-12 right-0 bg-white px-3 py-1.5 rounded-md shadow-md text-sm">
                Link copied!
              </p>
            )}
          </div>

          {/* Property Details */}
          <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              {/* Price and Title */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {listing.name}
                </h1>
                <div className="mt-2 md:mt-0">
                  <span className="text-xl md:text-2xl font-bold text-blue-600">
                    ${listing.offer ? listing.discountPrice.toLocaleString() : listing.regularPrice.toLocaleString()}
                  </span>
                  {listing.type === 'rent' && (
                    <span className="text-gray-500 ml-1">/ month</span>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center gap-2 mb-4">
                <FaMapMarkerAlt className="text-green-600" />
                <p className="text-gray-600 text-sm md:text-base">
                  {listing.address}
                </p>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
                {listing.offer && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Save ${(listing.regularPrice - listing.discountPrice).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6">
                <span className="font-semibold">Description:</span>{' '}
                {listing.description}
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <FaBed className="text-blue-600" />
                  <span>{listing.bedrooms} Bed{listing.bedrooms > 1 && 's'}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <FaBath className="text-blue-600" />
                  <span>{listing.bathrooms} Bath{listing.bathrooms > 1 && 's'}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <FaParking className="text-blue-600" />
                  <span>{listing.parking ? 'Parking' : 'No Parking'}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <FaChair className="text-blue-600" />
                  <span>{listing.furnished ? 'Furnished' : 'Unfurnished'}</span>
                </div>
              </div>

              {/* Contact Button */}
              {currentUser && listing.userRef !== currentUser._id && (
                <div className="border-t pt-4">
                  {!contact ? (
                    <button
                      onClick={() => setContact(true)}
                      className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Contact Landlord
                    </button>
                  ) : (
                    <Contact listing={listing} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}