# Block Estate

Block Estate is a modern real estate marketplace built with React, Redux, and Firebase. It enables users to list, browse, and manage properties for sale or rent.

## Features

### User Management
- Email and password authentication
- Google OAuth integration
- User profile management with avatar upload
- Secure user sessions with Redux Persist

### Property Listings
- Create, edit, and delete property listings
- Upload multiple property images (up to 6 per listing)
- Support for both sale and rental properties
- Property details including:
  - Price (regular and discounted)
  - Location
  - Number of bedrooms and bathrooms
  - Amenities (parking, furnished status)
  - Detailed description
  
### Search & Browse
- Advanced search functionality with filters
- Filter by:
  - Property type (rent/sale)
  - Price range
  - Amenities
  - Location
- Sort listings by price and date
- Infinite scroll for listing results

### User Interface
- Responsive design for all devices
- Image slider for property photos
- Share listing functionality
- Contact landlord/seller through email
- Modern UI with Tailwind CSS

## Technologies Used
- **Frontend**: React 18, React Router 6
- **State Management**: Redux Toolkit, Redux Persist
- **UI/Styling**: Tailwind CSS, React Icons
- **Image Handling**: Firebase Storage
- **Authentication**: Firebase Auth
- **Build Tool**: Vite
- **Additional Libraries**: 
  - Swiper.js for image carousels
  - @tailwindcss/line-clamp for text truncation

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Firebase account and project setup

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/block-estate.git
   cd block-estate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key