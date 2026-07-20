ALTER TABLE events ADD COLUMN ip_address TEXT;
CREATE INDEX IF NOT EXISTS idx_events_ip_address ON events (ip_address, occurred_at);
