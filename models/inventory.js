const mongoose = require('mongoose');
const { Schema } = mongoose;

const InventorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: Number,

  unitType: {
    type: String,
    default: 'Apartment',
  },

  images: [String],

  bedrooms: {
    type: Number,
    default: 1,
  },

  bathrooms: {
    type: Number,
    default: 1,
  },

  area: {
    type: Number, 
    default: 0,
  },

  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },

  isUnique: Boolean,
});

const inventory = mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);
module.exports = inventory;
