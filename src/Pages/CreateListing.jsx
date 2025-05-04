import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiX, FiHome, FiDollarSign, FiCheck, FiInfo } from 'react-icons/fi';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  
  const [imageUploadError, setImageUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      setImageUploadError('Please select at least one image');
      return;
    }

    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError('You can upload a maximum of 6 images');
      return;
    }

    setUploading(true);
    setImageUploadError('');
    const promises = [];

    for (let i = 0; i < files.length; i++) {
      promises.push(storeImage(files[i]));
    }

    try {
      const urls = await Promise.all(promises);
      setFormData((prevState) => ({
        ...prevState,
        imageUrls: [...prevState.imageUrls, ...urls],
      }));
      setImageUploadError('');
    } catch (err) {
      console.error(err);
      setImageUploadError('Image upload failed. Each image must be under 2MB.');
    }
    setUploading(false);
    setFiles([]); // Clear file input after upload
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // optional: show upload progress
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      imageUrls: prevState.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (id === 'sale' || id === 'rent') {
      setFormData((prevState) => ({ ...prevState, type: id }));
    } else if (type === 'checkbox') {
      setFormData((prevState) => ({ ...prevState, [id]: checked }));
    } else {
      setFormData((prevState) => ({ ...prevState, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (uploading) {
      setError('Please wait for images to finish uploading');
      return;
    }

    if (formData.imageUrls.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    if (formData.discountPrice >= formData.regularPrice) {
      setError('Discount price must be less than regular price');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8'>
        <h1 className='text-2xl font-semibold text-gray-900 mb-6'>Create New Property Listing</h1>

        <form onSubmit={handleSubmit} className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column */}
          <div className='space-y-6'>
            {/* Basic Info */}
            <div className='space-y-4'>
              <h2 className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>Property Details</h2>
              <div className='space-y-3'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Property Title</label>
                  <input
                    type='text'
                    id='name'
                    placeholder='Modern Downtown Apartment'
                    className='w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                  <textarea
                    id='description'
                    placeholder='Describe your property...'
                    rows='4'
                    className='w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
                  <input
                    type='text'
                    id='address'
                    placeholder='Enter full address'
                    className='w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className='space-y-4'>
              <h2 className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>Features</h2>
              <div className='grid grid-cols-2 gap-3'>
                {['parking', 'furnished', 'offer'].map((feature) => (
                  <label
                    key={feature}
                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                      formData[feature] ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type='checkbox'
                      id={feature}
                      checked={formData[feature]}
                      onChange={handleChange}
                      className='hidden'
                    />
                    <span className={`w-5 h-5 flex items-center justify-center border rounded-sm ${
                      formData[feature] ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
                    }`}>
                      {formData[feature] && <FiCheck className='text-white text-xs' />}
                    </span>
                    <span className='text-sm capitalize'>{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className='space-y-4'>
              <h2 className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>Pricing & Type</h2>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>Listing Type</label>
                  <div className='flex gap-2'>
                    {['rent', 'sale'].map((type) => (
                      <button
                        key={type}
                        type='button'
                        onClick={() => setFormData(prev => ({ ...prev, type }))}
                        className={`flex-1 text-sm px-4 py-2 rounded-md transition-colors ${
                          formData.type === type 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>Regular Price</label>
                  <div className='relative'>
                    <FiDollarSign className='absolute left-3 top-3 text-gray-400' />
                    <input
                      type='number'
                      id='regularPrice'
                      className='w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                      value={formData.regularPrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {formData.offer && (
                  <div className='space-y-2 col-span-2'>
                    <label className='text-sm font-medium text-gray-700'>Discounted Price</label>
                    <div className='relative'>
                      <FiDollarSign className='absolute left-3 top-3 text-gray-400' />
                      <input
                        type='number'
                        id='discountPrice'
                        className='w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                        value={formData.discountPrice}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            {/* Image Upload */}
            <div className='space-y-4'>
              <h2 className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>Property Images</h2>
              <div className='border-2 border-dashed border-gray-200 rounded-xl p-6 text-center transition-all hover:border-blue-500'>
                <div className='mb-4'>
                  <FiUploadCloud className='mx-auto text-2xl text-gray-400' />
                </div>
                <input
                  type='file'
                  id='images'
                  onChange={(e) => setFiles(e.target.files)}
                  className='hidden'
                  accept='image/*'
                  multiple
                />
                <label htmlFor='images' className='cursor-pointer'>
                  <p className='text-sm text-gray-600'>
                    Drag & drop images or{' '}
                    <span className='text-blue-500 font-medium'>browse files</span>
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>JPEG/PNG, max 2MB per image (up to 6)</p>
                </label>
                
                <div className='mt-4'>
                  <button
                    type='button'
                    onClick={handleImageSubmit}
                    disabled={uploading || formData.imageUrls.length >= 6}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                      uploading 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {uploading ? 'Uploading...' : 'Upload Selected'}
                  </button>
                </div>

                {imageUploadError && (
                  <div className='mt-4 flex items-center gap-2 text-red-500 text-sm bg-red-50 p-2 rounded-lg'>
                    <FiInfo className='flex-shrink-0' />
                    {imageUploadError}
                  </div>
                )}
              </div>

              {/* Image Previews */}
              {formData.imageUrls.length > 0 && (
                <div className='grid grid-cols-3 gap-3'>
                  {formData.imageUrls.map((url, idx) => (
                    <div key={url} className='relative group'>
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className='h-32 w-full object-cover rounded-lg'
                      />
                      <button
                        type='button'
                        onClick={() => handleRemoveImage(idx)}
                        className='absolute top-1 right-1 p-1 bg-white/80 rounded-full hover:bg-white transition-colors'
                      >
                        <FiX className='w-4 h-4 text-red-500' />
                      </button>
                      {idx === 0 && (
                        <span className='absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded'>
                          Main Image
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className='space-y-4'>
              <h2 className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>Specifications</h2>
              <div className='grid grid-cols-2 gap-4'>
                {[
                  { id: 'bedrooms', label: 'Bedrooms', icon: <FiHome /> },
                  { id: 'bathrooms', label: 'Bathrooms', icon: <FiHome /> },
                ].map((spec) => (
                  <div key={spec.id} className='border border-gray-200 rounded-lg p-3'>
                    <label className='text-xs font-medium text-gray-500'>{spec.label}</label>
                    <div className='flex items-center gap-2 mt-1'>
                      <input
                        type='number'
                        id={spec.id}
                        min='1'
                        max='10'
                        value={formData[spec.id]}
                        onChange={handleChange}
                        className='w-full text-lg font-medium border-none p-0 focus:ring-0'
                        required
                      />
                      <span className='text-gray-400'>{spec.icon}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Section */}
            <div className='border-t pt-6'>
              <button
                type='submit'
                disabled={loading || uploading}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  loading || uploading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {loading ? 'Creating Listing...' : 'Publish Property'}
              </button>
              
              {error && (
                <div className='mt-4 flex items-center gap-2 text-red-500 text-sm bg-red-50 p-2 rounded-lg'>
                  <FiInfo className='flex-shrink-0' />
                  {error}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}