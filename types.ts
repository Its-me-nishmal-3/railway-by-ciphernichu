export interface Station {
  si_no: number;
  station_code: string;
  station_name: string;
  is_diverted_station: boolean;
  distance_from_source: number;
  distance_from_current_station?: number;
  distance_from_current_station_txt?: string;
  sta: string; // Scheduled Time Arrival
  std: string; // Scheduled Time Departure
  eta: string; // Estimated Time Arrival
  etd: string; // Estimated Time Departure
  halt: number;
  a_day: number;
  arrival_delay: number;
  platform_number: number;
  station_lat?: number;
  station_lng?: number;
  on_time_rating?: number;
}

export interface CurrentLocationInfo {
  type: number;
  label: string;
  message: string;
  readable_message: string;
  hint: string;
}

export interface NextStoppageInfo {
  next_stoppage_title: string;
  next_stoppage: string;
  next_stoppage_time_diff: string;
  next_stoppage_delay: number;
}

export interface TrainResponse {
  success: boolean;
  user_id: number;
  train_number: string;
  train_name: string;
  gps_unable: boolean;
  train_start_date: string;
  notification_date: string;
  at_src_dstn: boolean;
  at_src: boolean;
  at_dstn: boolean;
  is_run_day: boolean;
  source: string;
  destination: string;
  source_stn_name: string;
  dest_stn_name: string;
  run_days: string;
  journey_time: number;
  std: string;
  fog_incidence_probability: number;
  pantry_available: boolean;
  update_time: string;
  travelling_towards: string;
  distance_from_source: number;
  total_distance: number;
  avg_speed: number;
  current_station_code: string;
  current_station_name: string;
  status: string;
  eta: string;
  etd: string;
  delay: number;
  ahead_distance: number;
  ahead_distance_text: string;
  status_as_of: string;
  platform_number: number;
  cur_stn_sta: string;
  cur_stn_std: string;
  stoppage_number: number;
  upcoming_stations: Station[];
  previous_stations: Station[];
  next_stoppage_info: NextStoppageInfo;
  current_location_info: CurrentLocationInfo[];
}