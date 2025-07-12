import mongoose from 'mongoose';

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
  review_en: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  canShow: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  project: {
    type: String,
    trim: true
  },
  project_en: {
    type: String,
    trim: true
  },
  unitType: {
    type: String,
    enum: ['سكني', 'تجاري', 'مكتبي', 'إداري'],
    default: 'سكني'
  },
  unitType_en: {
    type: String,
    enum: ['Residential', 'Commercial', 'Office', 'Administrative'],
    default: 'Residential'
  },
  avatar: {
    type: String,
    trim: true,
    default: ''
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

// Indexes
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ canShow: 1, isApproved: 1 });
reviewSchema.index({ rating: -1 });

// Virtual formatted date
reviewSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
