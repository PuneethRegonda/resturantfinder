export const fetchWithRequestId = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Request-ID': crypto.randomUUID(), // Generate a unique ID for every request
    ...(options.headers || {}), // Merge additional headers if provided
  };

  const updatedOptions = { ...options, headers };

  try {
    const response = await fetch(url, updatedOptions);
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

