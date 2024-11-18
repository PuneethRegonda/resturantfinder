import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';  // Corrected import path
import RestaurantPage from './pages/Restaurant'; 
import './App.css';

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
