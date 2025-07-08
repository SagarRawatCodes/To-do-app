const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, default: 'Personal' },
  dueDate: { type: String },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Task', TaskSchema);
