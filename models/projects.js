// models/Project.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image: [String],
  zone: String,

  developerId: {
    type: Schema.Types.ObjectId,
    ref: 'Developer', 
    required: false
  },

  inventories: [{
    type: Schema.Types.ObjectId,
    ref: 'Inventory'
  }]
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
module.exports = Project;
