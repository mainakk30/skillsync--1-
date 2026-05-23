const Booking = require('../models/Booking');
const Service = require('../models/Service');

// @desc  Get bookings for current user
// @route GET /api/bookings
const getBookings = async (req, res) => {
  try {
    const filter =
      req.user.role === 'provider'
        ? { provider: req.user._id }
        : { client: req.user._id };

    const bookings = await Booking.find(filter)
      .populate('service', 'title price priceUnit category')
      .populate('client', 'name email')
      .populate('provider', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Create booking
// @route POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { serviceId, brief, budget } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.provider.toString() === req.user._id.toString())
      return res.status(400).json({ message: 'You cannot book your own service' });

    const booking = await Booking.create({
      service: serviceId,
      client: req.user._id,
      provider: service.provider,
      brief,
      budget,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc  Update booking status (provider accepts/declines)
// @route PUT /api/bookings/:id
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const isProvider = booking.provider.toString() === req.user._id.toString();
    const isClient = booking.client.toString() === req.user._id.toString();
    if (!isProvider && !isClient) return res.status(403).json({ message: 'Not authorized' });

    const { status } = req.body;
    const allowed = isProvider
      ? ['accepted', 'declined', 'completed']
      : ['cancelled'];

    if (!allowed.includes(status))
      return res.status(400).json({ message: `Cannot set status to '${status}'` });

    booking.status = status;
    if (status === 'completed') booking.completedAt = new Date();
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getBookings, createBooking, updateBooking };
