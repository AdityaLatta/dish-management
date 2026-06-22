const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/dishes — Return all dishes
router.get('/', (req, res) => {
  try {
    const dishes = db.prepare('SELECT * FROM dishes').all();
    // Convert SQLite integer 0/1 back to boolean
    const normalized = dishes.map(d => ({
      ...d,
      isPublished: d.isPublished === 1
    }));
    res.json(normalized);
  } catch (err) {
    console.error('[GET /api/dishes] Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch dishes' });
  }
});

// PATCH /api/dishes/:id/toggle — Toggle isPublished status
router.patch('/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;

    // Check if dish exists
    const dish = db.prepare('SELECT * FROM dishes WHERE dishId = ?').get(id);
    if (!dish) {
      return res.status(404).json({ error: `Dish with id '${id}' not found` });
    }

    // Toggle: flip 0 → 1 or 1 → 0
    const newStatus = dish.isPublished === 1 ? 0 : 1;

    db.prepare('UPDATE dishes SET isPublished = ? WHERE dishId = ?').run(newStatus, id);

    const updatedDish = {
      ...dish,
      isPublished: newStatus === 1
    };

    // Emit real-time event to all connected Socket.IO clients
    // We attach `io` to the router via app.set('io', ...)
    const io = req.app.get('io');
    if (io) {
      io.emit('dish:updated', updatedDish);
    }

    res.json(updatedDish);
  } catch (err) {
    console.error('[PATCH /api/dishes/:id/toggle] Error:', err.message);
    res.status(500).json({ error: 'Failed to toggle dish status' });
  }
});

module.exports = router;
