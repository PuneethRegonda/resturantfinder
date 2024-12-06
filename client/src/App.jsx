import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/User/Home';  // Corrected import path
import RestaurantPage from './pages/User/Restaurant'; 
import './App.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import BusinessHome from './pages/Business/Business_home';
import RestaurantListPage from './pages/Business/View';
import EditRestaurant from './pages/Business/Edit';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page Route */}
        <Route path="/" element={<Home />} />

        {/* Restaurant Detail Page Route */}
        <Route path="/restaurant/:placeId" element={<RestaurantPage />} />

        <Route path="/business" element={<BusinessHome />} />
        <Route path="/views" element={<RestaurantListPage />} />
        <Route path="/edit" element={<EditRestaurant />} />
      </Routes>
    </Router>
  );
}

export default App;
