// Function to search restaurants by query using your Spring Boot backend
const BASE_URL = 'http://localhost:5000';

import { fetchWithRequestId } from '../utils/api'; // Adjust the import path based on your project structure

export const searchRestaurants = async ({ page = 0, size = 10, ...filters }) => {
  const priceLevelMap = { LOW: 1, MEDIUM: 2, HIGH: 3 };

  const queryParams = new URLSearchParams({
    page,
    size,
    ...Object.entries(filters).reduce((acc, [key, value]) => {
      if (key === 'priceLevel' && value) {
        acc[key] = priceLevelMap[value.toUpperCase()] || '';
      } else if (value) {
        acc[key] = value;
      }
      return acc;
    }, {}),
  }).toString();


 

  const response = await fetchWithRequestId(`/api/restaurants/search?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch restaurants');
  }
  return await response.json();
};


// Function to get nearby restaurants using the Spring Boot backend
export const getNearbyRestaurants = async (lat, lng) => {
  if (!lat || !lng) {
    console.error("Latitude and Longitude must be provided.");
    return [];
  }

  try {
    // Constructing the URL to call the backend with latitude and longitude
    const url = `${BASE_URL}/api/nearby-restaurants?location=${lat},${lng}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.results || [];
    } else {
      console.error(`Error from backend API (${response.status}): ${response.statusText}`);
      return [];
    }
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error);
    return [];
  }
};

export const checkPincodeValidity = async (pincode) => {
  try {
    // Replace with your actual Google Maps API key
    const apiKey = 'AIzaSyDewJC5STCF9FQRfe1EAVnU8kJvfsRhLPU';

    // Make the API call using fetch
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=${apiKey}`
    );

    // Parse the JSON response
    const data = await response.json();

    // If we receive valid results, assume the pincode is valid
    if (response.status === 200 && data.status === 'OK' && data.results.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking pincode validity:', error);
    // If there's an error (e.g., network issue or 404), we assume the pincode is invalid
    return false;
  }
};

export const getRestaurantDetails = async (id) => {
  try {
    const response = await fetch(`/api/restaurants/${id}?sortBy=recent`);
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success' && data.data) {
        return data.data;
      } else {
        throw new Error("No restaurant details found for the given ID");
      }
    } else {
      throw new Error('Failed to fetch restaurant details');
    }
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    throw error;
  }
};

export const getPhotoUrl = (placeID) => {
  if (photoDetails) {
  const apiKey = 'AIzaSyDewJC5STCF9FQRfe1EAVnU8kJvfsRhLPU'; 
  const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&placeid=${placID}&key=${apiKey}`;
  return googlePhotoUrl;
  }else {
    return 'https://via.placeholder.com/400'; 
  }
};

export const getPlacePhotos = async (placeId, maxwidth = 200) => {
  try {
    const response = await fetch(`${BASE_URL}/place/photos?placeId=${encodeURIComponent(placeId)}&maxwidth=${maxwidth}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch photos: ${response.status} ${response.statusText}`);
    }
    const data = await response.json(); 
    return data; 
  } catch (error) {
    console.error('Error fetching photos:', error.message);
    throw error;
  }
};

