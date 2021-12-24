const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
        code: {type: String, required: true},
        name: {type: String, required: true},
        country: {type: String, required: true},
        brand: {type: String, required: true},
        versions: {type: Array, required: true}
    },
    {
        versionKey: false // You should be aware of the outcome after set to false
    });

modelSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Model', modelSchema);
