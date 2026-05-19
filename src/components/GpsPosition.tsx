import type { BeaconTelemetry } from '../types/ant61';

interface Props {
  telemetry: BeaconTelemetry;
}

function GpsPosition({ telemetry }: Props) {
  return (
    <div className="card mt-3">
      <div className="card-header">
        <strong>GPS position</strong>
      </div>

      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <small className="text-muted">Latitude</small>
            <h5>
              {telemetry.location_latitude != null
                ? telemetry.location_latitude.toFixed(3)
                : 'N/A'}
            </h5>
          </div>

          <div className="col-md-4">
            <small className="text-muted">Longitude</small>
            <h5>
              {telemetry.location_longitude != null
                ? telemetry.location_longitude.toFixed(3)
                : 'N/A'}
            </h5>
          </div>

          <div className="col-md-4">
            <small className="text-muted">Altitude</small>
            <h5>{telemetry.location_altitude ?? 'N/A'} m</h5>
          </div>
        </div>

        <small className="text-muted">
          Timestamp:{' '}
          {telemetry.location_timestamp
            ? new Date(telemetry.location_timestamp).toLocaleString()
            : 'N/A'}
        </small>
      </div>
    </div>
  );
}

export default GpsPosition;