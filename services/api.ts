import { TrainResponse } from '../types';

// Function to clean up the URL parameter
export const parseTrainNumberFromUrl = (): string | null => {
  // Check Query String first ?12345 or ?train=12345
  const search = window.location.search;
  if (search) {
    if (search.includes('=')) {
      const params = new URLSearchParams(search);
      return params.get('train');
    } else {
      // Direct ?12345
      return search.substring(1);
    }
  }
  
  // Check Hash #12345
  const hash = window.location.hash;
  if (hash) {
    return hash.substring(1);
  }

  return null;
};

export const fetchTrainStatus = async (trainNumber: string): Promise<TrainResponse> => {
  try {
    // Note: In a production environment, this should go through a proxy to avoid CORS issues 
    // if the provider doesn't allow direct browser access.
    // For this specific requirement, we fetch directly.
    const response = await fetch(`https://livestatus.railyatri.in/api/v3/train_eta_data/${trainNumber}/0.json?start_day=0`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data || !data.success) {
      throw new Error("Train not found or service unavailable");
    }

    return data as TrainResponse;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};