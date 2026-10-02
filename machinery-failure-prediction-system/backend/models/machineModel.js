const db = require('../config/db');

exports.getAll = async () => (await db.query('SELECT * FROM machines ORDER BY id')).rows;
exports.getById = async (id) => (await db.query('SELECT * FROM machines WHERE id=$1', [id])).rows[0];
