import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AppHeader from '../../components/Header';
import Footer from '../../components/Footer';
import PaginatedList from '../../components/PaginatedList';
import RestaurantCard from '../../components/RestaurantCard';
import InvalidSearch from '../../components/InvalidSearch';
import { searchRestaurants } from '../../services/restaurantService';

const Home = () => {
  const [isSearchValid, setIsSearchValid] = useState(true);
  const [searchPayload, setSearchPayload] = useState({}); // Store search filters

  // Handle search from the header
  const handleSearch = (triggeredBy, payload, isValid) => {
    setIsSearchValid(isValid); // Update search validity state
    if (isValid) {
      setSearchPayload(payload); // Update search filters
    }
  };

  // Fetch data for the paginated list
  const fetchRestaurants = async (page, pageSize) => {
    try {
      // Merge searchPayload with pagination parameters
      const response = await searchRestaurants({ ...searchPayload, page: page - 1, size: pageSize });
      return {
        data: response.data.content, // List of restaurants
        totalPages: response.data.totalPages, // Total pages from API
      };
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  };

  return (
    <>
      {/* Header Component */}
      <AppHeader onSearch={handleSearch} />

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          padding: '0 16px',
        }}
      >
        {/* Restaurant List or Invalid Search Message */}
        <Box sx={{ flex: 1 }}>
          {isSearchValid ? (
            <>
              <Typography variant="h6" sx={{ fontWeight: 'bold', padding: '13px' }}>
                Restaurants in the current map area
              </Typography>
              <PaginatedList
                fetchData={fetchRestaurants}
                renderItem={(restaurant) => <RestaurantCard restaurant={restaurant} />}
                pageSize={10} // Adjust page size as needed
              />
            </>
          ) : (
            <InvalidSearch />
          )}
        </Box>

        {/* Map Container */}
        <Box
          sx={{
            width: '30%',
            position: 'sticky',
            top: '120px',
            height: 'calc(100vh - 140px)',
            overflow: 'hidden',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" sx={{ padding: 2, color: '#757575' }}>
            Map Placeholder
          </Typography>
        </Box>
      </Box>

      {/* Footer Component */}
      <Footer />
    </>
  );
};

export default Home;
