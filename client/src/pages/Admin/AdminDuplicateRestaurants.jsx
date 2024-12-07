import React, { useState } from 'react';
import { Box, Typography, Button, Checkbox, Grid } from '@mui/material';
import PaginatedList from '../../components/PaginatedList';
import RestaurantCard from '../../components/RestaurantCard';
import { fetchDuplicateRestaurants, deleteMultipleRestaurants } from '../../services/adminService';
import AdminHeader from '../../components/AdminHeader'; // Import the AdminHeader component
import Footer from '../../components/Footer'; // Import Footer
import { useNavigate } from 'react-router-dom'; // Ensure useNavigate is imported

const AdminDuplicateRestaurants = () => {
  const [selectedRestaurants, setSelectedRestaurants] = useState([]); // Track selected restaurants
  const navigate = useNavigate(); 
  /**
   * Fetch duplicate restaurants from the backend
   * @param {number} page - Current page number
   * @param {number} pageSize - Number of restaurants per page
   * @returns {Promise<{ data: Object[], totalPages: number }>} - Paginated list of restaurants
   */
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
  const handleLogout = () => {
    console.log('Logging out'); // Debug log
    localStorage.removeItem('authToken'); // Clear token on logout
    localStorage.removeItem('userRoles'); // Clear roles on logout
    navigate('/'); // Redirect to the home page
  };

  /**
   * Handle the batch deletion of selected restaurants
   */
  const handleDeleteSelected = async () => {
    if (!window.confirm('Are you sure you want to delete the selected restaurants?')) {
      return;
    }

    try {
      await deleteMultipleRestaurants(selectedRestaurants);
      alert('Selected restaurants deleted successfully.');
      setSelectedRestaurants([]); // Clear selection after deletion
    } catch (error) {
      alert(`Failed to delete restaurants: ${error.message}`);
    }
  };

  /**
   * Render individual restaurant items
   * @param {Object} restaurant - Restaurant data
   * @returns {JSX.Element} - Rendered restaurant item
   */
  const renderRestaurantItem = (restaurant) => (
    <Grid container alignItems="center" key={restaurant.restaurantId} sx={{ marginBottom: '20px' }}>
      <Grid item xs={1}>
        <Checkbox
          checked={selectedRestaurants.includes(restaurant.restaurantId)}
          onChange={(e) => {
            const { checked } = e.target;
            setSelectedRestaurants((prev) =>
              checked
                ? [...prev, restaurant.restaurantId] // Add to selection
                : prev.filter((id) => id !== restaurant.restaurantId) // Remove from selection
            );
          }}
        />
      </Grid>
      <Grid item xs={9}>
        <RestaurantCard restaurant={restaurant} />
      </Grid>
    </Grid>
  );


  return (
    <>
      <AdminHeader buttonText="Add Admin Task" onLogout={handleLogout} />
      <Box sx={{ padding: '20px' }}>
        <Typography variant="h4" sx={{ marginBottom: '20px' }}>
          Duplicate Restaurants
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDeleteSelected}
          disabled={selectedRestaurants.length === 0}
          sx={{ marginBottom: '20px' }}
        >
          Delete Selected
        </Button>
        <PaginatedList fetchData={fetchRestaurants} renderItem={renderRestaurantItem} pageSize={10} />
      </Box>
      <Footer />
    </>
  );
};

export default AdminDuplicateRestaurants;
