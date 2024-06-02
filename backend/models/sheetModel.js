const mongoose = require('mongoose');

const sheetSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    layout: { type: String, required: true },
    settings: { type: String, required: true },
    author: { type: String, required: true },
});

module.exports = mongoose.model('sheet', sheetSchema);
