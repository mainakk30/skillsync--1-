const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      enum: ['Design', 'Writing', 'Dev', 'Tutoring', 'Marketing', 'Video', 'Finance', 'Other'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    priceUnit: {
      type: String,
      enum: ['project', 'hour', 'word', 'page'],
      default: 'project',
    },
    deliveryDays: { type: Number, default: 3 },
    tags: [{ type: String }],
    images: [{ type: String }],
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index for search
serviceSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Service', serviceSchema);
