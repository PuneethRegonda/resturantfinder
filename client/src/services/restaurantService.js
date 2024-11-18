// Function to search restaurants by query using your Spring Boot backend
export const searchRestaurants = async (query, lat, lng) => {
  try {
    // Destructure filters
    // const { cuisineType, foodType, priceLevel, minRating } = filters;

    // Construct query parameters
    const queryParams = new URLSearchParams();
    if (query) queryParams.append('query', query);
    // if (cuisineType) queryParams.append('cuisineType', cuisineType);
    // if (foodType) queryParams.append('foodType', foodType);
    // if (priceLevel) queryParams.append('priceLevel', priceLevel);
    // if (minRating) queryParams.append('minRating', minRating);

    const response = await fetch(`http://localhost:5000/api/search-restaurants?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.results; // Assuming the API returns an array of restaurant objects
    } else {
      console.error(`Error from backend search API (${response.status}): ${response.statusText}`);
      return [];
    }
  } catch (error) {
    console.error('Error during restaurant search:', error);
    return [];
  }
};




// src/services/restaurantService.js

// Function to get nearby restaurants using the Spring Boot backend
export const getNearbyRestaurants = async (lat, lng) => {
  if (!lat || !lng) {
    console.error("Latitude and Longitude must be provided.");
    return [];
  }

  try {
    // Constructing the URL to call the backend with latitude and longitude
    const url = `http://localhost:5000/api/nearby-restaurants?location=${lat},${lng}`;

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

export const getRestaurantDetails = async (name) => {
  try {
    const response = await fetch(`http://localhost:5000/api/get-restaurant-details?name=${encodeURIComponent(name)}`);
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        // Assuming we need to return the first result
        return data.results[0];
      } else {
        throw new Error("No restaurant details found for the given name");
      }
    } else {
      throw new Error('Failed to fetch restaurant details');
    }
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    throw error;
  }
};
export const getPhotoUrl = (photoReference) => {
  if (!photoReference) {
    console.error('No photo reference provided');
    return 'https://via.placeholder.com/400'; // Placeholder if no photo reference is provided
  }

  const apiKey = 'AIzaSyDewJC5STCF9FQRfe1EAVnU8kJvfsRhLPU'; // Replace with your actual API key
  const googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${photoReference}&key=${apiKey}`;

  return googlePhotoUrl;
};
