const router = require('express').Router();
const c = require('../controllers/predictionController');
router.post('/', c.predict);
router.get('/recent', c.recent);
module.exports = router;
