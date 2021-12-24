const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const versionSchema = new Schema({
      code: {type: String, required: true},
      name: {type: String, required: true},
      model: {type: String, required: true},
      country: {type: String, required: true},
      brand: {type: String, required: true},
      currency: {type: String, required: true},
      price: {type: String, required: true},
    },
    {
      versionKey: false // You should be aware of the outcome after set to false
    });



module.exports = mongoose.model('Version', versionSchema);
