import mongoose from 'mongoose';

const sheetSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    layout: { type: String, required: true },
    settings: { type: String, required: true },
    author: { type: String, required: true },
});

const Sheet = mongoose.model('Sheet', sheetSchema);
export default Sheet;
