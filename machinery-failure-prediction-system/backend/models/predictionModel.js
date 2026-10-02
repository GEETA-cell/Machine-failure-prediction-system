const db = require('../config/db');

exports.createReading = async (data) => {
  const q = `
    INSERT INTO sensor_readings
    (
      machine_id,
      machine_type,
      air_temperature,
      process_temperature,
      rotational_speed,
      torque,
      tool_wear
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `;

  return (
    await db.query(q, [
      data.machine_id,
      data.type,
      data.air_temperature,
      data.process_temperature,
      data.rotational_speed,
      data.torque,
      data.tool_wear
    ])
  ).rows[0];
};

exports.createPrediction = async (data) => {
  const q = `
    INSERT INTO predictions
    (
      machine_id,
      sensor_reading_id,
      prediction,
      failure_probability,
      threshold,
      model_name,
      recommendation
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `;

  return (
    await db.query(q, [
      data.machine_id,
      data.sensor_reading_id,
      data.prediction,
      data.failure_probability,
      data.threshold,
      data.model_name,
      data.recommendation
    ])
  ).rows[0];
};

exports.getRecent = async (limit = 20) => {
  return (
    await db.query(
      `
      SELECT
        p.*,
        m.machine_code,
        m.machine_name
      FROM predictions p
      JOIN machines m ON m.id = p.machine_id
      ORDER BY p.created_at DESC
      LIMIT $1
      `,
      [limit]
    )
  ).rows;
};