import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='p-3 mx-auto max-w-lg '>
      <p className='text-3xl text-center font-semibold my-7'>Sign Up</p>
      <form className='flex flex-col gap-4'>
        <input type='text' placeholder='Username' id='Username' className='rounded-lg boarder p-3'/>
        <input type='text' placeholder='Email' id='Email' className='rounded-lg boarder p-3'/>
        <input type='text' placeholder='Password' id='Password' className='rounded-lg boarder p-3'/>
        <button className='bg-slate-700 text-white uppercase hover:opacity-95 rounded-lg p-3'>Sign up</button>
      </form>
      <div className='flex gap-2'>
        <p>Have an Account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
    </div>
  )
}
