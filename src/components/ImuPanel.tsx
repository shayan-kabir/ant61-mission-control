import type { BeaconTelemetry } from '../types/ant61';

interface Props {
  telemetry: BeaconTelemetry;
}

function ImuPanel({ telemetry }: Props) {
  return (
    <div className="card mt-3">
      <div className="card-header">
        <strong>IMU / orientation</strong>
      </div>

      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-3">
            <small className="text-muted">Acc X</small>
            <h5>{telemetry.imu_acc_x ?? 'N/A'} g</h5>
          </div>

          <div className="col-md-3">
            <small className="text-muted">Acc Z</small>
            <h5>{telemetry.imu_acc_z ?? 'N/A'} g</h5>
          </div>

          <div className="col-md-3">
            <small className="text-muted">Rot X</small>
            <h5>{telemetry.imu_rot_x ?? 'N/A'} dps</h5>
          </div>

          <div className="col-md-3">
            <small className="text-muted">Rot Z</small>
            <h5>{telemetry.imu_rot_z ?? 'N/A'} dps</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImuPanel;