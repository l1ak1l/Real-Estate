import React from 'react'
import { Route,Routes,BrowserRouter } from 'react-router-dom'
import Home from './Pages/home'
import About from './Pages/About'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import Profile from './Pages/Profile'
import CreateListing from './Pages/CreateListing';
import Header from './Components/Header'
import PrivateRoute from './Components/PrivateRoute'
import UpdateListing from './Pages/UpdateListing'
export default function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/about" element={<About />}/>
      <Route path="/sign-in" element={<SignIn />}/>
      <Route path="/sign-up" element={<SignUp />}/>
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />}/>
        <Route path='/create-listing' element={<CreateListing />} />
        <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
       </Route>
    </Routes>
    </BrowserRouter>
  )
}
