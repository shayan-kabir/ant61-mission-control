export interface Message {
  uid: string;
  created_at: string;
  direction: string;
  payload_length: number;
  payload_crc: number;
  payload_string: string;
}

export interface MessagesResponse {
  message: Message[];
}



export interface BeaconTelemetry {
  uid: string;
  created_at: string;
  location_longitude: number | null;
  location_latitude: number | null;
  location_altitude: number | null;
  location_timestamp: string | null;
  signal_quality: number | null;
  battery_remaining: number | null;
  battery_charging: boolean | null;
  imu_acc_x: number | null;
  imu_acc_z: number | null;
  imu_rot_x: number | null;
  imu_rot_z: number | null;
  orientation_x: number | null;
  orientation_y: number | null;
  latency: number | null;
  firmware_version?: string | null;

}

export interface TelemetryResponse {
  beacon_telemetry_message: BeaconTelemetry[];

}





export interface Beacon {
  uid: string;
  alias: string;
  status: string;
  last_seen_at: string;
}

export interface BeaconsResponse {
  beacon: Beacon[];
}