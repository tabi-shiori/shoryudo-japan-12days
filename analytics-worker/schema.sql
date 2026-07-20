CREATE TABLE IF NOT EXISTS events (
  event_id TEXT PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  section_id TEXT,
  target_id TEXT,
  metadata TEXT NOT NULL DEFAULT '{}',
  duration_seconds INTEGER,
  path TEXT NOT NULL,
  referrer_host TEXT,
  ip_hash TEXT,
  ip_masked TEXT,
  country TEXT,
  device_type TEXT,
  locale TEXT,
  occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_occurred_at ON events (occurred_at);
CREATE INDEX IF NOT EXISTS idx_events_visitor ON events (visitor_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_events_session ON events (session_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_events_name ON events (event_name, occurred_at);
CREATE INDEX IF NOT EXISTS idx_events_ip_hash ON events (ip_hash, occurred_at);
