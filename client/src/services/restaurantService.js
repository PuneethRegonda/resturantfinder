// Function to search restaurants by query using your Spring Boot backend
const BASE_URL = 'http://localhost:5000';
export const getPincodeFromServer = async (lat, lng) => {
  try {
    const response = await fetch(`${BASE_URL}/getPincode?lat=${lat}&lng=${lng}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const pincode = await response.text(); // Get the pincode as plain text
      return pincode;
    } else {
      console.error(`Error from backend API (${response.status}): ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching pincode from backend:', error);
    return null;
  }
};

// Function to search restaurants using a query
export const searchRestaurants = async (query) => {
  if (!query) {
    console.error("Query must be provided.");
    return [];
  }

  try {
    // Construct query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('query', query); // Add query to the parameters

    // Hit the unified API
    const response = await fetch(`${BASE_URL}/getRestaurants?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.results || []; // Assuming the API returns results in `data.results`
    } else {
      console.error(`Error from backend API (${response.status}): ${response.statusText}`);
      return [];
    }
  } catch (error) {
    console.error('Error during restaurant search:', error);
    return [];
  }
};

// Function to get nearby restaurants using location
export const getNearbyRestaurants = async (lat, lng) => {
  if (!lat || !lng) {
    console.error("Latitude and Longitude must be provided.");
    return [];
  }

  try {
    // Construct location parameter as a string in the format lat,lng
    const location = `${lat},${lng}`;

    // Construct the query parameters manually
    const queryParams = `location=${location}`;

    // Hit the unified API
    const response = await fetch(`${BASE_URL}/getRestaurants?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.results || []; // Assuming the API returns results in `data.results`
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
    const apiKey = 'AIzaSyCX5XGEKQe3G4M0R84r7sZkeTwXlCMtTuU';

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
    const response = await fetch(`${BASE_URL}/api/get-restaurant-details?name=${encodeURIComponent(name)}`);
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

export const getPhotoUrl = (placeID) => {
  if (photoDetails) {
  const apiKey = 'AIzaSyCX5XGEKQe3G4M0R84r7sZkeTwXlCMtTuU'; 
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

