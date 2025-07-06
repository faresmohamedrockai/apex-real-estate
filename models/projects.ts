import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  name_en: {
    type: String,
    trim: true
  },

  image: [String],

  zone: {
    type: String,
    trim: true
  },
  zone_en: {
    type: String,
    trim: true
  },

  developerId: {
    type: Schema.Types.ObjectId,
    ref: 'Developer', 
    required: false
  },

  inventories: [{
    type: Schema.Types.ObjectId,
    ref: 'Inventory'
  }],

  latitude: {
    type: Number,
    required: false,
  },
  longitude: {
    type: Number,
    required: false,
  },
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export default Project;
