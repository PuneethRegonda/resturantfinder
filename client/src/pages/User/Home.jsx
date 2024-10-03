import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import AppHeader from '../../components/Header';
import Footer from '../../components/Footer';
import PaginatedList from '../../components/PaginatedList';
import RestaurantCard from '../../components/RestaurantCard';
import InvalidSearch from '../../components/InvalidSearch';
import { getNearbyRestaurants, searchRestaurants } from '../../services/restaurantService';
import MapContainer from '../../components/Map';

const Home = () => {
  const [places, setPlaces] = useState([]);
  const [isSearchValid, setIsSearchValid] = useState(true);
  const [searchPayload, setSearchPayload] = useState({}); // Store search filters
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          getNearbyRestaurants(location.lat, location.lng);
        },
        (error) => {
          console.error('Error getting user location', error);
          if (error.code === 1) {
            // User denied Geolocation
            setUserLocation({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
            // Optionally inform the user
            alert(
              'Location access denied. Showing results for the default location (San Francisco). You can also search by ZIP code.'
            );
            fetchNearbyRestaurants(37.7749, -122.4194);
          }
        }
      );
    } else {
      console.error('Geolocation not supported');
    }
  }, []);
  // Handle search from the header
  const handleSearch = (triggeredBy,query, isValid) => {
    setIsSearchValid(isValid); // Update search validity state
    if (isValid) {
      setSearchPayload(payload); 
  };
}

  // Fetch data for the paginated list
  const fetchRestaurants = async (page, pageSize) => {
    try {
      // Merge searchPayload with pagination parameters
      const response = await searchRestaurants({ ...searchPayload, page: page - 1, size: pageSize });
      return {
        data: response.data.content, // List of restaurants
        totalPages: response.data.totalPages, // Total pages from API
      };
      api/google-search-restaurants
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
          <MapContainer places={places} userLocation={userLocation} />
        </Box>
      </Box>

      {/* Footer Component */}
      <Footer />
    </>
  );
};

export default Home;
