import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/User/Home';  // Corrected import path
import RestaurantPage from './pages/User/Restaurant'; 
import './App.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page Route */}
        <Route path="/" element={<Home />} />

        {/* Restaurant Detail Page Route */}
        <Route path="/restaurant/:placeId" element={<RestaurantPage />} />
      </Routes>
    </Router>
  );
}

export default App;
