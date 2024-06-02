import express from 'express';
import { nanoid } from 'nanoid';
import Sheet from '../models/sheetModel.js';

const router = express.Router();

// Get all sheets
router.get('/sheetCollection', async (req, res) => {
    try {
        const sheets = await Sheet.find();
        res.json(sheets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/sheet', async (req, res) => {
    const sheet = new Sheet({
        id: nanoid(10),
        title: req.body.title || 'noTitle',
        layout: req.body.layout,
        settings: req.body.settings,
        author: req.body.author || 'noAuthor',
    });

    try {
        const newSheet = await sheet.save();
        res.status(201).json(newSheet);
    } catch (error) {
        res.status(400).json({ error });
    }
});

export default router;
