import { fetchWithRequestId } from '../utils/api';

export const fetchDuplicateRestaurants = async (page, size) => {
  const response = await fetchWithRequestId(`/api/admin/restaurants/duplicates?page=${page}&size=${size}`);
  if (!response.ok) {
    throw new Error('Failed to fetch duplicate restaurants');
  }
  return await response.json();
};


/**
 * Deletes multiple restaurants by their IDs
 * @param {number[]} restaurantIds - List of restaurant IDs to delete
 * @returns {Promise<boolean>} - Success indicator
 */
export const deleteMultipleRestaurants = async (restaurantIds) => {
  try {
    const response = await fetchWithRequestId('/api/admin/restaurants/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurantIds), // Send IDs as a JSON array
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'Failed to delete restaurants');
    }

    return true; // Indicate success
  } catch (error) {
    console.error('Error deleting restaurants:', error);
    throw error;
  }
};