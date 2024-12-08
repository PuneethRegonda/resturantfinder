// Function to search restaurants by query using your Spring Boot backend
const BASE_URL = '';

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

export const getGooglePhotoUrlsByPlaceId = async (placeId) => {
  if (!placeId) {
    throw new Error('Invalid place ID provided');
  }

  try {
    // Call the backend API to fetch photo URLs
    const response = await fetchWithRequestId(`/api/restaurants/google-photos?placeid=${placeId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch photo URLs from Google via backend');
    }

    // Parse the response JSON
    const data = await response.json();

    if (data.status !== 'success' || !Array.isArray(data.data)) {
      throw new Error('Unexpected response structure or missing photo URLs');
    }

    // Return the array of photo URLs
    return data.data;
  } catch (error) {
    console.error('Error in getGooglePhotoUrlsByPlaceId:', error);
    throw error; // Rethrow the error for the caller to handle
  }
};



export const searchGoogleRestaurants = async (location) => {
  if (!location || !location.lat || !location.lng) {
    throw new Error('Invalid location provided');
  }

  const queryParams = `${location.lat},${location.lng}`;

  try {
    const response = await fetchWithRequestId(`/api/restaurants/google?location=${queryParams}`);

    if (!response.ok) {
      throw new Error('Failed to fetch restaurants from Google via backend');
    }

    const data = await response.json();

    if (data.status="success") {
      const googlePlacesResponse = JSON.parse(data.data.body); // Extract Google Places API response
      if (googlePlacesResponse.status === 'OK') {
        return googlePlacesResponse.results.map((restaurant) => ({
          id: restaurant.place_id,
          name: restaurant.name,
          address: restaurant.vicinity,
          rating: restaurant.rating,
          source: 'Google',
        }));
      } else {
        throw new Error(`Google Places API returned an error: ${googlePlacesResponse.status}`);
      }
    } else {
      throw new Error(`Backend API returned an error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error in searchGoogleRestaurants:', error);
    throw error; // Rethrow the error for the caller to handle
  }
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
    const apiKey = 'AIzaSyD3fqwSWp1IuXJesIHBUf1GEhWRVT_LJP4';

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


export const getLocation = async (pincode) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=AIzaSyD3fqwSWp1IuXJesIHBUf1GEhWRVT_LJP4`
    );
    const data = await response.json();
    if (response.status === 200 && data.status === 'OK' && data.results.length > 0) {
      return data.results[0].geometry.location;
    } else {
      return {};
    }
  } catch (error) {
    console.error('Error checking pincode validity:', error);
    return {lat: 37.3304795, lng: -121.905282};
  }
};

export const getRestaurantDetails = async (id) => {
  try {
    const response = await fetchWithRequestId(`/api/restaurants/${id}?sortBy=recent`);
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



