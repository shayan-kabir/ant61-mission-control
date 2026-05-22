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



export const SEND_UPSTREAM_MESSAGE = `
  mutation SendMessageString($beaconUid: uuid!, $payloadString: String!, $customId: bigint!) {
    insert_message(
      objects: [
        {
          beacon_uid: $beaconUid
          direction: upstream
          payload_string: $payloadString
          custom_id: $customId
        }
      ]
    ) {
      returning {
        uid
      }
    }
  }
`;



export const FETCH_LATEST_MESSAGES_FOR_BEACON = `
          query {
            message(
            limit: 3
              order_by: { created_at: desc }

            ) {
              uid
              created_at
              direction
              payload_length
             
              payload_string
            }
          }
      `