import type { BeaconTelemetry } from '../types/ant61';

interface Props {
  telemetry: BeaconTelemetry;
}

function TelemetryCards({ telemetry }: Props) {
  return (
    <div className="row g-3 mt-3">
      <div className="col-md-3">
        <div className="card p-3">
          <small className="text-muted">Battery</small>
          <h3>{telemetry.battery_remaining ?? 'N/A'}%</h3>
          <small>{telemetry.battery_charging ? 'Charging' : 'Not charging'}</small>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3">
          <small className="text-muted">Signal</small>
          <h3>{telemetry.signal_quality ?? 'N/A'} / 10</h3>
          <small>Iridium link</small>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3">
          <small className="text-muted">Latency</small>
          <h3>{telemetry.latency ?? 'N/A'}ms</h3>
          <small>Round trip</small>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3">
          <small className="text-muted">Altitude</small>
          <h3>{telemetry.location_altitude ?? 'N/A'}m</h3>
          <small>Latest GPS altitude</small>
        </div>
      </div>
    </div>
  );
}

export default TelemetryCards;