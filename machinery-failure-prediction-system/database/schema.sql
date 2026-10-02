CREATE TABLE IF NOT EXISTS machines (
    id SERIAL PRIMARY KEY,
    machine_code VARCHAR(50) UNIQUE NOT NULL,
    machine_name VARCHAR(120) NOT NULL,
    machine_type VARCHAR(80),
    location VARCHAR(120),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    machine_id INTEGER NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    temperature NUMERIC(10,3),
    vibration NUMERIC(10,3),
    pressure NUMERIC(10,3),
    rotational_speed NUMERIC(10,3),
    torque NUMERIC(10,3),
    tool_wear NUMERIC(10,3),
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS predictions (
    id BIGSERIAL PRIMARY KEY,
    machine_id INTEGER NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    sensor_reading_id BIGINT REFERENCES sensor_readings(id) ON DELETE SET NULL,
    prediction VARCHAR(30) NOT NULL,
    failure_probability NUMERIC(6,5),
    model_name VARCHAR(100),
    recommendation TEXT,
    predicted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sensor_machine_time ON sensor_readings(machine_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_prediction_machine_time ON predictions(machine_id, predicted_at DESC);

INSERT INTO machines (machine_code, machine_name, machine_type, location)
VALUES
('MCH-001', 'CNC Machine 01', 'CNC', 'Production Line A'),
('MCH-002', 'Hydraulic Press 01', 'Hydraulic Press', 'Production Line B'),
('MCH-003', 'Industrial Motor 01', 'Motor', 'Production Line C')
ON CONFLICT (machine_code) DO NOTHING;
