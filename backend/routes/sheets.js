import express from 'express';
import Sheet from '../models/sheetModel.js';

const router = express.Router();

// Get all sheets for a specific author
router.get('/sheetCollection', async (req, res) => {
    const { author } = req.query;
    try {
        let sheets;
        if (author) {
            sheets = await Sheet.find({ 'settings.author': author });
        } else {
            sheets = await Sheet.find();
        }
        res.json(sheets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single sheet by ID
router.get('/sheet/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Validate the ID format
        if (id.length !== 10) {
            return res.status(400).json({ error: 'Invalid sheet ID length' });
        }

        const sheet = await Sheet.findOne({ id });

        if (!sheet) {
            return res.status(404).json({ error: 'Sheet not found' });
        }

        res.json(sheet);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// Create a new sheet
router.post('/sheet', async (req, res) => {
    console.log(req.body);
    const sheet = new Sheet({
        id: req.body.id,
        layout: req.body.layout,
        style: req.body.style,
        settings: req.body.settings,
        author: req.body.author || 'noAuthor',
    });

    try {
        const newSheet = await sheet.save();
        res.status(201).json(newSheet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE route to delete a sheet by ID
router.delete('/sheet/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to delete sheet with id: ${id}`); // Log the ID
    try {
        // Validate the ID format
        if (id.length !== 10) {
            console.log('Invalid sheet ID length'); // Log validation failure
            return res.status(400).json({ error: 'Invalid sheet ID length' });
        }

        const sheet = await Sheet.findOne({ id });
        console.log('Sheet found:', sheet); // Log the found sheet

        if (!sheet) {
            console.log('Sheet not found'); // Log if sheet is not found
            return res.status(404).json({ error: 'Sheet not found' });
        }

        await Sheet.deleteOne({ id });
        console.log('Sheet deleted successfully'); // Log successful deletion

        res.json({ message: 'Sheet deleted successfully' });
    } catch (error) {
        console.log('Error:', error); // Log any errors
        res.status(500).json({ error: error.message });
    }
});

export default router;
