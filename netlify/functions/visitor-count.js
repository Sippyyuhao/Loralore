import { getStore } from '@netlify/blobs';

const allowedOrigins = [
  'https://loralore.netlify.app',
  'https://sippyyuhao.github.io'
];

export const handler = async (event) => {
  const origin = event.headers.origin;
  const headers = {
    'Content-Type': 'application/json'
  };

  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No Content
      headers,
    };
  }
  
  try {
    // 'visitor-counts' is the name of our data store.
    const store = getStore('visitor-counts');
    
    // Get the current count for the key 'total_visits'.
    // If it doesn't exist, default to 0.
    const currentData = await store.get('total_visits', { type: 'json' });
    let count = currentData || 0;
    
    // Increment the count.
    count++;
    
    // Save the new count back to the store.
    await store.setJSON('total_visits', count);

    // Return the new count to the frontend.
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ count }),
    };
  } catch (error) {
    console.error('Error in visitor-count function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update visit count.' }),
    };
  }
}; 