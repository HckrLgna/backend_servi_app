const { Schema, model } = require('mongoose');
const VehiclesSchema = Schema({
    brand: {
        type: String,
        required: [true, 'Brand is required']
    },
    model: {
        type: String,
        required: [true, 'Model is required']
    },
    typeCombustible: {
        type: String,
        required: [true, 'Type combustible is required']
    },
    licensePlate:{
        type: String,
        required: false,
    },
    pathImage:{
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: false
    }
});

VehiclesSchema.methods.toJSON = function() {
    const { __v, ...vehicle } = this.toObject();
    return vehicle;
}
 
module.exports = model('Vehicles', VehiclesSchema);