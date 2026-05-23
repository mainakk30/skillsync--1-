const Review = require('../models/Review');
const Booking = require('../models/Booking');

// @desc  Get reviews for a service
// @route GET /api/reviews/:serviceId
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('reviewer', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Submit a review
// @route POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.client.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Only the client can review' });
    if (booking.status !== 'completed')
      return res.status(400).json({ message: 'Can only review completed bookings' });

    const review = await Review.create({
      service: booking.service,
      reviewer: req.user._id,
      booking: bookingId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Already reviewed this booking' });
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getReviews, createReview };
