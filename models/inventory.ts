import mongoose from 'mongoose';
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

  region: {
    type: String,
    required: false,
  },

  project: {
    type: String,
    required: false,
  },

  isUnique: Boolean,

  
  latitude: {
    type: Number,
    required: false,
  },
  longitude: {
    type: Number,
    required: false,
  },
});

const inventory = mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);
export default inventory;
