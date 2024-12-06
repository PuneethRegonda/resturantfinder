import { fetchWithRequestId } from '../utils/api';

export const fetchDuplicateRestaurants = async (page, size) => {
  const response = await fetchWithRequestId(`/api/admin/restaurants/duplicates?page=${page}&size=${size}`);
  if (!response.ok) {
    throw new Error('Failed to fetch duplicate restaurants');
  }
  return await response.json();
};

export const deleteDuplicateRestaurants = async (restaurantIds) => {
  const response = await fetchWithRequestId('/api/admin/restaurants/delete', {
    method: 'POST',
    body: JSON.stringify(restaurantIds),
  });
  if (!response.ok) {
    throw new Error('Failed to delete restaurants');
  }
  return await response.json();
};