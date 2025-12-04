import { TrainResponse } from '../types';

// Function to clean up the URL parameter
export const parseTrainNumberFromUrl = (): string | null => {
  const search = window.location.search;
  
  if (search) {
    // Handle ?12345 directly
    if (!search.includes('=')) {
      const cleanSearch = search.substring(1).replace(/\/$/, '').trim();
      return /^\d+$/.test(cleanSearch) ? cleanSearch : null;
    }
    
    // Handle ?train=12345
    const params = new URLSearchParams(search);
    return params.get('train');
  }
  
  // Handle hash like #12345
  const hash = window.location.hash;
  if (hash) {
    const cleanHash = hash.substring(1).replace(/\/$/, '').trim();
    return /^\d+$/.test(cleanHash) ? cleanHash : null;
  }

  return null;
};

export const fetchTrainStatus = async (trainNumber: string): Promise<TrainResponse> => {
  try {
    // Using the requested API endpoint
    const response = await fetch(`https://livestatus.railyatri.in/api/v3/train_eta_data/${trainNumber}/0.json?start_day=0`);
    
    if (!response.ok) {
      throw new Error(`Status Service Unavailable: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.success) {
      throw new Error("Train information not found. Please check the train number and try again.");
    }

    return data as TrainResponse;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};