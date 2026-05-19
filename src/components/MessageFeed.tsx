import type { Message } from '../types/ant61';

interface Props {
  messages: Message[];
}

function MessageFeed({ messages }: Props) {
    return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <strong>Message feed</strong>
        <span className="badge text-bg-primary">{messages.length} messages</span>
      </div>
      <div className="list-group list-group-flush">
        {messages.map((message) => (
          <div key={message.uid} className="list-group-item">
            <div className="d-flex justify-content-between">
              <div>
                <span
                  className={
                    message.direction === 'downstream'
                      ? 'badge text-bg-info me-2'
                      : 'badge text-bg-success me-2'
                  }
                >
                  {message.direction}
                </span>
                <code>{message.uid.slice(0, 8)}...</code>
              </div>
              <small className="text-muted">{message.payload_length} bytes</small>
            </div>
            <div className="mt-2">{message.payload_string}</div>
            <small className="text-muted">
              Created at: {new Date(message.created_at).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessageFeed;