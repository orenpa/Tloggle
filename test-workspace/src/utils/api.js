const API_URL = 'https://api.example.com';

async function fetchData(endpoint) {
    // console.log('Fetching data from:', endpoint);
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        const data = await response.json();
        console.log('Received data:', data);
        return data;
    } catch (error) {
        console.error('API Error:', error);
        // console.error('Full error details:', { error });
        throw error;
    }
}

function processResponse(data) {
    // console.log('Processing response...');
    if (!data) {
        console.warn('Empty response received');
        return null;
    }
    // console.log('Processing complete');
    return data;
}

export { fetchData, processResponse }; 