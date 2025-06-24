import { getStore } from '@netlify/blobs';

const allowedOrigins = [
  'https://loralore.netlify.app',
  'https://sippyyuhao.github.io',
  // Add 'null' for local file testing (opening index.html directly)
  'null' 
];

export const handler = async (event) => {
  // Use optional chaining for safer access
  const origin = event.headers?.origin || (event.headers?.host?.includes('localhost') ? `http://${event.headers.host}` : 'null');
  
  const headers = {
    'Content-Type': 'application/json'
  };

  // Only add CORS headers if the origin is in our allowed list
  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
    };
  }
  
  try {
    const siteID = process.env.NETLIFY_SITE_ID;
    const token = process.env.NETLIFY_API_TOKEN;

    if (!siteID || !token) {
      // This error will now be visible in the function logs.
      throw new Error('Required environment variables NETLIFY_SITE_ID and/or NETLIFY_API_TOKEN are not set.');
    }

    // Manually provide the siteID and token.
    const store = getStore({
      name: 'visitor-counts',
      siteID,
      token,
    });
    
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
      body: JSON.stringify({ error: 'Failed to update visit count.', details: error.message }),
    };
  }
}; 