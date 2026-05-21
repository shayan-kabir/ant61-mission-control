type SendMessagePanelProps = {
  messageText: string;
  setMessageText: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  beaconAlias: string;
};

function SendMessagePanel({
  messageText,
  setMessageText,
  onSend,
  loading,
  beaconAlias,
}: SendMessagePanelProps) {
  return (
    <div className="card mt-3">
      <div className="card-header">
        <strong>Send upstream message</strong>
      </div>

      <div className="card-body">
        <div className="input-group">
          <input
            className="form-control"
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            placeholder="Enter message payload"
          />

          <button
            className="btn btn-primary"
            onClick={onSend}
            disabled={!messageText.trim() || loading}
          >
            Send
          </button>
        </div>

        <small className="text-muted">
          Command back to {beaconAlias}
        </small>
      </div>
    </div>
  );
}

export default SendMessagePanel;