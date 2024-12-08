import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/User/Home';
import RestaurantPage from './pages/User/Restaurant';
import './App.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import BusinessHome from './pages/Business/Business_home';
import RestaurantListPage from './pages/Business/View';
import EditRestaurant from './pages/Business/Edit';
import AdminDuplicateRestaurants from './pages/Admin/AdminDuplicateRestaurants'
import BusinessAdminLogin from './components/BusinessAdminLogin';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id/:name" element={<RestaurantPage />} />
        <Route path="/business" element={<BusinessHome />} />
        <Route path="/views" element={<RestaurantListPage />} />
        <Route path="/edit" element={<EditRestaurant />} />
        <Route path="/admin/duplicate-restaurants" element={<AdminDuplicateRestaurants />} />
      
        <Route path="/business-admin-login" element={<BusinessAdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
