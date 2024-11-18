import React, { useState, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import MapContainer from '../components/Map';
import { Box, Typography } from '@mui/material';
import { getNearbyRestaurants, searchRestaurants } from '../services/restaurantService';
import AppHeader from '../components/Header';
import Footer from '../components/Footer';
import InvalidSearch from '../components/InvalidSearch';
const Home = () => {
  const [places, setPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  const [isSearchValid, setIsSearchValid] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          getNearbyRestaurants(location.lat, location.lng).then((results) => {
            setPlaces(results);
          });
        },
        (error) => {
          console.error('Error getting user location', error);
        }
      );
    }
  }, []);

  const handleSearch = (triggeredBy,query, isValid) => {
    const { lat, lng } = userLocation;
    setIsSearchValid(isValid);
    if (!lat || !lng) {
      console.warn('User location is not available. Please enable location services.');
      return;
    }
    if (!isValid) {
      return ;
    }
    if (query && isValid ) {
      searchRestaurants(query, lat, lng).then((results) => {
        setPlaces(results);
      }).catch((error) => {
        console.error("Error during restaurant search:", error);
      });
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
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Restaurants in the current map area
                </Typography>
              </Box>
              <Box sx={{ maxHeight: '100%', overflowY: 'auto', paddingRight: 2 }}>
                {places.map((restaurant) => (
                  <RestaurantCard key={restaurant.place_id} restaurant={restaurant} />
                ))}
              </Box>
            </>
          ) : (<InvalidSearch />)
          }
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
