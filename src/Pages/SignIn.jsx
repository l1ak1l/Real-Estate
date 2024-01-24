import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'

export default function SignUp() {
  const [formData,setFormData] = useState({})
  const [error ,setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChnage = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setLoading(true)
      const res = await fetch('api/auth/signin',
      {
        method: "POST",
        headers : {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify(formData),
      }
      )
      const data = await res.json();
      if (data.success === false){
        setError(data.message)
        setLoading(false)
        setError(null)
        navigate('/');
      }

    }
    catch{
      setLoading(flase)
      setError(error.message)
    }
   
    
  };
  return (
    <div className='p-3 mx-auto max-w-lg '>
      <p className='text-3xl text-center font-semibold my-7'>Sign In</p>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='Email' id='Email' className='rounded-lg boarder p-3'  onChange={handleChnage}/>
        <input type='text' placeholder='Password' id='Password' className='rounded-lg boarder p-3'  onChange={handleChnage}/>
        <button disabled={loading} className='bg-slate-700 text-white uppercase hover:opacity-95 rounded-lg p-3 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign Up'}</button>
      </form>
      <div className='flex gap-2'>
        <p>Dont have an Account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
