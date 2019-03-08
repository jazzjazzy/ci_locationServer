const mongoose = require('mongoose');

var driversSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    token: { type: String, required: false },
    name: { type: String, required: false },
    available: Boolean,
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        altitude: { type: Number, required: false },
      },
  }
);

module.exports = mongoose.model('Drivers', driversSchema);