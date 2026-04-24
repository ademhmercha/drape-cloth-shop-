const router = require('express').Router();
const { sendContact } = require('../controllers/contactController');

router.post('/', sendContact);

module.exports = router;
