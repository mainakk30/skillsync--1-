const express = require('express');
const router = express.Router();
const { getBookings, createBooking, updateBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getBookings);
router.post('/', protect, createBooking);
router.put('/:id', protect, updateBooking);

module.exports = router;
