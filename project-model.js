const mongoose = require('mongoose')
const Schema = mongoose.Schema


// this will be our data base's data structure 
const ProjectSchema = new Schema(
  {
    id: Number,
    name: String,
    description: String,
    type_id: Number,
    user_id: Number,
  },
  { 
  	timestamps: true,
  	toJSON: { virtuals: true }
  }
)

ProjectSchema.virtual('type', {
  ref: 'Type', // The model to use
  localField: 'type_id', 
  foreignField: 'id', 
  justOne: true,
})

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model('Project', ProjectSchema)


