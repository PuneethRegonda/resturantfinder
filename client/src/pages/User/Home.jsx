import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AppHeader from '../../components/Header';
import Footer from '../../components/Footer';
import PaginatedList from '../../components/PaginatedList';
import RestaurantCard from '../../components/RestaurantCard';
import InvalidSearch from '../../components/InvalidSearch';
import { searchRestaurants,searchGoogleRestaurants,getLocation } from '../../services/restaurantService';
import MapContainer from '../../components/Map';

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
  const fetchGoogleRestaurants = async (searchPayload) => {
    let location={  lat: 37.3304795, lng: -121.905282 }
    if(searchPayload.name!=undefined){
       location = await getLocation(searchPayload.name) ||  { lat: 37.3304795, lng: -121.905282 }; // Example location
    }
  
    try {
      const restaurants = await searchGoogleRestaurants(location);
      console.log('Google Restaurants:', restaurants);
      return restaurants;
    } catch (error) {
      console.error('Error fetching Google restaurants:', error.message);
      return [];
    }
  };
  
 
  const fetchBackendRestaurants = async (payload, page, pageSize) => {
    try {
      const response = await searchRestaurants({
        ...payload,
        page: page - 1,
        size: pageSize,
      });
      return response.data.content.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        rating: restaurant.rating,
        source: 'Backend',
        iconUrl: restaurant.iconUrl
      }));
    } catch (error) {
      console.error('Error fetching restaurants from backend:', error);
      return [];
    }
  };

  const fetchRestaurants = async (page, pageSize) => {
    let backendRestaurants = [];
    let googleResults = [];
  
    try {
      // Fetch restaurants from backend
      backendRestaurants = await fetchBackendRestaurants(searchPayload, page, pageSize);
      console.log('Backend Restaurants:', backendRestaurants);
    } catch (error) {
      console.error('Error fetching backend restaurants:', error);
    }
  
    try {
      // Fetch restaurants from Google via backend API
      googleResults = await fetchGoogleRestaurants(searchPayload);
      console.log('Google Restaurants:', googleResults);
    } catch (error) {
      console.error('Error fetching Google restaurants:', error);
    }
  
    // Combine results and deduplicate
    const combinedResults = deduplicateResults([...backendRestaurants, ...googleResults]);
  
    // Paginate the combined results
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedResults = combinedResults.slice(start, end);
  
    return {
      data: paginatedResults,
      totalPages: Math.ceil(combinedResults.length / pageSize),
    };
  };
  
  // Utility function to deduplicate results based on a unique property like `id`
  const deduplicateResults = (results) => {
    const uniqueResults = [];
    const seen = new Set();
  
    results.forEach((item) => {
      if (!seen.has(item.id)) { // Assumes `id` is the unique identifier for restaurants
        seen.add(item.id);
        uniqueResults.push(item);
      }
    });
  
    return uniqueResults;
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
          <MapContainer zipCode={searchPayload.name || '95126'} />
        </Box>
      </Box>

      {/* Footer Component */}
      <Footer />
    </>
  );
};

export default Home;
