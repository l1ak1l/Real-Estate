import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>

      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        {/* Left Side */}
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            id='name'
            placeholder='Name'
            className='border p-3 rounded-lg'
            minLength={10}
            maxLength={62}
            required
            value={formData.name}
            onChange={handleChange}
          />
          <textarea
            id='description'
            placeholder='Description'
            className='border p-3 rounded-lg'
            required
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type='text'
            id='address'
            placeholder='Address'
            className='border p-3 rounded-lg'
            required
            value={formData.address}
            onChange={handleChange}
          />

          {/* Checkboxes */}
          <div className='flex gap-6 flex-wrap'>
            {['sale', 'rent', 'parking', 'furnished', 'offer'].map((item) => (
              <div key={item} className='flex gap-2'>
                <input
                  type='checkbox'
                  id={item}
                  className='w-5'
                  onChange={handleChange}
                  checked={
                    item === 'sale' || item === 'rent'
                      ? formData.type === item
                      : formData[item]
                  }
                />
                <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
              </div>
            ))}
          </div>

          {/* Bedrooms, Bathrooms, Prices */}
          <div className='flex flex-wrap gap-6'>
            {[
              { id: 'bedrooms', label: 'Beds', min: 1, max: 10 },
              { id: 'bathrooms', label: 'Baths', min: 1, max: 10 },
              { id: 'regularPrice', label: 'Regular Price ($)', min: 50, max: 10000000 },
            ].map((field) => (
              <div key={field.id} className='flex items-center gap-2'>
                <input
                  type='number'
                  id={field.id}
                  min={field.min}
                  max={field.max}
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData[field.id]}
                />
                <p>{field.label}</p>
              </div>
            ))}

            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <p>Discounted Price</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              First image is the cover (max 6 images)
            </span>
          </p>

          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              onClick={handleImageSubmit}
              disabled={uploading}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-50'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {imageUploadError && <p className='text-red-700 text-sm'>{imageUploadError}</p>}

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, idx) => (
              <div key={idx} className='flex justify-between p-3 border items-center'>
                <img src={url} alt='listing image' className='h-20 w-20 object-contain rounded-lg' />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(idx)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>

          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
