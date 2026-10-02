const model = require('../models/predictionModel');

const ML_API_URL =
  process.env.ML_API_URL || 'http://localhost:8000';

async function predictWithModel(input) {
  console.log('ML_API_URL =', ML_API_URL);
console.log('ML REQUEST URL =', `${ML_API_URL}/predict`);

  const response = await fetch(`${ML_API_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: input.type,
      air_temperature: Number(input.air_temperature),
      process_temperature: Number(input.process_temperature),
      rotational_speed: Number(input.rotational_speed),
      torque: Number(input.torque),
      tool_wear: Number(input.tool_wear)
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ML service error: ${errorText}`);
  }

  return await response.json();
}


exports.predict = async (req, res, next) => {

  try {

    const input = req.body;

    if (!input.machine_id) {
      return res.status(400).json({
        message: 'machine_id is required'
      });
    }

    const requiredFields = [
      'type',
      'air_temperature',
      'process_temperature',
      'rotational_speed',
      'torque',
      'tool_wear'
    ];

    for (const field of requiredFields) {

      if (
        input[field] === undefined ||
        input[field] === null ||
        input[field] === ''
      ) {
        return res.status(400).json({
          message: `${field} is required`
        });
      }
    }

    // 1. Call trained XGBoost model
    const result = await predictWithModel(input);

    // 2. Store sensor reading
    const reading = await model.createReading(input);

    // 3. Store prediction
    const prediction = await model.createPrediction({
      ...result,
      machine_id: input.machine_id,
      sensor_reading_id: reading.id
    });

    res.status(201).json({
      reading,
      prediction
    });

  } catch (e) {
    next(e);
  }
};


exports.recent = async (req, res, next) => {

  try {

    const limit = Math.min(
      Number(req.query.limit) || 20,
      100
    );

    res.json(
      await model.getRecent(limit)
    );

  } catch (e) {
    next(e);
  }
};