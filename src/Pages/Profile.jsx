
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiLogOut, FiUser, FiMail, FiLock, FiHome, FiPlus, FiImage } from 'react-icons/fi';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      window.location.href = '/';
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='max-w-4xl mx-auto p-4'>
      <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
        {/* Profile Header */}
        <div className='p-6 border-b border-gray-100'>
          <h1 className='text-xl font-semibold text-gray-900'>Account Settings</h1>
          <p className='text-sm text-gray-500 mt-1'>Manage your profile and listings</p>
        </div>

        {/* Profile Content */}
        <div className='p-6'>
          {/* Avatar Upload */}
          <div className='flex items-center gap-4 mb-8'>
            <div className='relative group'>
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type='file'
                ref={fileRef}
                hidden
                accept='image/*'
              />
              <button
                onClick={() => fileRef.current.click()}
                className='relative rounded-full w-16 h-16 overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-colors'
              >
                <img
                  src={formData.avatar || currentUser.avatar}
                  alt='profile'
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                  <FiImage className='text-white text-lg' />
                </div>
              </button>
              <div className='text-sm'>
                {fileUploadError ? (
                  <span className='text-red-500 flex items-center gap-1'>
                    <span>Upload failed (max 2MB)</span>
                  </span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span className='text-gray-600'>{`Uploading ${filePerc}%`}</span>
                ) : filePerc === 100 ? (
                  <span className='text-green-500 flex items-center gap-1'>
                    <IoCheckmarkCircleOutline /> Success
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Update Form */}
          <form onSubmit={handleSubmit} className='space-y-4 mb-8'>
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <FiUser className='text-gray-400' />
                <input
                  type='text'
                  placeholder='Username'
                  defaultValue={currentUser.username}
                  id='username'
                  className='flex-1 p-2 border-b border-gray-200 focus:border-blue-500 outline-none'
                  onChange={handleChange}
                />
              </div>
              
              <div className='flex items-center gap-2'>
                <FiMail className='text-gray-400' />
                <input
                  type='email'
                  placeholder='Email'
                  id='email'
                  defaultValue={currentUser.email}
                  className='flex-1 p-2 border-b border-gray-200 focus:border-blue-500 outline-none'
                  onChange={handleChange}
                />
              </div>
              
              <div className='flex items-center gap-2'>
                <FiLock className='text-gray-400' />
                <input
                  type='password'
                  placeholder='New Password'
                  onChange={handleChange}
                  id='password'
                  className='flex-1 p-2 border-b border-gray-200 focus:border-blue-500 outline-none'
                />
              </div>
            </div>

            <div className='flex items-center gap-3 pt-4'>
              <button
                disabled={loading}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2'
              >
                {loading ? (
                  <span className='animate-spin'>↻</span>
                ) : (
                  <>
                    <FiEdit className='text-sm' /> Update
                  </>
                )}
              </button>
              
              <Link
                to='/create-listing'
                className='px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2'
              >
                <FiPlus className='text-sm' /> New Listing
              </Link>
            </div>

            {error && (
              <p className='text-red-500 text-sm mt-2'>{error}</p>
            )}
            {updateSuccess && (
              <p className='text-green-500 text-sm mt-2 flex items-center gap-1'>
                <IoCheckmarkCircleOutline /> Profile updated
              </p>
            )}
          </form>

          {/* Listings Section */}
          <div className='mt-8'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-sm font-semibold text-gray-700'>Your Listings</h2>
              <button
                onClick={handleShowListings}
                className='text-sm text-gray-600 hover:text-blue-500 flex items-center gap-1'
              >
                <FiHome className='text-sm' /> {userListings.length > 0 ? 'Refresh' : 'Show'}
              </button>
            </div>

            {showListingsError && (
              <p className='text-red-500 text-sm mb-4'>Error loading listings</p>
            )}

            <div className='space-y-3'>
              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className='group flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  <Link to={`/listing/${listing._id}`} className='flex items-center gap-3 flex-1'>
                    <img
                      src={listing.imageUrls[0]}
                      alt='listing cover'
                      className='w-12 h-12 object-cover rounded-md'
                    />
                    <div>
                      <h3 className='text-sm font-medium text-gray-900 truncate'>{listing.name}</h3>
                      <p className='text-xs text-gray-500'>
                        ${listing.regularPrice.toLocaleString()}
                        {listing.type === 'rent' && '/mo'}
                      </p>
                    </div>
                  </Link>
                  <div className='flex items-center gap-2'>
                    <Link
                      to={`/update-listing/${listing._id}`}
                      className='p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-blue-500'
                      title='Edit'
                    >
                      <FiEdit className='text-sm' />
                    </Link>
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className='p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-red-500'
                      title='Delete'
                    >
                      <FiTrash2 className='text-sm' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Actions */}
          <div className='mt-8 pt-6 border-t border-gray-100 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <button
                onClick={handleSignOut}
                className='text-sm text-gray-600 hover:text-blue-500 flex items-center gap-1'
              >
                <FiLogOut /> Sign Out
              </button>
              <span className='text-gray-300'>|</span>
              <button
                onClick={handleDeleteUser}
                className='text-sm text-red-500 hover:text-red-600 flex items-center gap-1'
              >
                <FiTrash2 /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}