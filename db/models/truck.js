var mongoose = require("mongoose");
var truckSchema = new mongoose.Schema({
  name: {type: String}, 
  rating: { type: Number }, 
  totalRatings: {type: Number},
  comments: {type: Array}
})

module.exports = mongoose.model('Truck', truckSchema)