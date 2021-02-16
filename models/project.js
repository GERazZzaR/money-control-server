const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: { type: String },
  active: { type: Boolean },
  date: { type: Date },
});

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;