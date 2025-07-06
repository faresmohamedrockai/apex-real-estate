// models/Developer.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const DeveloperSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  name_en: {
    type: String,
    trim: true
  },
  logo: String,
  description: {
    type: String,
    trim: true
  },
  description_en: {
    type: String,
    trim: true
  },
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    }
  ]
});

const Developer = mongoose.models.Developer || mongoose.model('Developer', DeveloperSchema);
export default Developer;
