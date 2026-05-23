const express = require('express');
const router = express.Router();
const { getReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/:serviceId', getReviews);
router.post('/', protect, createReview);

module.exports = router;
