const BASE_URL = 'https://mobeigi.free.beeceptor.com'; // TODO: Replace with actual backend

// Utility function for making API requests
const fetchApi = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export const getNewRandomGame = () => fetchApi('/game/random'); // TODO: remove mock suffix
