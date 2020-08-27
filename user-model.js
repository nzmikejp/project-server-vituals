var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// this will be our data base's data structure 
var UserSchema = new Schema(
  {
    id: Number,
    name: String,
    username: String,
    password: String,
    email: String,
  },
  { timestamps: true }
)

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model('User', UserSchema);