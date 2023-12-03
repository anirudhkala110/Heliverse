const mongoose = require('mongoose');
const addUserModal = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    }
});

const AddUserModal = mongoose.model('UserModal', addUserModal);

module.exports = AddUserModal;
