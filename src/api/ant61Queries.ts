export const GET_LATEST_TELEMETRY_FOR_BEACON = `

  query GetLatestTelemetryForBeacon($beaconUid: uuid!) {
    beacon_telemetry_message(
      limit: 1
      order_by: { created_at: desc }
      where: {
        beacon_uid: { _eq: $beaconUid }
      }
    ) {
      uid
      created_at
      location_longitude
      location_latitude
      location_altitude
      location_timestamp
      signal_quality
      battery_remaining
      battery_charging
      imu_acc_x
      imu_acc_z
      imu_rot_x
      imu_rot_z
      orientation_x
      orientation_y
      latency
      firmware_version
    }
  }
`;






export const GET_BEACONS = `
  query GetBeacons {
    beacon {
      uid
      alias
      status
      last_seen_at
    }
  }
`;