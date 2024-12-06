import React, { useState } from 'react';
import { Box, Typography, Checkbox, Button } from '@mui/material';
import PaginatedList from '../../components/PaginatedList';
import RestaurantCard from '../../components/RestaurantCard';
import { fetchDuplicateRestaurants, deleteDuplicateRestaurants } from '../../services/adminService';

const AdminDuplicateRestaurants = () => {
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);

  const handleSearch = (triggeredBy, payload, isValid) => {
    // Implement if needed
  };

  const fetchRestaurants = async (page, pageSize) => {
    try {
      const response = await fetchDuplicateRestaurants(page - 1, pageSize);
      return {
        data: response.data.content,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error('Error fetching duplicate restaurants:', error);
      throw error;
    }
  };

  const handleCheckboxChange = (restaurantId) => {
    setSelectedRestaurants(prev => 
      prev.includes(restaurantId) 
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteDuplicateRestaurants(selectedRestaurants);
      setSelectedRestaurants([]);
      // Refresh the list
    } catch (error) {
      console.error('Error deleting restaurants:', error);
    }
  };

  const renderRestaurantItem = (restaurant) => (
    <Box display="flex" alignItems="center">
      <Checkbox
        checked={selectedRestaurants.includes(restaurant.id)}
        onChange={() => handleCheckboxChange(restaurant.id)}
      />
      <RestaurantCard restaurant={restaurant} />
    </Box>
  );

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>Duplicate Restaurants</Typography>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleDeleteSelected}
        disabled={selectedRestaurants.length === 0}
        sx={{ marginBottom: '20px' }}
      >
        Delete Selected
      </Button>
      <PaginatedList
        fetchData={fetchRestaurants}
        renderItem={renderRestaurantItem}
        pageSize={10}
      />
    </Box>
  );
};

export default AdminDuplicateRestaurants;