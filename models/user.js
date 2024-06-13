const { schema, model } = require('mongoose');
const userSchema = schema({
    email:{
        type: String, 
        required: [true, 'Email is required'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    name:{
        type: String,
        required: [true, 'Name is required']
    },
    role:{
        type: String,
        required: true,
        default: 'CLIENT_ROLE'
    },
});

module.exports = model('User', userSchema);