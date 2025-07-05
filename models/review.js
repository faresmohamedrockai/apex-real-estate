const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'رقم الهاتف مطلوب'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'التقييم مطلوب'],
    min: 1,
    max: 5,
    default: 5
  },
  review: {
    type: String,
    required: [true, 'المراجعة مطلوبة'],
    trim: true,
    maxlength: [1000, 'المراجعة لا يمكن أن تتجاوز 1000 حرف']
  },
  canShow: {
    type: Boolean,
    default: false // المراجعات لا تظهر تلقائياً حتى يتم الموافقة عليها
  },
  isApproved: {
    type: Boolean,
    default: false // للموافقة الإدارية
  },
  project: {
    type: String,
    trim: true
  },
  unitType: {
    type: String,
    enum: ['سكني', 'تجاري', 'مكتبي'],
    default: 'سكني'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ canShow: 1, isApproved: 1 });
reviewSchema.index({ rating: -1 });

// Virtual for formatted date
reviewSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Ensure virtual fields are serialized
reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

// Use singleton pattern to prevent model recompilation
module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
