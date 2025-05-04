import { Link } from 'react-router-dom';
import { MdLocationOn, MdKingBed, MdBathtub } from 'react-icons/md';
import { FaRulerCombined } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden w-full sm:w-[330px] group'>
      <Link to={`/listing/${listing._id}`} className='block h-full'>
        {/* Image with overlay effect */}
        <div className='relative overflow-hidden h-[220px]'>
          <img
            src={listing.imageUrls[0] || 'https://via.placeholder.com/330x220'}
            alt={listing.name}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
          />
          {/* Status badge */}
          {listing.offer && (
            <div className='absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full'>
              {listing.type === 'rent' ? 'SPECIAL OFFER' : 'PRICE REDUCED'}
            </div>
          )}
        </div>

        {/* Listing details */}
        <div className='p-4 flex flex-col gap-3'>
          {/* Price */}
          <div className='flex items-center justify-between'>
            <p className='text-xl font-bold text-blue-800'>
              ${listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && <span className='text-sm font-normal text-gray-500'>/mo</span>}
            </p>
            {listing.offer && (
              <p className='text-sm text-gray-500 line-through'>
                ${listing.regularPrice.toLocaleString('en-US')}
              </p>
            )}
          </div>

          {/* Title and address */}
          <h3 className='text-lg font-semibold text-gray-900 truncate'>
            {listing.name}
          </h3>
          <div className='flex items-center gap-1 text-gray-600'>
            <MdLocationOn className='flex-shrink-0 h-4 w-4 text-blue-600' />
            <p className='text-sm truncate'>{listing.address}</p>
          </div>

          {/* Description */}
          <p className='text-gray-600 text-sm line-clamp-2'>
            {listing.description}
          </p>

          {/* Features */}
          <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-100'>
            <div className='flex items-center gap-1 text-sm text-gray-700'>
              <MdKingBed className='h-4 w-4 text-blue-600' />
              <span>{listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}</span>
            </div>
            <div className='flex items-center gap-1 text-sm text-gray-700'>
              <MdBathtub className='h-4 w-4 text-blue-600' />
              <span>{listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}</span>
            </div>
            <div className='flex items-center gap-1 text-sm text-gray-700'>
              <FaRulerCombined className='h-3 w-3 text-blue-600' />
              <span>{listing.area} sqft</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}