const Service = require('../models/Service');

// @desc  Get all services (with filters)
// @route GET /api/services
const getServices = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (category && category !== 'All') query.category = category;
    if (search) query.$text = { $search: search };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [services, total] = await Promise.all([
      Service.find(query)
        .populate('provider', 'name avatar location averageRating')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Service.countDocuments(query),
    ]);

    res.json({ services, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get single service
// @route GET /api/services/:id
const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      'provider',
      'name avatar bio location skills averageRating totalReviews'
    );
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Create service
// @route POST /api/services
const createService = async (req, res) => {
  try {
    const service = await Service.create({ ...req.body, provider: req.user._id });
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc  Update service
// @route PUT /api/services/:id
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.provider.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc  Delete service
// @route DELETE /api/services/:id
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.provider.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await service.deleteOne();
    res.json({ message: 'Service removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getServices, getService, createService, updateService, deleteService };
